import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import jobRoutes from "./routes/jobs.js";
import scraperRoutes from "./routes/scrapers.js";

// Import scheduler
import scheduler from "./utils/scheduler.js";

// Configure environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/job-market-insights"
  )
  .then(() => {
    console.log("MongoDB connected successfully");

    // Initialize the job scraper scheduler after DB connection is established
    if (process.env.NODE_ENV !== "test") {
      scheduler.scheduleScrapers({
        locations: ["United States", "Remote"],
      });
    }
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/jobs", jobRoutes);
app.use("/api/scrapers", scraperRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Job Market Insights API is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

export default app;
