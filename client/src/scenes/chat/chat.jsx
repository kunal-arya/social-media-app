import {
  Box,
  Typography,
  imageListClasses,
  useMediaQuery,
} from "@mui/material";
import Navbar from "../navbar";
import { useTheme } from "@emotion/react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { BASE_URL, SOCKET_BASE_URL } from "../../utils/baseUrl";
import Conversation from "../../components/Conversation";
import ChatBox from "../../components/ChatBox";
import io from "socket.io-client";

const Chat = () => {
  const socket = useRef();
  const [chats, setChats] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(null);
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
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
      setChats(data);
    } catch (err) {
      console.log(err);
    }
  };

  // sending message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  useEffect(() => {
    if (chats === null) {
      getChats();
    }
  }, [chats, loggedInUser]);

  useEffect(() => {
    // Establish a connection to the Socket.IO server using the SOCKET_BASE_URL
    socket.current = io(`${SOCKET_BASE_URL}`);

    // Emit a "new-user-add" event to the server, passing the logged-in user's ID
    socket.current.emit("new-user-add", loggedInUser._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [loggedInUser]);

  useEffect(() => {
    socket.current.on("receive-message", (data) => {
      setReceivedMessage(data);
    });
  }, []);

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
            minWidth: "250px",
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
              <div key={chat._id} onClick={() => setCurrentChat(chat)}>
                <Conversation
                  onlineUsers={onlineUsers}
                  data={chat}
                  currentUserId={loggedInUser._id}
                />
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
            <ChatBox
              chat={currentChat}
              currentUserId={loggedInUser._id}
              setSendMessage={setSendMessage}
              receivedMessage={receivedMessage}
            />
          )}
        </Box>
      </Box>
    </>
  );
};

export default Chat;
