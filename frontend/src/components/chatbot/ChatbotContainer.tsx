import React, { useEffect, useRef } from "react";
import { Box, Paper, Fab, Zoom, useTheme, Tooltip } from "@mui/material";
import { Chat as ChatIcon, Close as CloseIcon } from "@mui/icons-material";
import { useChat } from "../../context/ChatContext";
import ChatbotHeader from "./ChatbotHeader";
import ChatbotMessages from "./ChatbotMessages";
import ChatbotInput from "./ChatbotInput";

const ChatbotContainer: React.FC = () => {
  const theme = useTheme();
  const { isOpen, toggleChat } = useChat();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages are added
  useEffect(() => {
    if (isOpen && chatContainerRef.current) {
      const chatContainer = chatContainerRef.current;
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [isOpen]);

  return (
    <>
      {/* Chat button */}
      <Box position="fixed" bottom={16} right={16} zIndex={1000}>
        <Tooltip title={isOpen ? "Close chat" : "Get job recommendations"}>
          <Fab color="primary" onClick={toggleChat} aria-label="chat">
            {isOpen ? <CloseIcon /> : <ChatIcon />}
          </Fab>
        </Tooltip>
      </Box>

      {/* Chat popup */}
      <Zoom in={isOpen} unmountOnExit>
        <Paper
          elevation={3}
          sx={{
            position: "fixed",
            bottom: 80,
            right: 16,
            width: { xs: "calc(100% - 32px)", sm: 350 },
            height: 500,
            maxHeight: "calc(100vh - 100px)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            borderRadius: 2,
          }}
        >
          <ChatbotHeader />

          <ChatbotMessages ref={chatContainerRef} />

          <ChatbotInput />
        </Paper>
      </Zoom>
    </>
  );
};

export default ChatbotContainer;
