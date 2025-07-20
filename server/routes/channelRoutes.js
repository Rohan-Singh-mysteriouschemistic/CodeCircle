import express from "express";
import protect from "../middleware/authMiddleware.js";
import Channel from "../models/Channels.js";
import Room from "../models/Room.js";

const channelRoutes = express.Router();

// ✅ Get all channels in a room
channelRoutes.get("/:roomId/channels", protect, async (req, res) => {
  try {
    const { roomId } = req.params;
    // Check if user is in this room
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (!room.members.includes(req.user.id)) {
      return res.status(403).json({ message: "Not a member of this room" });
    }

    const channels = await Channel.find({ room: roomId }).sort({ createdAt: 1 });
    res.json({ channels });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create a channel in a room
channelRoutes.post("/create", protect, async (req, res) => {
  try {
    const { name, roomId } = req.body;
    if (!name || !roomId) return res.status(400).json({ message: "Name and roomId are required" });

    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (!room.members.includes(req.user.id)) {
      return res.status(403).json({ message: "Not a member of this room" });
    }

    const channel = await Channel.create({ name, room: roomId });
    res.status(201).json(channel);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default channelRoutes;
