import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/baseUrl";
import UserImage from "./UserImage";
import { format } from "timeago.js";
import InputEmoji from "react-input-emoji";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";

const ChatBox = ({ chat, currentUserId }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const { palette } = useTheme();
  const fullName = userData && `${userData.firstName} ${userData.lastName}`;
  const userId = chat?.members?.find((id) => id !== currentUserId);
  const token = useSelector((state) => state.token);
  const isDark = useSelector((state) => state.mode) === "dark";
  const isNonMobileScreen = useMediaQuery("min-width: 600px");

  console.log(EmojiPicker);

  const getUserData = async () => {
    try {
      if (!userId) {
        return;
      }
      const response = await fetch(`${BASE_URL}/users/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      setUserData(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${BASE_URL}/message/${chat._id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setMessages(data);
    } catch (err) {
      console.log(err);
    }
  };
  // fetching data for header
  useEffect(() => {
    getUserData();
  }, [chat, currentUserId]);

  useEffect(() => {
    if (chat !== null) {
      fetchMessages();
    }
  }, [chat]);

  const handleChange = (message) => {
    setNewMessage(message);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          background: `${palette.background.alt}`,
          borderRadius: "1rem",
          padding: "1rem",
          height: "auto",
          minHeight: "80vh",
          overflow: "auto",
        }}
      >
        {chat ? (
          <>
            <Button
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <UserImage image={userData?.picturePath} size="50px" />
              <Typography
                sx={{
                  textTransform: "capitalize",
                  color: `${palette.neutral.main}`,
                }}
              >
                {fullName}
              </Typography>
            </Button>
            <Box
              sx={{
                height: "2px",
                width: "100%",
                background: `${palette.neutral.light}`,
                margin: "0.5rem auto",
              }}
            />

            {/* ChatBox */}
            <Box
              sx={{
                height: "100%",
                overflow: "auto",
                maxHeight: "inherit",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {messages?.map((message) => (
                <>
                  {message.senderId === currentUserId ? (
                    <Box
                      sx={{
                        height: "content",
                        width: "30%",
                        backgroundColor: `${palette.primary.main}`,
                        color: `black`,
                        borderRadius: "10px",
                        padding: "1rem",
                        position: "relative",
                        alignSelf: "flex-end",
                        width: "fit-content",
                      }}
                    >
                      <Typography sx={{ gridArea: "message" }}>
                        {message.text}
                      </Typography>
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: "2px",
                          right: "10px",
                        }}
                      >
                        <Typography
                          sx={{ gridArea: "time", fontSize: "0.5rem" }}
                        >
                          {format(message.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        height: "content",
                        width: "30%",
                        backgroundColor: `${palette.primary.light}`,
                        color: `${palette.primary.dark}`,
                        borderRadius: "10px",
                        padding: "1rem",
                        position: "relative",
                        alignSelf: "flex-start",
                        minWidth: "fit-content",
                      }}
                    >
                      <Typography sx={{ gridArea: "message" }}>
                        {message.text}
                      </Typography>
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: "2px",
                          right: "10px",
                        }}
                      >
                        <Typography
                          sx={{ gridArea: "time", fontSize: "0.5rem" }}
                        >
                          {format(message.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </>
              ))}
            </Box>

            {/* Chat Sender */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconButton
                sx={{
                  backgroundColor: `${palette.primary.main}`,
                }}
              >
                <AddIcon />
              </IconButton>
              <InputEmoji
                theme={isDark ? "dark" : "light"}
                value={newMessage}
                onChange={handleChange}
                cleanOnEnter
                borderColor={`${palette.neutral.dark}`}
              />
              <Button
                sx={{
                  borderRadius: "10px",
                  backgroundColor: `${palette.primary.main}`,
                }}
                variant="contained"
                endIcon={<SendIcon />}
              >
                Send
              </Button>
              {/* <EmojiPicker /> */}
            </Box>
          </>
        ) : (
          <Typography
            variant="h2"
            sx={{
              fontSize: "4rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: `${palette.neutral.light}`,
            }}
          >
            Tap on chat to start Conversation...
          </Typography>
        )}
      </Box>
    </>
  );
};

export default ChatBox;
