import express from "express";
import jobController from "../controllers/jobController.js";

const router = express.Router();

// GET /api/jobs - Get all jobs with optional filtering
router.get("/", jobController.getAllJobs);

// GET /api/jobs/stats - Get job statistics and insights
router.get("/stats", jobController.getJobStats);

// GET /api/jobs/:id - Get a single job by ID
router.get("/:id", jobController.getJobById);

export default router;
