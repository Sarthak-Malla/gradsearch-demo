import React from "react";
import { Paper, Box, Typography, SxProps, Theme } from "@mui/material";

interface StatCardProps {
  title: string;
  value?: string | number;
  icon: React.ReactNode;
  color?: string;
  sx?: SxProps<Theme>;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color = "primary.main",
  sx,
}) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        ...sx,
      }}
    >
      <Box
        sx={{
          bgcolor: `${color}15`, // Light version of color for background
          borderRadius: "50%",
          p: 1.5,
          mr: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: color,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="body2" color="textSecondary">
          {title}
        </Typography>
        <Typography variant="h5" component="div" fontWeight="bold">
          {value}
        </Typography>
      </Box>
    </Paper>
  );
};

export default StatCard;
