import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import projectRouter from "./src/routes/projectRoutes.js";
import taskRouter from "./src/routes/taskRoutes.js";
import { errorHandler } from "./src/middleware/errorHandler.js";

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("API Running...");
});

app.use("/api/auth", authRoutes);
app.use('/api/projects', projectRouter);
app.use('/api/tasks', taskRouter);

app.use(errorHandler);