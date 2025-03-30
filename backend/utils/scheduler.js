import cron from "node-cron";
import linkedinScraper from "../scrapers/linkedinScraper.js";
import indeedScraper from "../scrapers/indeedScraper.js";

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
      for (const location of locations) {
        console.log(`Scraping jobs for location: ${location}`);

        // Run LinkedIn scraper
        try {
          console.log(`Starting LinkedIn scraper for ${location}...`);
          const linkedinCount = await linkedinScraper.scrapeAndSaveLinkedInJobs(
            {
              location,
              pages: 5, // Adjust as needed
            }
          );
          console.log(
            `LinkedIn scraper completed for ${location}. Saved ${linkedinCount} jobs.`
          );
        } catch (error) {
          console.error(`LinkedIn scraper error for ${location}:`, error);
        }

        // Run Indeed scraper
        try {
          console.log(`Starting Indeed scraper for ${location}...`);
          const indeedCount = await indeedScraper.scrapeAndSaveIndeedJobs({
            location,
            pages: 5, // Adjust as needed
          });
          console.log(
            `Indeed scraper completed for ${location}. Saved ${indeedCount} jobs.`
          );
        } catch (error) {
          console.error(`Indeed scraper error for ${location}:`, error);
        }
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

  try {
    for (const location of locations) {
      console.log(`Scraping jobs for location: ${location}`);

      // Run LinkedIn scraper
      // try {
      //   console.log(`Starting LinkedIn scraper for ${location}...`);
      //   const linkedinCount = await linkedinScraper.scrapeAndSaveLinkedInJobs({
      //     location,
      //     pages: 1, // Limited for immediate run
      //   });
      //   results.linkedin += linkedinCount;
      //   console.log(
      //     `LinkedIn scraper completed for ${location}. Saved ${linkedinCount} jobs.`
      //   );
      // } catch (error) {
      //   console.error(`LinkedIn scraper error for ${location}:`, error);
      //   results.errors.push(`LinkedIn - ${location}: ${error.message}`);
      // }

      // Wait a bit between scrapers to avoid being rate-limited
      // await new Promise((resolve) => setTimeout(resolve, 5000));

      // Run Indeed scraper
      try {
        console.log(`Starting Indeed scraper for ${location}...`);
        const indeedCount = await indeedScraper.scrapeAndSaveIndeedJobs({
          location,
          pages: 1, // Limited for immediate run
        });
        results.indeed += indeedCount;
        console.log(
          `Indeed scraper completed for ${location}. Saved ${indeedCount} jobs.`
        );
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
};
