import express from "express";
import protect from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/isAdmin.js";
import Contest from "../models/Contest.js";
import User from "../models/User.js";
import Room from "../models/Room.js";
import fetch from "node-fetch";

const contestRoute = express.Router();

// Helper to extract slug from URL
function extractSlugFromUrl(url) {
  const match = url.match(/leetcode\.com\/problems\/([\w-]+)/);
  return match ? match[1] : "";
}

/**
 * @route   POST /api/contests/:roomId/create
 * @desc    Create a contest (Admins only)
 */
contestRoute.post("/:roomId/create", protect, isAdmin, async (req, res) => {
  try {
    const { problems } = req.body;
    if (!Array.isArray(problems) || problems.length !== 3) {
      return res.status(400).json({ message: "Provide exactly 3 problems" });
    }

    // map problems with slug
    const problemsWithSlug = problems.map((p) => ({
      title: p.title,
      url: p.url,
      difficulty: p.difficulty,
      slug: extractSlugFromUrl(p.url),
    }));

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours

    const contest = await Contest.create({
      roomId: req.params.roomId,
      problems: problemsWithSlug,
      startTime,
      endTime,
      createdBy: req.user._id,
    });

    res.status(201).json(contest);
  } catch (err) {
    console.error("Create contest error:", err);
    res.status(500).json({ message: "Server error creating contest" });
  }
});

/**
 * @route   GET /api/contests/:roomId/active
 * @desc    Get active contest in a room
 */
contestRoute.get("/:roomId/active", protect, async (req, res) => {
  try {
    const now = new Date();
    const contest = await Contest.findOne({
      roomId: req.params.roomId,
      startTime: { $lte: now },
      endTime: { $gte: now },
    }).populate("participants.user", "username");

    res.json(contest || null);
  } catch (err) {
    console.error("Fetch active contest error:", err);
    res.status(500).json({ message: "Server error fetching active contest" });
  }
});

/**
 * @route   POST /api/contests/:contestId/submit
 * @desc    Mark a problem solved by the current user
 */
contestRoute.post("/:contestId/submit", protect, async (req, res) => {
  try {
    const { problemIndex } = req.body;
    const contest = await Contest.findById(req.params.contestId);
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    const user = await User.findById(req.user._id);
    if (!user.leetcodeId) {
      return res.status(400).json({ message: "Please link your LeetCode username first." });
    }

    // fetch recent accepted submissions
    const graphqlQuery = {
      query: `query recentAcSubmissions($username: String!) {
        recentAcSubmissionList(username: $username, limit: 50) {
          title
          titleSlug
          timestamp
        }
      }`,
      variables: { username: user.leetcodeId },
    };

    const lcRes = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(graphqlQuery),
    });
    const lcData = await lcRes.json();
    const solvedList = lcData.data?.recentAcSubmissionList || [];

    const problem = contest.problems[problemIndex];
    if (!problem) return res.status(400).json({ message: "Invalid problem index" });

    // ✅ robust matching by slug
    const match = solvedList.find((s) => {
      const solvedTime = parseInt(s.timestamp) * 1000;
      return (
        s.titleSlug.toLowerCase() === problem.slug.toLowerCase() &&
        solvedTime >= new Date(contest.startTime).getTime() &&
        solvedTime <= new Date(contest.endTime).getTime()
      );
    });

    if (!match) {
      return res.status(400).json({ message: "❌ Not solved on LeetCode during contest window" });
    }

    // Update participant
    let participant = contest.participants.find(
      (p) => p.user.toString() === req.user._id.toString()
    );
    if (!participant) {
      participant = { user: req.user._id, solved: 0 };
      contest.participants.push(participant);
    }
    participant.solved += 1;
    await contest.save();

    res.json({ message: "✅ Solve verified and counted!", contest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default contestRoute;
