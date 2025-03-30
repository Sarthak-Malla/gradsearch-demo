import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  Grid,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
} from "@mui/material";
import {
  Work as WorkIcon,
  LinkedIn as LinkedInIcon,
  Language as WebIcon,
  LocationOn as LocationIcon,
  AttachMoney as SalaryIcon,
  Apartment as CompanyIcon,
  CalendarToday as CalendarIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import Layout from "../components/Layout";
import api, { Job } from "../services/api";

const JobDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const response = await api.jobs.getById(id);
        setJob(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching job details:", err);
        setError("Failed to load job details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  // Render source icon based on job source
  const renderSourceIcon = (source: string) => {
    switch (source) {
      case "LinkedIn":
        return <LinkedInIcon sx={{ color: "#0077B5" }} />;
      case "Indeed":
        return <WebIcon sx={{ color: "#2164f3" }} />;
      default:
        return <WebIcon />;
    }
  };

  if (loading) {
    return (
      <Layout title="Job Details">
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

  if (error || !job) {
    return (
      <Layout title="Job Details">
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Box display="flex" flexDirection="column" alignItems="center" py={3}>
            <Typography color="error" gutterBottom>
              {error || "Job not found"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/jobs")}
              sx={{ mt: 2 }}
            >
              Back to Job Listings
            </Button>
          </Box>
        </Paper>
      </Layout>
    );
  }

  return (
    <Layout title={`${job.title} at ${job.company}`}>
      <Box mb={2}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/jobs")}
        >
          Back to Job Listings
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Main job details */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="flex-start"
            >
              <Box>
                <Typography variant="h5" fontWeight="bold">
                  {job.title}
                </Typography>
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  {job.company}
                </Typography>
              </Box>
              <Chip
                icon={renderSourceIcon(job.source)}
                label={job.source}
                color={
                  job.source === "LinkedIn"
                    ? "primary"
                    : job.source === "Indeed"
                    ? "secondary"
                    : "default"
                }
              />
            </Box>

            <Box display="flex" gap={1} flexWrap="wrap" my={2}>
              <Chip label={job.experienceLevel} color="primary" />
              <Chip label={job.jobType || "Unspecified"} />
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              Job Description
            </Typography>
            {job.description ? (
              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {job.description}
              </Typography>
            ) : (
              <Box bgcolor="background.default" p={2} borderRadius={1}>
                <Typography variant="body2" color="textSecondary">
                  No detailed description available. Please visit the original
                  job posting for more information.
                </Typography>
              </Box>
            )}

            <Box mt={3}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                fullWidth
              >
                Apply for this Job
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar with additional information */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Card elevation={2} sx={{ borderRadius: 2, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Job Details
              </Typography>
              <List disablePadding>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CompanyIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Company" secondary={job.company} />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <LocationIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText primary="Location" secondary={job.location} />
                </ListItem>
                {job.salary && (
                  <ListItem disableGutters>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <SalaryIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Salary" secondary={job.salary} />
                  </ListItem>
                )}
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <WorkIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Job Type"
                    secondary={job.jobType || "Not specified"}
                  />
                </ListItem>
                <ListItem disableGutters>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CalendarIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Posted Date"
                    secondary={
                      job.postedDate
                        ? new Date(job.postedDate).toLocaleDateString()
                        : "Recently"
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          {job.skills && job.skills.length > 0 && (
            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Required Skills
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {job.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      variant="outlined"
                      size="small"
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default JobDetail;
