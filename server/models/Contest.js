import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  solved: { type: Number, default: 0 },
  rank: { type: Number },
});

const contestSchema = new mongoose.Schema(
  {
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    problems: [
      {
        title: String,
        url: String,
        slug: String,   // ✅ added slug for robust matching
        difficulty: String,
      },
    ],
    startTime: Date,
    endTime: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    participants: [participantSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Contest", contestSchema);
