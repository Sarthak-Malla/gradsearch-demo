import React from "react";
import { Link } from "react-router-dom";
import { Box, Typography, Button, Paper } from "@mui/material";
import Layout from "../components/Layout";

const NotFound: React.FC = () => {
  return (
    <Layout title="Page Not Found">
      <Paper
        elevation={2}
        sx={{
          p: 5,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          my: 4,
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          The page you are looking for doesn't exist or has been moved.
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to="/"
            sx={{ mr: 2 }}
          >
            Go to Dashboard
          </Button>
          <Button variant="outlined" component={Link} to="/jobs">
            Browse Jobs
          </Button>
        </Box>
      </Paper>
    </Layout>
  );
};

export default NotFound;
