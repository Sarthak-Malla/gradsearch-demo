import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import api, { Job } from "../services/api";

interface UserPreferences {
  skills: string[];
  location: string;
  experienceLevel: string;
  jobType: string;
}

interface ChatMessage {
  type: "bot" | "user";
  text: string;
  options?: string[];
  jobs?: Job[];
}

interface ChatContextType {
  messages: ChatMessage[];
  preferences: UserPreferences;
  isOpen: boolean;
  addMessage: (message: ChatMessage) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  toggleChat: () => void;
  resetChat: () => void;
  loading: boolean;
}

const defaultPreferences: UserPreferences = {
  skills: [],
  location: "",
  experienceLevel: "Entry Level",
  jobType: "",
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Conversation state management
enum ConversationStage {
  INTRO,
  ASKING_SKILLS,
  ASKING_LOCATION,
  ASKING_JOB_TYPE,
  ASKING_EXPERIENCE,
  RECOMMENDATION,
  FOLLOW_UP,
}

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      type: "bot",
      text: "Hi there! I can help you find job opportunities that match your skills and preferences. Would you like to get started?",
      options: ["Yes, let's get started", "No, maybe later"],
    },
  ]);
  const [preferences, setPreferences] =
    useState<UserPreferences>(defaultPreferences);
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState<ConversationStage>(
    ConversationStage.INTRO
  );
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Job[]>([]);

  // Add a message to the chat
  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);

    // If it's a user message, process it to determine the next bot response
    if (message.type === "user") {
      processUserMessage(message.text);
    }
  };

  // Process user message and determine next response
  const processUserMessage = async (text: string) => {
    switch (stage) {
      case ConversationStage.INTRO:
        if (
          text.toLowerCase().includes("yes") ||
          text.toLowerCase().includes("start")
        ) {
          setStage(ConversationStage.ASKING_SKILLS);
          setTimeout(() => {
            addMessage({
              type: "bot",
              text: "Great! Let's find you some job matches. First, could you tell me what skills you have? (For example: JavaScript, React, Project Management, etc.)",
            });
          }, 500);
        } else {
          setTimeout(() => {
            addMessage({
              type: "bot",
              text: "No problem! Whenever you're ready to find job matches, just open this chat again.",
            });
          }, 500);
        }
        break;

      case ConversationStage.ASKING_SKILLS:
        // Extract skills from user input
        const skillsList = text
          .split(/[,;.]/)
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0);

        // Update preferences with skills
        updatePreferences({ skills: skillsList });

        // Move to next stage
        setStage(ConversationStage.ASKING_LOCATION);
        setTimeout(() => {
          addMessage({
            type: "bot",
            text: `Thanks! I've noted your skills: ${skillsList.join(
              ", "
            )}. Where are you looking for jobs? (e.g., Remote, New York, San Francisco, etc.)`,
            options: ["Remote", "Anywhere", "Not important"],
          });
        }, 500);
        break;

      case ConversationStage.ASKING_LOCATION:
        // Update preferences with location
        updatePreferences({ location: text });

        // Move to next stage
        setStage(ConversationStage.ASKING_JOB_TYPE);
        setTimeout(() => {
          addMessage({
            type: "bot",
            text: "What type of job are you looking for?",
            options: [
              "Full-time",
              "Part-time",
              "Contract",
              "Internship",
              "Any type",
            ],
          });
        }, 500);
        break;

      case ConversationStage.ASKING_JOB_TYPE:
        // Handle "Any type" response
        const jobType = text === "Any type" ? "" : text;

        // Update preferences with job type
        updatePreferences({ jobType });

        // Move to next stage
        setStage(ConversationStage.ASKING_EXPERIENCE);
        setTimeout(() => {
          addMessage({
            type: "bot",
            text: "What level of experience do you have?",
            options: ["Entry Level", "Mid Level", "Senior Level"],
          });
        }, 500);
        break;

      case ConversationStage.ASKING_EXPERIENCE:
        // Update preferences with experience level
        updatePreferences({ experienceLevel: text });

        // Move to recommendation stage
        setStage(ConversationStage.RECOMMENDATION);

        // Show loading message
        setTimeout(() => {
          addMessage({
            type: "bot",
            text: "Thanks for sharing your preferences! Let me find some job recommendations for you...",
          });
        }, 500);

        // Fetch job recommendations based on preferences
        await fetchJobRecommendations();
        break;

      case ConversationStage.RECOMMENDATION:
        // Handle user response after recommendations
        if (
          text.toLowerCase().includes("yes") ||
          text.toLowerCase().includes("more")
        ) {
          // User wants more recommendations or refinement
          setTimeout(() => {
            addMessage({
              type: "bot",
              text: "Would you like to refine your search criteria?",
              options: ["Yes, update preferences", "No, I like these results"],
            });
          }, 500);
          setStage(ConversationStage.FOLLOW_UP);
        } else {
          // User doesn't want more recommendations
          setTimeout(() => {
            addMessage({
              type: "bot",
              text: "Great! Feel free to browse these recommendations. If you want to start a new search later, just click the reset button.",
            });
          }, 500);
        }
        break;

      case ConversationStage.FOLLOW_UP:
        if (
          text.toLowerCase().includes("yes") ||
          text.toLowerCase().includes("update")
        ) {
          // Reset to asking skills
          setStage(ConversationStage.ASKING_SKILLS);
          setTimeout(() => {
            addMessage({
              type: "bot",
              text: "Let's refine your search. What skills are you looking for in a job?",
            });
          }, 500);
        } else {
          // User is satisfied
          setTimeout(() => {
            addMessage({
              type: "bot",
              text: "Great! Feel free to check out the job listings page for more opportunities. If you need help later, I'll be here!",
            });
          }, 500);
        }
        break;

      default:
        // Default fallback response
        setTimeout(() => {
          addMessage({
            type: "bot",
            text: "I'm not sure I understand. Could you try phrasing that differently?",
          });
        }, 500);
        break;
    }
  };

  // Fetch job recommendations based on user preferences
  const fetchJobRecommendations = async () => {
    setLoading(true);
    try {
      // Construct a search query from user preferences
      let searchQuery = "";

      // Add skills to the query
      if (preferences.skills.length > 0) {
        searchQuery += preferences.skills.join(" ");
      }

      // Add experience level
      if (preferences.experienceLevel) {
        searchQuery += ` ${preferences.experienceLevel}`;
      }

      // Add job type if specified
      if (preferences.jobType && preferences.jobType !== "Any type") {
        searchQuery += ` ${preferences.jobType}`;
      }

      // Add location if specified and not general
      if (
        preferences.location &&
        preferences.location !== "Anywhere" &&
        preferences.location !== "Not important"
      ) {
        searchQuery += ` ${preferences.location}`;
      }

      // Perform semantic search using the API
      const response = await api.jobs.semanticSearch(searchQuery, 5);
      setRecommendations(response.data.jobs);

      // Add a message with the recommendations
      setTimeout(() => {
        if (response.data.jobs.length > 0) {
          addMessage({
            type: "bot",
            text: `I found ${response.data.jobs.length} job${
              response.data.jobs.length === 1 ? "" : "s"
            } that match your preferences:`,
            jobs: response.data.jobs,
          });

          // Ask if they want more recommendations
          setTimeout(() => {
            addMessage({
              type: "bot",
              text: "Would you like to see more recommendations?",
              options: ["Yes, show me more", "No, these look good"],
            });
          }, 1000);
        } else {
          // No jobs found
          addMessage({
            type: "bot",
            text: "I couldn't find any jobs matching your exact criteria. Would you like to broaden your search?",
            options: ["Yes, let's try again", "No thanks"],
          });
        }
      }, 1000);
    } catch (error) {
      console.error("Error fetching job recommendations:", error);
      // Handle error
      setTimeout(() => {
        addMessage({
          type: "bot",
          text: "Sorry, I encountered an error while searching for jobs. Please try again later.",
        });
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...prefs }));
  };

  const toggleChat = () => {
    setIsOpen((prev) => !prev);
  };

  const resetChat = () => {
    setMessages([
      {
        type: "bot",
        text: "Hi there! I can help you find job opportunities that match your skills and preferences. Would you like to get started?",
        options: ["Yes, let's get started", "No, maybe later"],
      },
    ]);
    setPreferences(defaultPreferences);
    setStage(ConversationStage.INTRO);
    setRecommendations([]);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        preferences,
        isOpen,
        addMessage,
        updatePreferences,
        toggleChat,
        resetChat,
        loading,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
