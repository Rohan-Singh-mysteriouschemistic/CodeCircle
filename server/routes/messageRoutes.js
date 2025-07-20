import express from "express";
import protect from "../middleware/authMiddleware.js";
import Message from "../models/Message.js";

const messageRoute = express.Router();

// Get messages for a channel
messageRoute.get("/:channelId", protect, async (req, res) => {
  try {
    const msgs = await Message.find({ channelId: req.params.channelId })
      .populate("sender", "username")
      .sort({ createdAt: 1 });
    res.json(msgs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default messageRoute;
