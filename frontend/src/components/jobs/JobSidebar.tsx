import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Chip,
} from "@mui/material";
import {
  Work as WorkIcon,
  LocationOn as LocationIcon,
  AttachMoney as SalaryIcon,
  Apartment as CompanyIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { Job } from "../../services/api";

interface JobSidebarProps {
  job: Job;
}

const JobSidebar: React.FC<JobSidebarProps> = ({ job }) => {
  return (
    <>
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
    </>
  );
};

export default JobSidebar;
