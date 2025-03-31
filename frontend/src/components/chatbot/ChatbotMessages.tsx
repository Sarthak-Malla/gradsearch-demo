import React, { forwardRef } from "react";
import { Box, Typography, Chip, Button, Paper, Link } from "@mui/material";
import { SmartToy as BotIcon, Person as UserIcon } from "@mui/icons-material";
import { useChat } from "../../context/ChatContext";
import { Job } from "../../services/api";

interface JobRecommendationProps {
  job: Job;
}

const JobRecommendation: React.FC<JobRecommendationProps> = ({ job }) => {
  return (
    <Paper
      elevation={0}
      variant="outlined"
      sx={{
        p: 1.5,
        my: 1,
        maxWidth: "95%",
        borderRadius: 1.5,
        borderColor: "primary.light",
      }}
    >
      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
        {job.title}
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        {job.company} • {job.location}
      </Typography>
      <Box display="flex" gap={0.5} flexWrap="wrap" my={1}>
        {job.skills?.slice(0, 3).map((skill, i) => (
          <Chip
            key={i}
            label={skill}
            size="small"
            variant="outlined"
            sx={{ fontSize: "0.7rem" }}
          />
        ))}
      </Box>
      <Button
        component={Link}
        href={`/jobs/${job._id}`}
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mt: 1 }}
      >
        View Details
      </Button>
    </Paper>
  );
};

const ChatbotMessages = forwardRef<HTMLDivElement>((props, ref) => {
  const { messages, addMessage } = useChat();

  // Handle option button click
  const handleOptionClick = (option: string) => {
    addMessage({ type: "user", text: option });
  };

  return (
    <Box
      ref={ref}
      sx={{
        flex: 1,
        overflowY: "auto",
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {messages.map((message, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: message.type === "user" ? "flex-end" : "flex-start",
            maxWidth: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
            }}
          >
            {message.type === "bot" && (
              <BotIcon color="primary" fontSize="small" sx={{ mt: 0.5 }} />
            )}
            <Box
              sx={{
                bgcolor: message.type === "user" ? "primary.main" : "grey.100",
                color: message.type === "user" ? "white" : "text.primary",
                borderRadius: 2,
                p: 1.5,
                maxWidth: "80%",
              }}
            >
              <Typography variant="body2">{message.text}</Typography>
            </Box>
            {message.type === "user" && (
              <UserIcon color="primary" fontSize="small" sx={{ mt: 0.5 }} />
            )}
          </Box>

          {/* Options for bot messages */}
          {message.type === "bot" && message.options && (
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                mt: 1,
                ml: 4,
              }}
            >
              {message.options.map((option, i) => (
                <Button
                  key={i}
                  variant="outlined"
                  size="small"
                  sx={{ mt: 0.5 }}
                  onClick={() => handleOptionClick(option)}
                >
                  {option}
                </Button>
              ))}
            </Box>
          )}

          {/* Job recommendations */}
          {message.type === "bot" && message.jobs && (
            <Box sx={{ mt: 1, ml: 4, width: "95%" }}>
              {message.jobs.map((job, i) => (
                <JobRecommendation key={i} job={job} />
              ))}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
});

export default ChatbotMessages;
