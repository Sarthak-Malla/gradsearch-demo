# Job Market Insights Dashboard

A full-stack web application for scraping, analyzing, and visualizing early career job postings from LinkedIn and Indeed.

## Overview

The Job Market Insights Dashboard provides real-time data on the job market for early career professionals. It scrapes job listings from credible job sites, processes the data, and presents it in an interactive dashboard with filters, visualizations, and insights.

## Features

- **Web Scraping**: Automated data collection from LinkedIn and Indeed
- **Advanced Filtering**: Search and filter jobs by source, location, job type, etc.
- **Data Visualization**: Charts and graphs showing job market trends
- **Early Career Focus**: Specifically targets entry-level positions
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React, TypeScript, Material UI, Recharts
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Web Scraping**: Puppeteer, Cheerio
- **Task Scheduling**: Node-cron

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or remote)
- npm or yarn

### MongoDB Setup

1. Install MongoDB locally if you haven't already:

   - **macOS** (using Homebrew):
     ```
     brew tap mongodb/brew
     brew install mongodb-community
     ```
   - **Windows/Linux**: Download from [MongoDB website](https://www.mongodb.com/try/download/community)

2. Start MongoDB service:

   - **macOS**:
     ```
     brew services start mongodb-community
     ```
   - **Windows**: MongoDB should run as a service or you can start it manually
   - **Linux**:
     ```
     sudo systemctl start mongod
     ```

3. Verify MongoDB is running:
   ```
   mongosh
   ```
   You should see the MongoDB shell connection prompt. Type `exit` to close the shell.

### Installation

1. Clone the repository

2. Install backend dependencies:

   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies:

   ```
   cd frontend
   npm install
   ```

4. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/job-market-insights
   NODE_ENV=development
   ```

### Running the Application

1. Make sure MongoDB is running:

   ```
   brew services status mongodb-community  # For macOS
   ```

   If it's not running, start it with `brew services start mongodb-community`

2. Start the backend server:

   ```
   cd backend
   npm run dev
   ```

3. Start the frontend development server:

   ```
   cd frontend
   npm start
   ```

4. Access the application at `http://localhost:3000`

### Populating the Database

Before you can view meaningful data in the dashboard, you need to populate the database with job listings:

1. Make sure the backend server is running

2. Use the provided API to trigger job scraping:

   ```
   curl -X POST http://localhost:8080/api/scrapers/run -H "Content-Type: application/json" -d '{"locations":["United Arab Emirates"]}'
   ```

   Alternatively, you can use the API in your browser by:

   1. Navigate to the Dashboard
   2. Open the browser console (F12)
   3. Run this command:

   ```javascript
   fetch("http://localhost:8080/api/scrapers/run", {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify({ locations: ["United Arab Emirates"] }),
   })
     .then((res) => res.json())
     .then((data) => console.log(data));
   ```

3. The scraping process will run in the background. This may take a few minutes depending on the number of jobs found.

4. Once the scraping is complete, refresh the dashboard to see the populated data.

## API Documentation

Full API documentation can be found in the [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) file, which details all available endpoints, request parameters, and response formats.

## Project Structure

### Backend

- `server.js`: Entry point for the Express application
- `models/`: MongoDB schemas
- `controllers/`: API route handlers
- `routes/`: API endpoints
- `scrapers/`: Web scraping modules
- `utils/`: Utility functions including scheduler

### Frontend

- `src/components/`: Reusable UI components
- `src/pages/`: Main application pages
- `src/services/`: API service for backend communication

## Troubleshooting

### MongoDB Connection Issues

If you encounter MongoDB connection issues:

1. Make sure MongoDB is running:

   ```
   mongosh
   ```

2. Check if the MongoDB connection string in your `.env` file is correct:

   ```
   MONGODB_URI=mongodb://localhost:27017/job-market-insights
   ```

3. If using a custom port, update the connection string accordingly.

### No Jobs Appearing in Dashboard

1. Check if the scraping process was successful by checking the console output of the backend server
2. Verify jobs exist in the database:
   ```
   mongosh
   use job-market-insights
   db.jobs.countDocuments()
   ```
3. Check if the backend API is responding correctly:
   ```
   curl http://localhost:8080/api/jobs
   ```

## Evaluation Criteria

This project was developed with focus on:

- **Data Collection & Cleaning**: Robust web scraping with error handling and data normalization
- **Visualization & Insights**: Interactive charts and statistical analysis
- **Code Efficiency & Modularity**: Clean, maintainable, and well-organized code

## License

This project is licensed under the MIT License
