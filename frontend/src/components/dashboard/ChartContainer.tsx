import React from "react";
import { Paper, Box, Typography, Divider } from "@mui/material";

interface ChartContainerProps {
  title: string;
  description?: string;
  height?: number | string;
  children: React.ReactNode;
}

const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  description,
  height = 300,
  children,
}) => {
  return (
    <Paper elevation={2} sx={{ p: 2, borderRadius: 2, height: "100%" }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="textSecondary" paragraph>
          {description}
        </Typography>
      )}
      <Divider sx={{ my: 1 }} />
      <Box
        sx={{
          height: height,
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </Box>
    </Paper>
  );
};

export default ChartContainer;
