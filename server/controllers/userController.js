import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // token valid for 7 days
  });
};

// Register user
export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      leetCodeId: "", // default
      totalSolved: 0,
      contestRating: 0,
      globalRank: null,
      contestsAttended: 0,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        leetCodeId: newUser.leetCodeId,
        totalSolved: newUser.totalSolved,
        contestRating: newUser.contestRating,
        globalRank: newUser.globalRank,
        contestsAttended: newUser.contestsAttended,
      },
      token: generateToken(newUser._id),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Include leetCodeId and stats in response
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        leetCodeId: user.leetCodeId || "",
        totalSolved: user.totalSolved || 0,
        contestRating: user.contestRating || 0,
        globalRank: user.globalRank || null,
        contestsAttended: user.contestsAttended || 0,
      },
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

