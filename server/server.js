import "dotenv/config";
import connectDB from "./config/db.js";
import app  from "./app.js";
import authRoutes from "./routes/auth.js";

connectDB(); //Connecting to DataBase

// Defining Port number
const PORT = process.env.PORT || 5000;

// Starting the backend
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});