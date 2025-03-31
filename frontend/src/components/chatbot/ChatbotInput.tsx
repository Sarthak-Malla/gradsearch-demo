import React, { useState, KeyboardEvent } from "react";
import { Box, TextField, IconButton, Divider } from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";
import { useChat } from "../../context/ChatContext";

const ChatbotInput: React.FC = () => {
  const [input, setInput] = useState("");
  const { addMessage } = useChat();

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    addMessage({ type: "user", text: input });
    setInput("");
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <Divider />
      <Box
        sx={{
          p: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Type your message..."
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
            },
          }}
        />
        <IconButton
          color="primary"
          disabled={input.trim() === ""}
          onClick={handleSendMessage}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </>
  );
};

export default ChatbotInput;
