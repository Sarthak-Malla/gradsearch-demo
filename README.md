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

1. Start MongoDB (if using local instance)

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

### Triggering Job Scraping

The application will automatically scrape job listings based on the cron schedule (default is 3 AM daily).
To manually trigger the scraping process:

1. Navigate to the Dashboard
2. Click on the "Update Data" button
3. Wait for the scraping process to complete

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

## Evaluation Criteria

This project was developed with focus on:

- **Data Collection & Cleaning**: Robust web scraping with error handling and data normalization
- **Visualization & Insights**: Interactive charts and statistical analysis
- **Code Efficiency & Modularity**: Clean, maintainable, and well-organized code

## License

This project is licensed under the MIT License
