import express from "express";
import protect from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/isAdmin.js";
import Contest from "../models/Contest.js";
import User from "../models/User.js";
import fetch from "node-fetch";

const contestRoute = express.Router();

function extractSlugFromUrl(url) {
  const match = url.match(/leetcode\.com\/problems\/([\w-]+)/);
  return match ? match[1] : "";
}

// Create contest
contestRoute.post("/:roomId/create", protect, isAdmin, async (req, res) => {
  try {
    const { problems } = req.body;
    if (!Array.isArray(problems) || problems.length !== 3) {
      return res.status(400).json({ message: "Provide exactly 3 problems" });
    }
    const problemsWithSlug = problems.map((p) => ({
      title: p.title,
      url: p.url,
      difficulty: p.difficulty,
      slug: extractSlugFromUrl(p.url),
    }));
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000);

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

// Get active contest
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

// Submit problem
contestRoute.post("/:contestId/submit", protect, async (req, res) => {
  try {
    const { problemIndex } = req.body;
    const contest = await Contest.findById(req.params.contestId);
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    const user = await User.findById(req.user._id);
    if (!user.leetCodeId) {
      return res.status(400).json({ message: "Please link your LeetCode username first." });
    }

    // Fetch recent submissions
    const graphqlQuery = {
      query: `query recentAcSubmissions($username: String!) {
        recentAcSubmissionList(username: $username, limit: 50) {
          title
          titleSlug
          timestamp
        }
      }`,
      variables: { username: user.leetCodeId },
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

    const match = solvedList.find((s) => {
      const solvedTime = parseInt(s.timestamp) * 1000;
      return (
        s.titleSlug.toLowerCase() === problem.slug.toLowerCase() &&
        solvedTime >= new Date(contest.startTime).getTime() &&
        solvedTime <= new Date(contest.endTime).getTime()
      );
    });
    if (!match) return res.status(400).json({ message: "❌ Not solved during contest window" });

    // Update participant with solvedProblems
    let participant = contest.participants.find(
      (p) => p.user.toString() === req.user._id.toString()
    );
    if (!participant) {
      participant = { user: req.user._id, solved: 0, solvedProblems: [] };
      contest.participants.push(participant);
    }

    if (!participant.solvedProblems.includes(problemIndex)) {
      participant.solvedProblems.push(problemIndex);
      participant.solved = participant.solvedProblems.length;
    }

    await contest.save();
    const updated = await Contest.findById(req.params.contestId).populate(
      "participants.user",
      "username"
    );
    res.json({ message: "✅ Solve verified!", contest: updated });
  } catch (err) {
    console.error("Submit contest error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Finish contest and update badges
contestRoute.post("/:contestId/finish", protect, isAdmin, async (req, res) => {
  try {
    const { contestId } = req.params;

    const contest = await Contest.findById(contestId).populate("participants.user");
    if (!contest) return res.status(404).json({ message: "Contest not found" });

    // sort participants by solved count (descending)
    const sorted = contest.participants.sort((a, b) => b.solved - a.solved);

    const first = sorted[0];
    const second = sorted[1];

    // increment badge counts
    if (first?.user?._id) {
      await User.findByIdAndUpdate(first.user._id, {
        $inc: { "badges.winner": 1 }
      });
    }
    if (second?.user?._id) {
      await User.findByIdAndUpdate(second.user._id, {
        $inc: { "badges.second": 1 }
      });
    }

    // (Optional) Save ranks if you want:
    contest.participants.forEach((p, idx) => {
      p.rank = idx + 1; // assign rank in order
    });
    await contest.save();

    res.json({
      message: "✅ Contest finished! Badges updated.",
      first: first?.user?.username || null,
      second: second?.user?.username || null
    });
  } catch (err) {
    console.error("Finish contest error:", err);
    res.status(500).json({ message: "Server error finishing contest" });
  }
});

// Get latest finished contest
contestRoute.get("/:roomId/latest", protect, async (req, res) => {
  try {
    const now = new Date();
    // Find contests that ended already
    const contest = await Contest.findOne({
      roomId: req.params.roomId,
      endTime: { $lte: now }
    })
      .sort({ endTime: -1 }) // latest ended
      .populate("participants.user", "username");

    if (!contest) {
      return res.status(404).json({ message: "No finished contests yet" });
    }

    // Sort participants by solved count descending
    const sortedParticipants = contest.participants.sort(
      (a, b) => b.solved - a.solved
    );

    res.json({
      _id: contest._id,
      startTime: contest.startTime,
      endTime: contest.endTime,
      participants: sortedParticipants.map((p) => ({
        user: p.user,
        solved: p.solved,
      })),
    });
  } catch (err) {
    console.error("Fetch latest contest error:", err);
    res.status(500).json({ message: "Server error fetching latest contest" });
  }
});



export default contestRoute;
