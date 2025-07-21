import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Include badges in the response
    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      leetCodeId: user.leetCodeId || "",
      totalSolved: user.totalSolved || 0,
      contestRating: user.contestRating || 0,
      globalRank: user.globalRank || null,
      contestsAttended: user.contestsAttended || 0,
      badges: {
        winner: user.badges?.winner || 0,
        second: user.badges?.second || 0,
      },
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: "Invalid token" });
  }
});

export default router;
