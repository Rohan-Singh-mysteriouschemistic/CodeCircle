import mongoose from "mongoose";

//Schema of user registration Details
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    leetCodeId: { type: String },
    totalSolved: { type: Number, default: 0 },
    contestRating: { type: Number, default: 0 },
    globalRank: { type: Number, default: null },
    contestsAttended: { type: Number, default: 0 },
    badges: {
      winner: { type: Number, default: 0 },
      second: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
