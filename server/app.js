import express from "express";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import protect from "./middleware/authMiddleware.js";
import roomRoute from "./routes/roomRoutes.js";
import authRoutes from "./routes/auth.js";
import leetcodeRoutes from "./routes/leetcodeRoutes.js";


const app = express();

//Middlewares
app.use(cors()) // Cross Origin resource sharing
app.use(express.json());
app.use("/api/users", userRouter);
app.use("/api/rooms", roomRoute);
app.use("/api/auth", authRoutes);
app.use("/api/leetcode", leetcodeRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Codespace backend is running!');
});

export default app;