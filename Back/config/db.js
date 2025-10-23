// File: config/db.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/archimind",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.DB_NAME || "archimind",
      }
    );
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

// ✅ Schema for saving project info
const projectSchema = new mongoose.Schema({
  projectType: { type: String, required: true },
  budget: { type: Number, required: true },
  floors: { type: Number, required: true },
  area: { type: Number, required: true },
  areaUnit: { type: String, enum: ["m2", "dunum"], required: true },
  imagePath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Project = mongoose.model("Project", projectSchema);