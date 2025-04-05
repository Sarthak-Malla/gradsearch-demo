import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import jobRoutes from "./routes/jobs.js";
import scraperRoutes from "./routes/scrapers.js";

// Configure environment variables
dotenv.config();

// Initialize express app
const app = express();
const PORT = process.env.DB_PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection string - now using local MongoDB
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/job-market-insights";

// Connect to MongoDB with more detailed error handling
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully to:", MONGODB_URI);

    // Initialize the job scraper scheduler after DB connection is established
    if (process.env.NODE_ENV !== "test") {
      // Temporarily commenting out scheduler to prevent automatic scraping
      // scheduler.scheduleScrapers({
      //   locations: ["United States", "Remote"],
      // });
      console.log("Note: Job scraper scheduler is currently disabled");
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    console.log("\nMongoDB connection failed. Please check that:");
    console.log(
      "1. MongoDB is running locally. Start it with 'brew services start mongodb-community'"
    );
    console.log(
      "2. Or set MONGODB_URI environment variable to a valid MongoDB connection string"
    );
    console.log(
      "3. Create a .env file in the backend directory with your MONGODB_URI"
    );
  });

// Routes
app.use("/api/jobs", jobRoutes);
app.use("/api/scrapers", scraperRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Job Market Insights API is running");
});

// Create HTTP server
const server = app
  .listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      const nextPort = parseInt(PORT) + 1;
      console.log(`Port ${PORT} is busy, trying alternative port ${nextPort}`);
      server.close();
      // Try the next port
      app.listen(nextPort, () => {
        console.log(`Server is running on alternate port: ${nextPort}`);
      });
    } else {
      console.error("Server error:", err);
    }
  });

export default app;
