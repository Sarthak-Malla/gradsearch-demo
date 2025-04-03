import Job from "../models/job.js";
import chromaService from "../chroma/config.js";

/**
 * Get all jobs with optional filtering
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.source] - Filter by job source (LinkedIn, Indeed)
 * @param {string} [req.query.experienceLevel] - Filter by experience level
 * @param {string} [req.query.jobType] - Filter by job type
 * @param {string} [req.query.search] - Search term for job title, company, or description
 * @param {string} [req.query.location] - Filter by location
 * @param {number} [req.query.page=1] - Page number for pagination
 * @param {number} [req.query.limit=20] - Number of results per page
 * @param {Object} res - Express response object
 */
export const getAllJobs = async (req, res) => {
  try {
    const {
      source,
      experienceLevel,
      jobType,
      search,
      location,
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build query filters
    const query = {};

    if (source) {
      query.source = source;
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (location) {
      // Case-insensitive partial match for location
      query.location = { $regex: location, $options: "i" };
    }

    if (search) {
      // Full-text search across multiple fields
      query.$text = { $search: search };
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Determine sort order
    const sort = {};
    sort[sortBy] = sortOrder === "asc" ? 1 : -1;

    // Execute query with pagination
    const jobs = await Job.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalJobs = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      count: jobs.length,
      total: totalJobs,
      pages: Math.ceil(totalJobs / parseInt(limit)),
      currentPage: parseInt(page),
      data: jobs,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get a single job by ID
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Job ID
 * @param {Object} res - Express response object
 */
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error(`Error fetching job with ID ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get job statistics and insights
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getJobStats = async (req, res) => {
  try {
    // Total job count
    const totalJobs = await Job.countDocuments();

    // Jobs by source
    const jobsBySource = await Job.aggregate([
      { $group: { _id: "$source", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Jobs by experience level
    const jobsByExperienceLevel = await Job.aggregate([
      { $group: { _id: "$experienceLevel", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Jobs by job type
    const jobsByType = await Job.aggregate([
      { $group: { _id: "$jobType", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Top locations
    const topLocations = await Job.aggregate([
      { $group: { _id: "$location", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Top companies
    const topCompanies = await Job.aggregate([
      { $group: { _id: "$company", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Top skills (requires jobs with skills array)
    const topSkills = await Job.aggregate([
      { $unwind: "$skills" },
      { $group: { _id: "$skills", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]);

    // Jobs posted over time (by day)
    const jobsOverTime = await Job.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalJobs,
        jobsBySource,
        jobsByExperienceLevel,
        jobsByType,
        topLocations,
        topCompanies,
        topSkills,
        jobsOverTime,
      },
    });
  } catch (error) {
    console.error("Error fetching job statistics:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get job search using ChromaDB
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.query] - Search query
 * @param {number} [req.query.nResults=5] - Number of results to return
 * @param {Object} res - Express response object
 */
export const getJobSemanticSearch = async (req, res) => {
  try {
    const { query, nResults = 5 } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Query parameter is required",
      });
    }

    await chromaService.init();

    // Perform search using ChromaDB
    const chromaResults = await chromaService.searchJobs(
      query,
      parseInt(nResults)
    );

    // Extract URLs from the metadata
    const urls = [];
    if (
      chromaResults &&
      chromaResults.metadatas &&
      chromaResults.metadatas.length > 0
    ) {
      for (const metadataArray of chromaResults.metadatas) {
        for (const metadata of metadataArray) {
          if (metadata.url) {
            urls.push(metadata.url);
          }
        }
      }
    }

    // If no URLs found, return the raw results
    if (urls.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No matching jobs found in database",
        data: chromaResults,
      });
    }

    // Query MongoDB for jobs with matching URLs
    const jobs = await Job.find({ url: { $in: urls } });

    // Map the jobs to match the order of the semantic search results
    const orderedJobs = urls
      .map((url) => {
        return jobs.find((job) => job.url === url) || null;
      })
      .filter(Boolean); // Remove any null values

    res.status(200).json({
      success: true,
      count: orderedJobs.length,
      data: {
        jobs: orderedJobs,
        chromaResults: chromaResults, // Include original results for reference
      },
    });
  } catch (error) {
    console.error("Error searching jobs:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export default {
  getAllJobs,
  getJobById,
  getJobStats,
  getJobSemanticSearch,
};
