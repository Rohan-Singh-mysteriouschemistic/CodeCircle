import "dotenv/config";
import connectDB from "./config/db.js";
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import Message from "./models/Message.js";
import Contest from "./models/Contest.js";
import User from "./models/User.js";

// ✅ Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

console.log("✅ Socket.IO initialized");

// ======================
// 📌 Socket.IO Handling
// ======================
io.on("connection", (socket) => {
  console.log(`🔗 New socket connected: ${socket.id}`);

  // 👉 Join a channel inside a room
  socket.on("joinChannel", ({ roomId, channelId }) => {
    if (!roomId || !channelId) {
      console.warn("⚠️ joinChannel missing roomId or channelId");
      return;
    }
    socket.join(channelId);
    console.log(`➡️ Socket ${socket.id} joined channel ${channelId} (room: ${roomId})`);
  });

  // 👉 Send message event
  socket.on("sendMessage", async (msgData) => {
    try {
      const { text, sender, roomId, channelId } = msgData || {};
      if (!text || !sender || !roomId || !channelId) {
        console.warn("⚠️ sendMessage missing fields");
        return;
      }

      const newMsg = await Message.create({
        text,
        sender,
        roomId,
        channelId,
      });

      const populatedMsg = await newMsg.populate("sender", "username");

      io.to(channelId).emit("receiveMessage", {
        _id: populatedMsg._id,
        text: populatedMsg.text,
        sender: populatedMsg.sender.username,
        roomId,
        channelId,
        createdAt: populatedMsg.createdAt,
      });

      console.log(`💬 Message sent in channel ${channelId}: ${text}`);
    } catch (err) {
      console.error("❌ Error saving or broadcasting message:", err);
    }
  });

  // 👉 Handle disconnect
  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

// ======================
// 📌 Auto-finish contests
// ======================

// Helper to award badges and mark finished
async function finishContest(contest) {
  // Already finished? skip
  if (contest.finished) return;

  // Sort participants by solved count (desc)
  const sorted = [...contest.participants].sort((a, b) => b.solved - a.solved);

  const first = sorted[0];
  const second = sorted[1];

  if (first?.user) {
    await User.findByIdAndUpdate(first.user, { $inc: { "badges.winner": 1 } });
  }
  if (second?.user) {
    await User.findByIdAndUpdate(second.user, { $inc: { "badges.second": 1 } });
  }

  // assign ranks
  contest.participants.forEach((p, idx) => {
    p.rank = idx + 1;
  });

  contest.finished = true;
  await contest.save();
  console.log(`✅ Contest ${contest._id} auto-finished and badges updated`);
}

// Check every 1 minute
setInterval(async () => {
  try {
    const now = new Date();
    const toFinish = await Contest.find({
      endTime: { $lte: now },
      finished: { $ne: true },
    });

    for (const c of toFinish) {
      await finishContest(c);
    }
  } catch (err) {
    console.error("⛔ Error in auto-finish interval:", err);
  }
}, 60 * 1000);

// ======================
// 📌 Start server
// ======================
server.listen(PORT, () => {
  console.log(`🚀 Server with Socket.IO running on port ${PORT}`);
});
