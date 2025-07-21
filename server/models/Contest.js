import mongoose from "mongoose";

const participantSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  solved: { type: Number, default: 0 },
  rank: { type: Number },
  solvedProblems: [{ type: Number }], // ✅ store indices of solved problems
});

const contestSchema = new mongoose.Schema(
  {
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    problems: [
      { title: String, url: String, slug: String, difficulty: String },
    ],
    startTime: Date,
    endTime: Date,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    participants: [participantSchema],
    finished: { type: Boolean, default: false }, // ✅ add this
  },
  { timestamps: true }
);


export default mongoose.model("Contest", contestSchema);
