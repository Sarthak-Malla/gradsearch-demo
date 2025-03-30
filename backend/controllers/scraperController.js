import scheduler from "../utils/scheduler.js";

/**
 * Trigger immediate job scraping
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {Array<string>} [req.body.locations] - Array of locations to scrape jobs for
 * @param {Object} res - Express response object
 */
export const runScrapersNow = async (req, res) => {
  try {
    const { locations = ["United States"] } = req.body;

    // Start the scraping process asynchronously
    // We don't wait for it to complete before responding
    const scrapePromise = scheduler.runScrapersNow({ locations });

    // Respond immediately that the scraping has started
    res.status(202).json({
      success: true,
      message: "Job scraping started successfully",
      locations,
    });

    // The scraping continues in the background
  } catch (error) {
    console.error("Error triggering job scraping:", error);
    res.status(500).json({
      success: false,
      message: "Failed to start job scraping",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get scraping status and stats
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getScraperStatus = async (req, res) => {
  try {
    // In a real application, you would store the status of each scraping job
    // For now, we'll return a simulated response
    res.status(200).json({
      success: true,
      data: {
        lastRun: new Date(),
        status: "completed",
        jobsScraped: {
          linkedin: Math.floor(Math.random() * 100),
          indeed: Math.floor(Math.random() * 100),
        },
        nextScheduledRun: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      },
    });
  } catch (error) {
    console.error("Error getting scraper status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get scraper status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export default {
  runScrapersNow,
  getScraperStatus,
};
