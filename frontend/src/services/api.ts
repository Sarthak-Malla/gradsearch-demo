import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5432/api";

// Job types and interfaces
export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description?: string;
  url: string;
  salary?: string;
  jobType: string;
  experienceLevel: string;
  skills: string[];
  postedDate?: Date;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobsResponse {
  success: boolean;
  count: number;
  total: number;
  pages: number;
  currentPage: number;
  data: Job[];
}

export interface JobResponse {
  success: boolean;
  data: Job;
}

export interface StatsResponse {
  success: boolean;
  data: {
    totalJobs: number;
    jobsBySource: { _id: string; count: number }[];
    jobsByExperienceLevel: { _id: string; count: number }[];
    jobsByType: { _id: string; count: number }[];
    topLocations: { _id: string; count: number }[];
    topCompanies: { _id: string; count: number }[];
    topSkills: { _id: string; count: number }[];
    jobsOverTime: {
      _id: { year: number; month: number; day: number };
      count: number;
    }[];
  };
}

export interface ScraperStatusResponse {
  success: boolean;
  data: {
    lastRun: Date;
    status: string;
    jobsScraped: {
      linkedin: number;
      indeed: number;
    };
    nextScheduledRun: Date;
  };
}

// API functions
const api = {
  // Job-related API calls
  jobs: {
    // Get all jobs with optional filtering
    getAll: async (params?: {
      source?: string;
      experienceLevel?: string;
      jobType?: string;
      search?: string;
      location?: string;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: "asc" | "desc";
    }): Promise<JobsResponse> => {
      const response = await axios.get(`${API_URL}/jobs`, { params });
      return response.data;
    },

    // Get a single job by ID
    getById: async (id: string): Promise<JobResponse> => {
      const response = await axios.get(`${API_URL}/jobs/${id}`);
      return response.data;
    },

    // Get job statistics and insights
    getStats: async (): Promise<StatsResponse> => {
      const response = await axios.get(`${API_URL}/jobs/stats`);
      return response.data;
    },
  },

  // Scraper-related API calls
  scrapers: {
    // Trigger immediate job scraping
    runNow: async (
      locations?: string[]
    ): Promise<{ success: boolean; message: string }> => {
      const response = await axios.post(`${API_URL}/scrapers/run`, {
        locations,
      });
      return response.data;
    },

    // Get scraping status and stats
    getStatus: async (): Promise<ScraperStatusResponse> => {
      const response = await axios.get(`${API_URL}/scrapers/status`);
      return response.data;
    },
  },
};

export default api;
