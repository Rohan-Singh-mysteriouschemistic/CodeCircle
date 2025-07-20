import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const userRouter = express.Router();

// POST /api/users/register
userRouter.post("/register", registerUser);

// POST /api/users/login
userRouter.post("/login", loginUser);

export default userRouter;
