import express from "express";
import Room from "../models/Room.js";
import generateInviteCode from "../utils/generateInviteCode.js";
import protect from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const roomRoute = express.Router();

// POST /api/rooms/create
roomRoute.post("/create", protect, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Room name is required" });

    let code;
    let exists = true;
    while (exists) {
      code = generateInviteCode();
      const check = await Room.findOne({ inviteCode: code });
      if (!check) exists = false;
    }

    const room = await Room.create({
      name,
      inviteCode: code,
      createdBy: req.user.id,
      members: [req.user.id],
    });

    res.status(201).json({
      message: "Room created successfully",
      room: {
        id: room._id,
        name: room.name,
        inviteCode: room.inviteCode,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Join a room via invite code
roomRoute.post("/join", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.leetCodeId) {
      return res.status(400).json({ message: "Link your LeetCode ID before joining rooms" });
    }

    const { inviteCode } = req.body;
    if (!inviteCode) return res.status(400).json({ message: "Invite code is required" });

    const room = await Room.findOne({ inviteCode });
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (room.members.includes(req.user.id)) {
      return res.status(400).json({ message: "Already a member" });
    }

    room.members.push(req.user.id);
    await room.save();

    res.json({ message: "Joined room successfully", room });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Get rooms of logged-in user
roomRoute.get("/my-rooms", protect, async (req, res) => {
  try {
    const rooms = await Room.find({ members: req.user.id }).select("name inviteCode");
    res.json({ rooms });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default roomRoute;