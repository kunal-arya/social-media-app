import { Box, Typography, useMediaQuery } from "@mui/material";
import Navbar from "../navbar";
import { useTheme } from "@emotion/react";
import FlexBetween from "../../components/flexBetween";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL } from "../../utils/baseUrl";
import Conversation from "../../components/Conversation";
import ChatBox from "../../components/ChatBox";

const Chat = () => {
  const [chats, setChats] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const { palette } = useTheme();
  const loggedInUser = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const getChats = async () => {
    try {
      const response = await fetch(`${BASE_URL}/chat/${loggedInUser._id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(data);
      setChats(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (chats === null) {
      getChats();
    }
  }, [chats]);

  return (
    <>
      <Navbar />
      <Box
        sx={{
          position: "relative",
          display: "flex",
          height: "80vh",
          gap: "1rem",
          margin: "1rem",
          flexDirection: !isNonMobileScreens ? "column" : "row",
        }}
      >
        {/* Left Side */}
        <Box
          sx={{
            backgroundColor: `${palette.background.alt}`,
            borderRadius: "1rem",
            padding: "1rem",
            maxHeight: "70vh",
            height: isNonMobileScreens ? "70vh" : "20vh",
            minHeight: "20vh",
            position: "relative",
            overflow: "auto",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: isNonMobileScreens ? "1rem" : "0.25rem",
              fontSize: isNonMobileScreens ? "initial" : "1rem",
            }}
          >
            Chats
          </Typography>
          {!isNonMobileScreens && (
            <Box
              sx={{
                height: "1px",
                width: "60%",
                background: `${palette.neutral.light}`,
                margin: "0.5rem auto",
              }}
            />
          )}

          <Box
            sx={{
              display: "flex",
              flexDirection: isNonMobileScreens ? "column" : "row",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            {chats?.map((chat) => (
              <div onClick={() => setCurrentChat(chat)}>
                <Conversation data={chat} currentUserId={loggedInUser._id} />
              </div>
            ))}
          </Box>
        </Box>

        {/* Right Side */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            flexGrow: "1",
          }}
        >
          {/* Chat BOX */}
          {loggedInUser._id && (
            <ChatBox chat={currentChat} currentUserId={loggedInUser._id} />
          )}
        </Box>
      </Box>
    </>
  );
};

export default Chat;
