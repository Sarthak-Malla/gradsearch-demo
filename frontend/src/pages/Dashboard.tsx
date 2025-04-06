import React, { useState, useEffect } from "react";
import { Grid, Box, Typography, CircularProgress } from "@mui/material";
import {
  Work as WorkIcon,
  Apartment as CompanyIcon,
  BarChart as ChartIcon,
  LocationOn as LocationIcon,
} from "@mui/icons-material";
import Layout from "../components/Layout";
import StatCard from "../components/dashboard/StatCard";
import ChartContainer from "../components/dashboard/ChartContainer";
import BarChart from "../components/dashboard/BarChart";
import PieChart from "../components/dashboard/PieChart";
import api, { StatsResponse } from "../services/api";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<StatsResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Fetch dashboard statistics
        const response = await api.jobs.getStats();
        setStats(response.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout title="Dashboard">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="50vh"
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard">
        <Box display="flex" justifyContent="center" my={4}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard">
      <Box mb={4}>
        <Typography variant="body1" color="textSecondary">
          Overview of the current early career job market based on our data
        </Typography>
      </Box>

      {/* Stat cards for key metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Total Jobs"
            value={stats?.totalJobs.toLocaleString()}
            icon={<WorkIcon />}
            color="primary.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Companies Hiring"
            value={stats?.topCompanies.length.toLocaleString()}
            icon={<CompanyIcon />}
            color="secondary.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Average Salary"
            value="$75,000"
            icon={<ChartIcon />}
            color="success.main"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Remote Jobs"
            value="24%"
            icon={<LocationIcon />}
            color="warning.main"
          />
        </Grid>
      </Grid>

      {/* Charts and Insights Section */}
      <Grid container spacing={3}>
        {/* Top Locations Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartContainer
            title="Top Job Locations"
            description="Cities with the highest number of job listings"
          >
            {stats?.topLocations && stats.topLocations.length > 0 ? (
              <BarChart
                data={stats.topLocations}
                horizontal={true}
                color="rgba(130, 202, 157, 0.8)"
              />
            ) : (
              <Typography color="textSecondary">
                No location data available
              </Typography>
            )}
          </ChartContainer>
        </Grid>

        {/* Top Companies Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartContainer
            title="Top Hiring Companies"
            description="Companies with the most job listings"
          >
            {stats?.topCompanies && stats.topCompanies.length > 0 ? (
              <BarChart
                data={stats.topCompanies}
                horizontal={true}
                color="rgba(54, 162, 235, 0.8)"
              />
            ) : (
              <Typography color="textSecondary">
                No company data available
              </Typography>
            )}
          </ChartContainer>
        </Grid>

        {/* Job Source Distribution Pie Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartContainer
            title="Job Source Distribution"
            description="Distribution of jobs by source platform"
          >
            {stats?.jobsBySource && stats.jobsBySource.length > 0 ? (
              <PieChart
                data={stats.jobsBySource}
                colors={[
                  "rgba(0, 119, 181, 0.8)", // LinkedIn blue
                  "rgba(33, 100, 243, 0.8)", // Indeed blue
                  "rgba(128, 128, 128, 0.8)", // Grey for others
                ]}
              />
            ) : (
              <Typography color="textSecondary">
                No source data available
              </Typography>
            )}
          </ChartContainer>
        </Grid>

        {/* Top Skills Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartContainer
            title="Top In-Demand Skills"
            description="Most requested skills among entry-level job postings"
          >
            {stats?.topSkills && stats.topSkills.length > 0 ? (
              <BarChart
                data={stats.topSkills}
                horizontal={true}
                color="rgba(255, 99, 132, 0.8)"
              />
            ) : (
              <Typography color="textSecondary">
                No skill data available
              </Typography>
            )}
          </ChartContainer>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Dashboard;
