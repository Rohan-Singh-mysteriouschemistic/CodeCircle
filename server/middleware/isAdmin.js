import Room from "../models/Room.js";

export default async function isAdmin(req, res, next) {
  try {
    const room = await Room.findById(req.params.roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });

    if (!room.admins.some(adminId => adminId.equals(req.user._id))) {
      return res.status(403).json({ message: "Only admins can do this" });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
