import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

// CONNECT DATABASE
connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("DormDeal backend running 🚀");
});

// AUTH ROUTES
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
