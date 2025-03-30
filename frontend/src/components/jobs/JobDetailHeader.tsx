import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import {
  LinkedIn as LinkedInIcon,
  Language as WebIcon,
} from "@mui/icons-material";
import { Job } from "../../services/api";

interface JobDetailHeaderProps {
  job: Job;
}

const JobDetailHeader: React.FC<JobDetailHeaderProps> = ({ job }) => {
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
    <Box>
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
    </Box>
  );
};

export default JobDetailHeader;
