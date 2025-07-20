import "dotenv/config";
import connectDB from "./config/db.js";
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import Message from "./models/Message.js";

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
    // Join this socket to a specific channel room
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

      // ✅ Save message in database
      const newMsg = await Message.create({
        text,
        sender,
        roomId,
        channelId,
      });

      // ✅ Populate sender info if needed
      const populatedMsg = await newMsg.populate("sender", "username");

      // ✅ Broadcast message to everyone in this channel
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
// 📌 Start server
// ======================
server.listen(PORT, () => {
  console.log(`🚀 Server with Socket.IO running on port ${PORT}`);
});
