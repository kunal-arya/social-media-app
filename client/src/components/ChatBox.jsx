import { useTheme } from "@emotion/react";
import {
  Box,
  Button,
  IconButton,
  InputBase,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../utils/baseUrl";
import UserImage from "./UserImage";
import { format } from "timeago.js";
import AddIcon from "@mui/icons-material/Add";
import SendIcon from "@mui/icons-material/Send";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import FlexBetween from "./flexBetween";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";

const ChatBox = ({ chat, currentUserId, setSendMessage, receivedMessage }) => {
  const [userData, setUserData] = useState(null);
  const [messages, setMessages] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [isEmojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const { palette } = useTheme();
  const fullName = userData && `${userData.firstName} ${userData.lastName}`;
  const userId = chat?.members?.find((id) => id !== currentUserId);
  const token = useSelector((state) => state.token);
  const isDark = useSelector((state) => state.mode) === "dark";
  const isNonMobileScreen = useMediaQuery("(min-width: 1000px)");

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

  async function sendClickHandler(e) {
    e.preventDefault();

    const message = {
      senderId: currentUserId,
      text: newMessage,
      chatId: chat._id,
    };

    // send message to socket server
    const receiverId = chat.members.find((id) => id !== currentUserId);
    setSendMessage({ ...message, receiverId });

    // send message to database
    try {
      const response = await fetch(`${BASE_URL}/message/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      const data = await response.json();
      setMessages([...messages, data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  }

  // fetching data for header
  useEffect(() => {
    getUserData();
  }, [chat, currentUserId]);

  useEffect(() => {
    if (chat !== null) {
      fetchMessages();
    }
  }, [chat]);

  useEffect(() => {
    if (receivedMessage !== null && receivedMessage.chatId === chat._id) {
      setMessages([...messages, receivedMessage]);
    }
  }, [receivedMessage]);

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
          maxHeight: isNonMobileScreen ? "80vh" : "60vh",
          height: "100%",
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
                margin: isNonMobileScreen ? "0.5rem auto" : "auto",
              }}
            />

            {/* ChatBox */}
            <Box
              sx={{
                maxHeight: isNonMobileScreen ? "60vh" : "40vh",
                height: "100%",
                overflowY: "auto",
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
                        minWidth: "fit-content",
                        marginRight: "1rem",
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
                justifyContent: "space-between",
                gap: "1rem",
                position: "relative",
              }}
            >
              <FlexBetween
                backgroundColor={`${palette.neutral.light}`}
                borderRadius="9px"
                gap="3rem"
                padding="0.1rem 1.5rem"
                sx={{
                  position: "relative",
                  flex: "1",
                }}
              >
                <IconButton
                  sx={{
                    position: "absolute",
                    left: "5px",
                  }}
                >
                  <AddIcon />
                </IconButton>
                <InputBase
                  fullWidth
                  sx={{
                    margin: "0 15px",
                  }}
                  placeholder="Message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <IconButton
                  sx={{
                    position: "absolute",
                    right: "5px",
                  }}
                  onClick={() => {
                    setEmojiPickerVisible(!isEmojiPickerVisible);
                    console.log("clicked");
                  }}
                >
                  <InsertEmoticonIcon />
                </IconButton>
              </FlexBetween>
              <IconButton
                sx={{
                  borderRadius: "10px",
                  backgroundColor: `${palette.primary.main}`,
                }}
                variant="contained"
                onClick={sendClickHandler}
              >
                <SendIcon />
              </IconButton>
              {isEmojiPickerVisible && (
                <Box position="absolute" bottom="2.5rem" right="0">
                  <Picker
                    data={data}
                    previewPosition="bottom"
                    onEmojiSelect={(e) => {
                      setNewMessage((msg) => msg + e.native);
                      setEmojiPickerVisible(!isEmojiPickerVisible);
                    }}
                    perLine={8}
                  />
                </Box>
              )}
            </Box>
          </>
        ) : (
          <Typography
            variant="h4"
            sx={{
              fontSize: "1.5rem",
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
