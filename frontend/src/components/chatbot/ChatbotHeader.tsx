import React from "react";
import { Box, Typography, IconButton, Divider } from "@mui/material";
import { Refresh as RefreshIcon } from "@mui/icons-material";
import { useChat } from "../../context/ChatContext";

const ChatbotHeader: React.FC = () => {
  const { resetChat } = useChat();

  return (
    <Box
      sx={{
        p: 2,
        bgcolor: "primary.main",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography variant="h6" fontWeight="medium">
        Job Assistant
      </Typography>
      <IconButton
        size="small"
        color="inherit"
        onClick={resetChat}
        title="Reset conversation"
      >
        <RefreshIcon />
      </IconButton>
    </Box>
  );
};

export default ChatbotHeader;
