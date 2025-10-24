import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import initDB from "./config/db.js";
import { upload, validateRequest } from "./app.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

async function startServer() {
  const { sequelize, Project } = await initDB();

  const uploadsDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });


  // === Main API Route ===
  app.post(
    "/api/v1/generate-plans",
    upload.single("file"),
    validateRequest,
    async (req, res) => {
      try {
        const { projectType, budget, floors, area, areaUnit } = req.body;
        const uploadedFile = req.file;

        // console.log("📦 Received Project Configuration:", {
        //   projectType,
        //   budget,
        //   floors,
        //   area,
        //   areaUnit,
        // });

        // Create project using Sequelize
        const newProject = await Project.create({
          projectType,
          budget,
          floors,
          area,
          areaUnit,
          imagePath: uploadedFile.path,
        });




        // Run Python AI Script
        // const pythonProcess = spawn("python", ["floorplan_final.py"]);

        // pythonProcess.stdout.on("data", (data) => {
        //   console.log(`🐍 Python Output: ${data}`);
        // });

        // pythonProcess.stderr.on("data", (data) => {
        //   console.error(`🐍 Python Error: ${data}`);
        // });

        // pythonProcess.on("close", (code) => {
        //   console.log(`🐍 Python Process Exited with Code: ${code}`);
        // });




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

  // GET all projects
  app.get("/api/v1/generate-plans", async (req, res) => {
    try {
      const projects = await Project.findAll({
        order: [["createdAt", "DESC"]],
      });
      res.status(200).json({
        success: true,
        projects,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

  // Global Error Handler
  app.use((err, req, res, next) => {
    console.error("❌ Middleware Error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Unexpected error occurred",
    });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
}

startServer();
