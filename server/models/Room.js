import mongoose from "mongoose";

//Schema of Room
const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    inviteCode: { type: String, required: true, unique: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
