import cron from "node-cron";
import linkedinScraper from "../scrapers/linkedinScraper.js";
import indeedScraper from "../scrapers/indeedScraper.js";
import chromaService from "../chroma/config.js";

/**
 * Schedule job indexing in ChromaDB
 * @param {Array<Object>} allJobs - Array of job objects to be indexed
 * @returns {Promise<void>}
 * @throws {Error} - If indexing fails
 */
export async function scheduleJobIndexing(allJobs) {
  try {
    if (!allJobs || allJobs.length === 0) {
      console.log("No jobs to index in ChromaDB");
      return;
    }

    await chromaService.init();
    await chromaService.addJobs(allJobs);

    console.log(
      `Indexed ${
        allJobs.length
      } jobs. Total jobs in ChromaDB: ${await chromaService.getJobCount()}`
    );
    return true;
  } catch (error) {
    console.error("Failed to index jobs:", error);
    throw error;
  }
}

/**
 * Schedule job scrapers to run at specified intervals
 * @param {Object} options - Scheduling options
 * @param {string} options.cronExpression - Cron expression for scheduling (default: every day at 3 AM)
 * @param {Array<string>} options.locations - Array of locations to scrape jobs for
 */
export function scheduleScrapers({
  cronExpression = "0 3 * * *", // Default: Run at 3 AM every day
  locations = ["United States"],
} = {}) {
  console.log(
    `Scheduling job scrapers with cron expression: ${cronExpression}`
  );
  console.log(`Target locations: ${locations.join(", ")}`);

  // Schedule the job to run based on the cron expression
  cron.schedule(cronExpression, async () => {
    console.log(
      `Running scheduled job scrapers at ${new Date().toISOString()}`
    );

    try {
      const allJobs = []; // Collect all jobs for ChromaDB indexing

      for (const location of locations) {
        console.log(`Scraping jobs for location: ${location}`);

        // Run LinkedIn scraper
        try {
          console.log(`Starting LinkedIn scraper for ${location}...`);
          const linkedinJobs = await linkedinScraper.scrapeAndSaveLinkedInJobs({
            location,
            pages: 5, // Adjust as needed
          });
          console.log(
            `LinkedIn scraper completed for ${location}. Saved ${linkedinJobs.length} jobs.`
          );

          // Add jobs to collection for ChromaDB
          allJobs.push(...linkedinJobs);
        } catch (error) {
          console.error(`LinkedIn scraper error for ${location}:`, error);
        }

        // Run Indeed scraper
        try {
          console.log(`Starting Indeed scraper for ${location}...`);
          const indeedJobs = await indeedScraper.scrapeAndSaveIndeedJobs({
            location,
            pages: 5, // Adjust as needed
          });
          console.log(
            `Indeed scraper completed for ${location}. Saved ${indeedJobs.length} jobs.`
          );

          // Add jobs to collection for ChromaDB
          allJobs.push(...indeedJobs);
        } catch (error) {
          console.error(`Indeed scraper error for ${location}:`, error);
        }
      }

      // Index all collected jobs in ChromaDB
      if (allJobs.length > 0) {
        try {
          await scheduleJobIndexing(allJobs);
          console.log(
            `Successfully indexed ${allJobs.length} jobs in ChromaDB`
          );
        } catch (error) {
          console.error("Failed to index jobs in ChromaDB:", error);
        }
      } else {
        console.log("No jobs were scraped to index in ChromaDB");
      }

      console.log(
        `Scheduled job scraping completed at ${new Date().toISOString()}`
      );
    } catch (error) {
      console.error("Error in scheduled job scraping:", error);
    }
  });

  console.log("Job scrapers scheduled successfully");
}

/**
 * Run all job scrapers immediately
 * @param {Object} options - Scraping options
 * @param {Array<string>} options.locations - Array of locations to scrape jobs for
 * @returns {Promise<Object>} - Results of the scraping operation
 */
export async function runScrapersNow({
  locations = ["United Arab Emirates"],
} = {}) {
  console.log(
    `Running all job scrapers immediately at ${new Date().toISOString()}`
  );
  console.log(`Target locations: ${locations.join(", ")}`);

  const results = {
    linkedin: 0,
    indeed: 0,
    errors: [],
  };

  const allJobs = []; // Initialize array to collect all jobs

  try {
    for (const location of locations) {
      console.log(`Scraping jobs for location: ${location}`);

      // Run LinkedIn scraper
      let linkedinJobs = [];
      try {
        console.log(`Starting LinkedIn scraper for ${location}...`);
        linkedinJobs = await linkedinScraper.scrapeAndSaveLinkedInJobs({
          location,
          pages: 1, // Limited for immediate run
        });
        results.linkedin += linkedinJobs.length;
        console.log(
          `LinkedIn scraper completed for ${location}. Saved ${linkedinJobs.length} jobs.`
        );
        // Add LinkedIn jobs to the collection
        allJobs.push(...linkedinJobs);
      } catch (error) {
        console.error(`LinkedIn scraper error for ${location}:`, error);
        results.errors.push(`LinkedIn - ${location}: ${error.message}`);
      }

      // Wait a bit between scrapers to avoid being rate-limited
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Run Indeed scraper
      let indeedJobs = [];
      try {
        console.log(`Starting Indeed scraper for ${location}...`);
        indeedJobs = await indeedScraper.scrapeAndSaveIndeedJobs({
          location,
          pages: 1, // Limited for immediate run
        });
        results.indeed += indeedJobs.length;
        console.log(
          `Indeed scraper completed for ${location}. Saved ${indeedJobs.length} jobs.`
        );
        // Add Indeed jobs to the collection
        allJobs.push(...indeedJobs);
      } catch (error) {
        console.error(`Indeed scraper error for ${location}:`, error);
        results.errors.push(`Indeed - ${location}: ${error.message}`);
      }
    }

    console.log(`Job scraping completed at ${new Date().toISOString()}`);
    console.log(
      `Total jobs saved - LinkedIn: ${results.linkedin}, Indeed: ${results.indeed}`
    );

    if (results.errors.length > 0) {
      console.log(
        `Encountered ${results.errors.length} errors during scraping`
      );
    }

    // Index all collected jobs to ChromaDB
    if (allJobs.length > 0) {
      try {
        const success = await scheduleJobIndexing(allJobs);
        if (success) {
          console.log(
            `Successfully indexed ${allJobs.length} jobs to ChromaDB`
          );
        } else {
          console.error("Failed to index jobs to ChromaDB");
          results.errors.push("Failed to index jobs to ChromaDB");
        }
      } catch (error) {
        console.error("ChromaDB indexing error:", error);
        results.errors.push(`ChromaDB error: ${error.message}`);
      }
    } else {
      console.log("No jobs were scraped to index in ChromaDB");
    }

    return results;
  } catch (error) {
    console.error("Error in job scraping:", error);
    results.errors.push(`General error: ${error.message}`);
    return results;
  }
}

export default {
  scheduleScrapers,
  runScrapersNow,
  scheduleJobIndexing,
};
