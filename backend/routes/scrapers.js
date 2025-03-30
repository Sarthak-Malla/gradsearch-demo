import express from "express";
import scraperController from "../controllers/scraperController.js";

const router = express.Router();

// POST /api/scrapers/run - Trigger immediate job scraping
router.post("/run", scraperController.runScrapersNow);

// GET /api/scrapers/status - Get scraping status and stats
router.get("/status", scraperController.getScraperStatus);

export default router;
