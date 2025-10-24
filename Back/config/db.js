import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: path.join(__dirname, "../config.env") });

let sequelize;
let Project;

/**
 * Initialize Sequelize connection and models
 * @returns {Promise<{sequelize: Sequelize, Project: Model}>}
 */
async function initDB() {
  if (sequelize) {
    return { sequelize, Project };
  }

  try {
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "mysql",
        logging: false, // Set to console.log to see SQL queries
      }
    );

    // Test connection
    await sequelize.authenticate();
    console.log(`✅ MySQL connected as ${process.env.DB_USER}`);

    // Define Project model
    Project = sequelize.define(
      "Project",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        projectType: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        budget: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        floors: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        area: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
        },
        areaUnit: {
          type: DataTypes.ENUM("m2", "dunum"),
          allowNull: false,
        },
        imagePath: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        tableName: "projects",
        timestamps: true,
        createdAt: "createdAt",
        updatedAt: false,
      }
    );

    // Sync database (create tables if they don't exist)
    await sequelize.sync();
    console.log("✅ Projects table ready");

    return { sequelize, Project };
  } catch (error) {
    console.error("❌ MySQL connection failed:", error);
    throw error;
  }
}

export default initDB;
