import express from "express";
import axios from "axios";
import protect from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Room from "../models/Room.js";

const leetcodeRoutes = express.Router();

async function fetchLeetCodeData(username) {
  const query = {
    query: `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          username
          submitStatsGlobal {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
        userContestRanking(username: $username) {
          attendedContestsCount
          rating
          globalRanking
        }
      }
    `,
    variables: { username },
  };

  const response = await axios.post("https://leetcode.com/graphql", query, {
    headers: { "Content-Type": "application/json" },
  });

  const data = response.data.data;
  if (!data || !data.matchedUser) {
    throw new Error("User not found on LeetCode");
  }

  const submissions = data.matchedUser.submitStatsGlobal.acSubmissionNum;

  // get counts by difficulty
  const easy = submissions.find((s) => s.difficulty === "Easy")?.count || 0;
  const medium = submissions.find((s) => s.difficulty === "Medium")?.count || 0;
  const hard = submissions.find((s) => s.difficulty === "Hard")?.count || 0;

  // total solved
  const totalSolved = easy + medium + hard;

  return {
    username: data.matchedUser.username,
    easy,
    medium,
    hard,
    totalSolved,
    contestRating: data.userContestRanking?.rating || 0,
    globalRank: data.userContestRanking?.globalRanking || null,
    contestsAttended: data.userContestRanking?.attendedContestsCount || 0,
  };
}

// 📌 GET STATS
leetcodeRoutes.get("/:username", async (req, res) => {
  try {
    const stats = await fetchLeetCodeData(req.params.username);
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching LeetCode data" });
  }
});

// 📌 UPDATE USER STATS
leetcodeRoutes.post("/update", protect, async (req, res) => {
  try {
    const { leetCodeId } = req.body;
    if (!leetCodeId) {
      return res.status(400).json({ message: "LeetCode ID is required" });
    }

    const stats = await fetchLeetCodeData(leetCodeId);

    // save to DB
    const user = await User.findById(req.user.id);
    user.leetCodeId = leetCodeId;
    user.totalSolved = stats.totalSolved;
    user.contestRating = stats.contestRating;
    user.globalRank = stats.globalRank;
    user.contestsAttended = stats.contestsAttended;
    await user.save();

    res.json({ message: "LeetCode profile updated", stats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

leetcodeRoutes.get("/room-leaderboard/:roomId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.leetCodeId) {
      return res.status(400).json({ message: "Link your LeetCode ID to view room leaderboard" });
    }

    const { roomId } = req.params;
    const room = await Room.findById(roomId).populate(
      "members",
      "username totalSolved contestRating globalRank"
    );
    if (!room) return res.status(404).json({ message: "Room not found" });

    const sortedMembers = room.members.sort((a, b) => b.totalSolved - a.totalSolved);
    res.json({ roomName: room.name, members: sortedMembers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


export default leetcodeRoutes;
