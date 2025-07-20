import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel", required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
