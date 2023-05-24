import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/baseUrl";
import { useSelector } from "react-redux";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import UserImage from "./UserImage";
import { useTheme } from "@emotion/react";

const OnlineIcon = () => {
  return (
    <Box
      sx={{
        height: "13px",
        width: "13px",
        position: "absolute",
        backgroundColor: "#FFBF00",
        borderRadius: "50%",
        top: "2px",
        right: "2px",
      }}
    ></Box>
  );
};

const Conversation = ({ data, currentUserId }) => {
  // storing the state for the user to which logged in user is chatting
  const [userData, setUserData] = useState(null);

  // userId to which we loggedIn user is chatting
  const userId = data?.members?.find((id) => id !== currentUserId);
  const token = useSelector((state) => state.token);
  const fullName = userData && `${userData.firstName} ${userData.lastName}`;
  const { palette } = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");

  const getUserData = async () => {
    try {
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

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <>
      {isNonMobileScreens ? (
        // Desktop Version

        <>
          <Button
            sx={{
              display: "grid",
              gridTemplateColumns: `1fr 4fr`,
              gridTemplateAreas: `"pic name" 
            "pic status"`,
              gap: "0 1rem",
            }}
          >
            <Box sx={{ gridArea: "pic", position: "relative" }}>
              <UserImage image={userData?.picturePath} />
              <OnlineIcon />
            </Box>

            <Typography
              sx={{
                gridArea: "name",
                color: `${palette.neutral.main}`,
                textTransform: "capitalize",
              }}
              variant="h5"
            >
              {fullName}
            </Typography>
            <Typography
              sx={{
                gridArea: "status",
                color: `${palette.neutral.medium}`,
                fontWeight: "100",
                textTransform: "capitalize",
              }}
              variant="p"
            >
              online
            </Typography>
          </Button>
          <Box
            sx={{
              height: "1px",
              width: "60%",
              background: `${palette.neutral.light}`,
              margin: "1rem auto",
            }}
          />
        </>
      ) : (
        // Mobile Version
        <Button
          sx={{
            display: "grid",
            gridTemplateColumns: `1fr`,
            gap: "0 1rem",
            margin: "auto",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <UserImage image={userData?.picturePath} size="40px" />
            <OnlineIcon />
          </Box>
        </Button>
      )}
    </>
  );
};

export default Conversation;
