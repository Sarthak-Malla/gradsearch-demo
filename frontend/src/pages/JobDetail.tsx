import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  Divider,
  CircularProgress,
  Grid,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import Layout from "../components/Layout";
import JobDetailHeader from "../components/jobs/JobDetailHeader";
import JobSidebar from "../components/jobs/JobSidebar";
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
            <JobDetailHeader job={job} />

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
          <JobSidebar job={job} />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default JobDetail;
