import mongoose from "mongoose";
import Job from "../models/job.js";
import chromaService from "../chroma/config.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

async function populateChroma() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Initialize ChromaDB
    await chromaService.init();
    console.log("Initialized ChromaDB");

    const jobs = await Job.find({});
    console.log(`Found ${jobs.length} jobs in MongoDB`);

    // Add jobs to ChromaDB
    await chromaService.addJobs(jobs);

    const jobCount = await chromaService.getJobCount();
    console.log(`ChromaDB now contains ${jobCount} jobs`);

    console.log("Successfully populated ChromaDB with job data");
  } catch (error) {
    console.error("Error populating ChromaDB:", error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log("Closed MongoDB connection");
    process.exit(0);
  }
}

// Run the function
populateChroma();
