import puppeteer from "puppeteer";
import Job from "../models/job.js";

/**
 * Scrape early career job listings from Indeed
 * @param {Object} options - Scraping options
 * @param {string} options.location - Job location (e.g., 'United States')
 * @param {number} options.pages - Number of pages to scrape
 * @returns {Promise<Array>} - Array of scraped job data
 */
export async function scrapeIndeedJobs({ location = "", pages = 3 } = {}) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    console.log("Starting Indeed scraper...");
    const page = await browser.newPage();

    // Set viewport and user agent
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
    );

    // Search parameters - focus on entry-level positions
    const searchUrl = `https://ae.indeed.com/jobs?q=entry+level&l=${encodeURIComponent(
      location
    )}&vjk=d07be6185741a061`;
    console.log(`Navigating to ${searchUrl}`);

    await page.goto(searchUrl, {
      waitUntil: "domcontentloaded",
      timeout: 60000,
    });

    // Wait for job listings to load
    await page
      .waitForSelector("#mosaic-jobResults", { timeout: 10000 })
      .catch((e) => console.log("Selector timeout, proceeding anyway"));

    const jobListings = [];

    // Iterate through the specified number of pages
    for (let currentPage = 0; currentPage < pages; currentPage++) {
      console.log(`Scraping page ${currentPage + 1} of ${pages}`);

      // Extract job data from current page
      const pageJobs = await page.evaluate(() => {
        const jobs = [];
        const listings = document.querySelectorAll(".job_seen_beacon");
        console.log(`Found ${listings.length} job listings on this page`);

        listings.forEach((listing) => {
          try {
            const titleElement = listing.querySelector(".jobTitle span");
            const companyElement = listing.querySelector(
              "[data-testid='company-name']"
            );
            const locationElement = listing.querySelector(
              "[data-testid='text-location']"
            );
            const salaryElement = listing.querySelector(
              ".salary-snippet-container"
            );

            // Get the job URL
            const jobCardLink = listing.querySelector(".jcs-JobTitle");
            const jobId = jobCardLink
              ? jobCardLink.getAttribute("data-jk")
              : null;
            const url = jobId
              ? `https://www.indeed.com/viewjob?jk=${jobId}`
              : "";

            if (titleElement && companyElement) {
              jobs.push({
                title: titleElement.textContent.trim(),
                company: companyElement.textContent.trim(),
                location: locationElement
                  ? locationElement.textContent.trim()
                  : "Remote/Unspecified",
                salary: salaryElement ? salaryElement.textContent.trim() : "",
                url: url,
                source: "Indeed",
                experienceLevel: "Entry Level",
                postedDate: new Date(),
              });
            }
          } catch (error) {
            console.error("Error parsing job listing:", error);
          }
        });

        return jobs;
      });

      console.log(`Found ${pageJobs.length} jobs on page ${currentPage + 1}`);
      jobListings.push(...pageJobs);

      // Click next page button if not on the last page
      if (currentPage < pages - 1) {
        const nextButton = await page.$('[data-testid="pagination-page-next"]');
        if (!nextButton) {
          console.log("No more pages to scrape");
          break;
        }

        await nextButton.click();
        await page.waitForTimeout(3000); // Wait for the next page to load
      }
    }

    console.log(
      `Indeed scraping complete. Total jobs found: ${jobListings.length}`
    );
    return jobListings;
  } catch (error) {
    console.error("Indeed scraper error:", error);
    return [];
  } finally {
    await browser.close();
  }
}

/**
 * Scrape job details from individual Indeed job pages
 * @param {string} url - URL of the job posting
 * @returns {Promise<Object>} - Object containing job details
 */
export async function scrapeIndeedJobDetails(url) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

    // Wait for job details to load
    await page
      .waitForSelector("#jobDescriptionText", { timeout: 10000 })
      .catch((e) => console.log("Selector timeout, proceeding anyway"));

    // Extract detailed job information
    const jobDetails = await page.evaluate(() => {
      // Extract job description
      const descriptionElement = document.querySelector("#jobDescriptionText");
      const description = descriptionElement
        ? descriptionElement.textContent.trim()
        : "";

      // Try to determine job type
      const jobPageContent = document.body.textContent;
      let jobType = "Other";

      // Simple pattern matching to determine job type
      if (
        jobPageContent.includes("Full-time") ||
        jobPageContent.includes("Full time")
      ) {
        jobType = "Full-time";
      } else if (
        jobPageContent.includes("Part-time") ||
        jobPageContent.includes("Part time")
      ) {
        jobType = "Part-time";
      } else if (jobPageContent.includes("Contract")) {
        jobType = "Contract";
      } else if (jobPageContent.includes("Internship")) {
        jobType = "Internship";
      } else if (jobPageContent.includes("Remote")) {
        jobType = "Remote";
      }

      // Extract skills by identifying common technical skill keywords in the description
      const skillKeywords = [
        "JavaScript",
        "Python",
        "Java",
        "C++",
        "C#",
        "React",
        "Angular",
        "Vue",
        "Node.js",
        "Express",
        "MongoDB",
        "SQL",
        "MySQL",
        "PostgreSQL",
        "AWS",
        "Azure",
        "GCP",
        "Cloud",
        "DevOps",
        "Docker",
        "Kubernetes",
        "Git",
        "HTML",
        "CSS",
        "Sass",
        "LESS",
        "UI/UX",
        "Design",
        "Figma",
        "Adobe",
        "Communication",
        "Leadership",
        "Teamwork",
        "Problem-solving",
        "Critical thinking",
      ];

      const skillsFound = skillKeywords.filter(
        (skill) => description.includes(skill) || jobPageContent.includes(skill)
      );

      return {
        description,
        jobType,
        skills: skillsFound,
      };
    });

    return jobDetails;
  } catch (error) {
    console.error("Error scraping Indeed job details:", error);
    return {
      description: "",
      jobType: "Other",
      skills: [],
    };
  } finally {
    await browser.close();
  }
}

/**
 * Scrape Indeed jobs and save to database
 * @param {Object} options - Scraping options
 * @returns {Promise<number>} - Number of jobs saved
 */
export async function scrapeAndSaveIndeedJobs(options = {}) {
  try {
    const jobs = await scrapeIndeedJobs(options);
    const jobsWithDetails = [];
    let savedCount = 0;

    for (const job of jobs) {
      try {
        // Check if job already exists in database
        const existingJob = await Job.findOne({
          title: job.title,
          company: job.company,
          source: "Indeed",
        });

        if (!existingJob) {
          // Get additional job details including description
          console.log(
            `Fetching details for job: ${job.title} at ${job.company}`
          );
          const details = await scrapeIndeedJobDetails(job.url);
          const enhancedJob = {
            ...job,
            ...details,
          };

          jobsWithDetails.push(enhancedJob);

          // Save the enhanced job with description to the database
          await Job.create(enhancedJob);
          console.log(`Saved job with description: ${job.title}`);
          savedCount++;
        }
      } catch (error) {
        console.error(`Error saving Indeed job (${job.title}):`, error);
      }
    }

    console.log(`Indeed scraper completed. Saved ${savedCount} new jobs.`);
    return jobsWithDetails;
  } catch (error) {
    console.error("Indeed scraper error:", error);
    return 0;
  }
}

export default {
  scrapeIndeedJobs,
  scrapeIndeedJobDetails,
  scrapeAndSaveIndeedJobs,
};
