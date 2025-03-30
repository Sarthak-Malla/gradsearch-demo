import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Box,
  Chip,
  Divider,
  Button,
} from "@mui/material";
import {
  LinkedIn as LinkedInIcon,
  Language as WebIcon,
} from "@mui/icons-material";
import { Job } from "../../services/api";

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
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
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
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
  );
};

export default JobCard;
