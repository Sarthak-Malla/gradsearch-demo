import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Layout from "../components/Layout";
import api, { StatsResponse } from "../services/api";

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<StatsResponse["data"] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#82ca9d",
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.jobs.getStats();
        setStats(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching job stats:", err);
        setError("Failed to load job statistics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Layout title="Dashboard">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Dashboard">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh"
        >
          <Typography color="error">{error}</Typography>
        </Box>
      </Layout>
    );
  }

  // Format data for charts
  const sourceData =
    stats?.jobsBySource.map((item) => ({
      name: item._id,
      value: item.count,
    })) || [];

  const jobTypeData =
    stats?.jobsByType.map((item) => ({
      name: item._id || "Not Specified",
      count: item.count,
    })) || [];

  const topLocationsData =
    stats?.topLocations.map((item) => ({
      name: item._id || "Other",
      count: item.count,
    })) || [];

  const topCompaniesData =
    stats?.topCompanies.slice(0, 5).map((item) => ({
      name: item._id,
      count: item.count,
    })) || [];

  return (
    <Layout title="Job Market Insights Dashboard">
      <Grid container spacing={3}>
        {/* Stats Summary */}
        <Grid size={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>
              Job Market Overview
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  elevation={0}
                  sx={{ bgcolor: "rgba(25, 118, 210, 0.08)", height: "100%" }}
                >
                  <CardContent>
                    <Typography variant="subtitle2" color="textSecondary">
                      Total Jobs
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: "bold" }}>
                      {stats?.totalJobs.toLocaleString() || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  elevation={0}
                  sx={{ bgcolor: "rgba(76, 175, 80, 0.08)", height: "100%" }}
                >
                  <CardContent>
                    <Typography variant="subtitle2" color="textSecondary">
                      Job Sources
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: "bold" }}>
                      {stats?.jobsBySource.length || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  elevation={0}
                  sx={{ bgcolor: "rgba(156, 39, 176, 0.08)", height: "100%" }}
                >
                  <CardContent>
                    <Typography variant="subtitle2" color="textSecondary">
                      Companies
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: "bold" }}>
                      {stats?.topCompanies.length || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <Card
                  elevation={0}
                  sx={{ bgcolor: "rgba(255, 152, 0, 0.08)", height: "100%" }}
                >
                  <CardContent>
                    <Typography variant="subtitle2" color="textSecondary">
                      Top Skills
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 1, fontWeight: "bold" }}>
                      {stats?.topSkills.length || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Job Sources Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Jobs by Source
            </Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sourceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Job Types Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Jobs by Type
            </Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={jobTypeData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" name="Jobs" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Top Locations Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top Locations
            </Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topLocationsData.slice(0, 6)}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" name="Jobs" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Top Companies Chart */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top Companies
            </Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topCompaniesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#0088FE" name="Jobs" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Top Skills */}
        <Grid size={12}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Top Skills in Demand
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
              {stats?.topSkills.slice(0, 20).map((skill, index) => (
                <Chip
                  key={index}
                  label={`${skill._id} (${skill.count})`}
                  color={index < 5 ? "primary" : "default"}
                  variant={index < 8 ? "filled" : "outlined"}
                />
              ))}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Dashboard;
