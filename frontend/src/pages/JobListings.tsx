import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Divider,
  Pagination,
  SelectChangeEvent,
} from "@mui/material";
import { FilterList as FilterIcon } from "@mui/icons-material";
import Layout from "../components/Layout";
import SearchBar from "../components/common/SearchBar";
import JobFilter from "../components/jobs/JobFilter";
import JobCard from "../components/jobs/JobCard";
import api, { Job } from "../services/api";

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

  // Handle search clear
  const handleSearchClear = () => {
    setFilters((prev) => ({ ...prev, search: "" }));
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
        <SearchBar
          value={filters.search}
          onChange={handleFilterChange}
          onClear={handleSearchClear}
          onSubmit={handleSearch}
          placeholder="Search jobs by title, company, or keywords..."
        />

        {/* Advanced filters */}
        {filtersOpen && (
          <JobFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onSelectChange={handleSelectChange}
            onClearFilters={handleClearFilters}
            onApplyFilters={handleSearch}
          />
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
              <JobCard job={job} />
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
