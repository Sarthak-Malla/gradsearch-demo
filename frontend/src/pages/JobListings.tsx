import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  SelectChangeEvent,
} from "@mui/material";
import {
  Search as SearchIcon,
  LinkedIn as LinkedInIcon,
  Language as WebIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import Layout from "../components/Layout";
import api, { Job, JobsResponse } from "../services/api";

const JobListings: React.FC = () => {
  // State for jobs data
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for pagination
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalJobs, setTotalJobs] = useState<number>(0);

  // State for filters
  const [filters, setFilters] = useState({
    search: "",
    source: "",
    location: "",
    jobType: "",
    experienceLevel: "Entry Level",
  });
  const [filtersOpen, setFiltersOpen] = useState<boolean>(false);

  // Handle filter changes
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle dropdown filter changes
  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle search form submission
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(1); // Reset to first page on new search
    fetchJobs();
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      search: "",
      source: "",
      location: "",
      jobType: "",
      experienceLevel: "Entry Level",
    });
    setPage(1);
  };

  // Toggle filters panel
  const toggleFilters = () => {
    setFiltersOpen(!filtersOpen);
  };

  // Handle page change
  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPage(value);
  };

  // Fetch jobs data
  const fetchJobs = async () => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: 10,
        ...filters,
        // Only include non-empty filters
        ...(filters.search ? { search: filters.search } : {}),
        ...(filters.source ? { source: filters.source } : {}),
        ...(filters.location ? { location: filters.location } : {}),
        ...(filters.jobType ? { jobType: filters.jobType } : {}),
        ...(filters.experienceLevel
          ? { experienceLevel: filters.experienceLevel }
          : {}),
      };

      const response = await api.jobs.getAll(params);

      setJobs(response.data);
      setTotalPages(response.pages);
      setTotalJobs(response.total);
      setError(null);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to load jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch jobs on component mount and when page or filters change
  useEffect(() => {
    fetchJobs();
  }, [page]); // intentionally exclude filters to prevent auto-search on filter change

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

  return (
    <Layout title="Job Listings">
      <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5">Early Career Job Listings</Typography>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={toggleFilters}
          >
            Filters
          </Button>
        </Box>

        {/* Search bar */}
        <form onSubmit={handleSearch}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search jobs by title, company, or keywords..."
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: filters.search ? (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, search: "" }))
                    }
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
            sx={{ mb: 2 }}
          />
        </form>

        {/* Advanced filters */}
        {filtersOpen && (
          <Box mt={2} mb={3}>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel id="source-label">Source</InputLabel>
                  <Select
                    labelId="source-label"
                    label="Source"
                    name="source"
                    value={filters.source}
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="">All Sources</MenuItem>
                    <MenuItem value="LinkedIn">LinkedIn</MenuItem>
                    <MenuItem value="Indeed">Indeed</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="e.g. New York, Remote"
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel id="job-type-label">Job Type</InputLabel>
                  <Select
                    labelId="job-type-label"
                    label="Job Type"
                    name="jobType"
                    value={filters.jobType}
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="Full-time">Full-time</MenuItem>
                    <MenuItem value="Part-time">Part-time</MenuItem>
                    <MenuItem value="Contract">Contract</MenuItem>
                    <MenuItem value="Internship">Internship</MenuItem>
                    <MenuItem value="Remote">Remote</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel id="experience-level-label">
                    Experience Level
                  </InputLabel>
                  <Select
                    labelId="experience-level-label"
                    label="Experience Level"
                    name="experienceLevel"
                    value={filters.experienceLevel}
                    onChange={handleSelectChange}
                  >
                    <MenuItem value="">All Levels</MenuItem>
                    <MenuItem value="Entry Level">Entry Level</MenuItem>
                    <MenuItem value="Mid Level">Mid Level</MenuItem>
                    <MenuItem value="Senior Level">Senior Level</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClearFilters}
                sx={{ mr: 1 }}
              >
                Clear All
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSearch}
              >
                Apply Filters
              </Button>
            </Box>
            <Divider sx={{ mt: 2 }} />
          </Box>
        )}

        {/* Results summary */}
        <Box mb={2}>
          <Typography variant="body2" color="textSecondary">
            Showing {jobs.length} of {totalJobs} jobs
          </Typography>
        </Box>
      </Paper>

      {/* Loading state */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" my={4}>
          <Typography color="error">{error}</Typography>
        </Box>
      ) : jobs.length === 0 ? (
        <Paper
          elevation={2}
          sx={{ p: 3, textAlign: "center", borderRadius: 2 }}
        >
          <Typography variant="h6">No jobs found</Typography>
          <Typography variant="body2" color="textSecondary" mt={1}>
            Try adjusting your search filters or check back later for new job
            listings.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {jobs.map((job) => (
            <Grid size={12} key={job._id}>
              <Card elevation={2} sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="flex-start"
                  >
                    <Box>
                      <Typography
                        variant="h6"
                        component={Link}
                        to={`/jobs/${job._id}`}
                        sx={{ textDecoration: "none", color: "primary.main" }}
                      >
                        {job.title}
                      </Typography>
                      <Typography variant="subtitle1" color="textSecondary">
                        {job.company}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ mt: 1 }}
                      >
                        📍 {job.location}
                      </Typography>
                      {job.salary && (
                        <Typography variant="body2" color="textSecondary">
                          💰 {job.salary}
                        </Typography>
                      )}
                    </Box>
                    <Chip
                      icon={renderSourceIcon(job.source)}
                      label={job.source}
                      size="small"
                      color={
                        job.source === "LinkedIn"
                          ? "primary"
                          : job.source === "Indeed"
                          ? "secondary"
                          : "default"
                      }
                      variant="outlined"
                    />
                  </Box>

                  <Box mt={2} display="flex" gap={1} flexWrap="wrap">
                    <Chip
                      size="small"
                      label={job.experienceLevel}
                      color="primary"
                      variant="outlined"
                    />
                    <Chip
                      size="small"
                      label={job.jobType || "Unspecified"}
                      variant="outlined"
                    />
                    {job.skills &&
                      job.skills
                        .slice(0, 3)
                        .map((skill, index) => (
                          <Chip
                            key={index}
                            size="small"
                            label={skill}
                            variant="outlined"
                          />
                        ))}
                  </Box>
                </CardContent>
                <Divider />
                <CardActions sx={{ justifyContent: "space-between" }}>
                  <Typography variant="caption" color="textSecondary">
                    Posted:{" "}
                    {job.postedDate
                      ? new Date(job.postedDate).toLocaleDateString()
                      : "Recently"}
                  </Typography>
                  <Button
                    size="small"
                    component="a"
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Apply Now
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <Grid size={12}>
              <Box display="flex" justifyContent="center" mt={2}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  showFirstButton
                  showLastButton
                />
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Layout>
  );
};

export default JobListings;
