import React from "react";
import {
  Box,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  SelectChangeEvent,
} from "@mui/material";

interface FilterValues {
  search: string;
  source: string;
  location: string;
  jobType: string;
  experienceLevel: string;
}

interface JobFilterProps {
  filters: FilterValues;
  onFilterChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (event: SelectChangeEvent) => void;
  onClearFilters: () => void;
  onApplyFilters: (event: React.FormEvent) => void;
}

const JobFilter: React.FC<JobFilterProps> = ({
  filters,
  onFilterChange,
  onSelectChange,
  onClearFilters,
  onApplyFilters,
}) => {
  return (
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
              onChange={onSelectChange}
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
            onChange={onFilterChange}
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
              onChange={onSelectChange}
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
              onChange={onSelectChange}
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
          onClick={onClearFilters}
          sx={{ mr: 1 }}
        >
          Clear All
        </Button>
        <Button variant="contained" color="primary" onClick={onApplyFilters}>
          Apply Filters
        </Button>
      </Box>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
};

export default JobFilter;
