# Job Market Insights API Documentation

This document provides comprehensive information about the API endpoints available in the Job Market Insights application.

## Base URL

All API endpoints are prefixed with:

```
http://localhost:5432/api
```

## Authentication

Currently, the API does not require authentication.

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error message description",
  "error": "Detailed error message (only in development mode)"
}
```

## API Endpoints

### Jobs API

#### Get All Jobs

Retrieves a list of jobs with optional filtering.

- **URL**: `/jobs`
- **Method**: `GET`
- **Query Parameters**:

  | Parameter       | Type   | Description                                        |
  | --------------- | ------ | -------------------------------------------------- |
  | source          | string | Filter by job source (LinkedIn, Indeed)            |
  | experienceLevel | string | Filter by experience level                         |
  | jobType         | string | Filter by job type                                 |
  | search          | string | Search term for job title, company, or description |
  | location        | string | Filter by location                                 |
  | page            | number | Page number for pagination (default: 1)            |
  | limit           | number | Number of results per page (default: 10)           |
  | sortBy          | string | Field to sort by (default: createdAt)              |
  | sortOrder       | string | Sort order: asc or desc (default: desc)            |

- **Success Response**:
  - **Code**: 200
  - **Content**:
  ```json
  {
    "success": true,
    "count": 10,
    "total": 100,
    "pages": 10,
    "currentPage": 1,
    "data": [
      {
        "_id": "job_id",
        "title": "Software Engineer",
        "company": "Example Company",
        "location": "New York, NY",
        "description": "Job description text...",
        "url": "https://example.com/job",
        "salary": "$100,000 - $120,000",
        "jobType": "Full-time",
        "experienceLevel": "Entry Level",
        "skills": ["JavaScript", "React", "Node.js"],
        "postedDate": "2023-10-15T00:00:00.000Z",
        "source": "LinkedIn",
        "createdAt": "2023-10-15T12:00:00.000Z",
        "updatedAt": "2023-10-15T12:00:00.000Z"
      }
      // Additional job objects...
    ]
  }
  ```

#### Get Job by ID

Retrieves a single job by its ID.

- **URL**: `/jobs/:id`
- **Method**: `GET`
- **URL Parameters**:

  - `id`: ID of the job to retrieve

- **Success Response**:

  - **Code**: 200
  - **Content**:

  ```json
  {
    "success": true,
    "data": {
      "_id": "job_id",
      "title": "Software Engineer",
      "company": "Example Company",
      "location": "New York, NY",
      "description": "Job description text...",
      "url": "https://example.com/job",
      "salary": "$100,000 - $120,000",
      "jobType": "Full-time",
      "experienceLevel": "Entry Level",
      "skills": ["JavaScript", "React", "Node.js"],
      "postedDate": "2023-10-15T00:00:00.000Z",
      "source": "LinkedIn",
      "createdAt": "2023-10-15T12:00:00.000Z",
      "updatedAt": "2023-10-15T12:00:00.000Z"
    }
  }
  ```

- **Error Response**:
  - **Code**: 404
  - **Content**:
  ```json
  {
    "success": false,
    "message": "Job not found"
  }
  ```

#### Get Job Statistics

Retrieves statistical insights from the job data.

- **URL**: `/jobs/stats`
- **Method**: `GET`

- **Success Response**:
  - **Code**: 200
  - **Content**:
  ```json
  {
    "success": true,
    "data": {
      "totalJobs": 100,
      "jobsBySource": [
        { "_id": "LinkedIn", "count": 60 },
        { "_id": "Indeed", "count": 40 }
      ],
      "jobsByExperienceLevel": [
        { "_id": "Entry Level", "count": 70 },
        { "_id": "Mid Level", "count": 30 }
      ],
      "jobsByType": [
        { "_id": "Full-time", "count": 75 },
        { "_id": "Part-time", "count": 15 },
        { "_id": "Contract", "count": 10 }
      ],
      "topLocations": [
        { "_id": "New York, NY", "count": 25 },
        { "_id": "San Francisco, CA", "count": 20 }
      ],
      "topCompanies": [
        { "_id": "Google", "count": 10 },
        { "_id": "Microsoft", "count": 8 }
      ],
      "topSkills": [
        { "_id": "JavaScript", "count": 50 },
        { "_id": "Python", "count": 40 }
      ],
      "jobsOverTime": [
        { "_id": { "year": 2023, "month": 10, "day": 15 }, "count": 20 }
      ]
    }
  }
  ```

### Scrapers API

#### Run Scrapers

Triggers an immediate job scraping process.

- **URL**: `/scrapers/run`
- **Method**: `POST`
- **Request Body**:

  ```json
  {
    "locations": ["United Arab Emirates", "Remote"]
  }
  ```

- **Success Response**:
  - **Code**: 202 (Accepted)
  - **Content**:
  ```json
  {
    "success": true,
    "message": "Job scraping started successfully",
    "locations": ["United Arab Emirates", "Remote"]
  }
  ```

#### Get Scraper Status

Retrieves the status of the scraping process.

- **URL**: `/scrapers/status`
- **Method**: `GET`

- **Success Response**:
  - **Code**: 200
  - **Content**:
  ```json
  {
    "success": true,
    "data": {
      "lastRun": "2023-10-15T12:00:00.000Z",
      "status": "completed",
      "jobsScraped": {
        "linkedin": 50,
        "indeed": 50
      },
      "nextScheduledRun": "2023-10-16T03:00:00.000Z"
    }
  }
  ```

## Data Models

### Job Model

```javascript
{
  title: String,         // Required: Job title
  company: String,       // Required: Company name
  location: String,      // Job location
  description: String,   // Detailed job description
  url: String,           // Required: URL to original job posting
  salary: String,        // Salary information if available
  jobType: String,       // Full-time, Part-time, Contract, Internship, Remote, Other
  experienceLevel: String, // Entry Level, Mid Level, Senior Level, Not Specified
  skills: [String],      // Array of required skills
  postedDate: Date,      // When the job was posted
  source: String,        // Required: LinkedIn, Indeed, Other
  createdAt: Date,       // When the job was added to our database
  updatedAt: Date        // When the job was last updated
}
```

## Usage Examples

### Fetching Jobs with Axios (JavaScript/TypeScript)

```javascript
import axios from "axios";

// Fetch all entry-level software engineering jobs
const fetchJobs = async () => {
  try {
    const response = await axios.get("http://localhost:5432/api/jobs", {
      params: {
        search: "software engineer",
        experienceLevel: "Entry Level",
        page: 1,
        limit: 10,
      },
    });

    console.log(`Found ${response.data.total} jobs`);
    console.log(response.data.data); // Array of job objects
  } catch (error) {
    console.error("Error fetching jobs:", error);
  }
};

// Trigger job scraping
const triggerScraping = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5432/api/scrapers/run",
      {
        locations: ["United Arab Emirates"],
      }
    );

    console.log(response.data.message);
  } catch (error) {
    console.error("Error triggering scraping:", error);
  }
};
```

### Fetching Job Stats with Fetch API (JavaScript)

```javascript
fetch("http://localhost:5432/api/jobs/stats")
  .then((response) => response.json())
  .then((data) => {
    if (data.success) {
      console.log(`Total jobs: ${data.data.totalJobs}`);
      console.log("Top skills:", data.data.topSkills);
    }
  })
  .catch((error) => console.error("Error fetching stats:", error));
```
