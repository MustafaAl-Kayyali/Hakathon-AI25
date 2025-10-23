// File: server.js
import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { upload, validateRequest } from "./app.js";
import { connectDB, Project } from "./config/db.js";
import { spawn } from "child_process";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// === API ROUTE ===
app.post(
  "/api/v1/generate-plans",
  upload.single("file"),
  validateRequest,
  async (req, res) => {
    try {
      const { projectType, budget, floors, area, areaUnit } = req.body;
      const uploadedFile = req.file;

      console.log("📦 Received Project Configuration:", {
        projectType,
        budget,
        floors,
        area,
        areaUnit,
      });

      const newProject = await Project.create({
        projectType,
        budget,
        floors,
        area,
        areaUnit,
        imagePath: uploadedFile.path,
      });

        //for Ai core generater
const python=

      res.status(200).json({
        success: true,
        message: "Architectural plans generated successfully.",
        project: newProject,
      });
    } catch (err) {
      console.error("❌ Error generating plan:", err);
      res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
      });
    }
  }
);

app.use((err, req, res, next) => {
  console.error("❌ Middleware Error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Unexpected error occurred",
  });
});

// === Server Listen ===
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
