import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Navbar from "../navbar";
import FriendListWidget from "../widgets/FriendListWidget";
import MyPostWidget from "../widgets/MyPostWidget";
import PostsWidget from "../widgets/PostsWidget";
import UserWidget from "../widgets/UserWidget";
import { BASE_URL } from "../../utils/baseUrl";
import ProfileDashboard from "../widgets/ProfileDashboardWidget";
import { setProfileUser } from "../../state";

const ProfilePage = () => {
  const user = useSelector((state) => state.profileUser);
  const dispatch = useDispatch();
  const { userId } = useParams();
  const token = useSelector((state) => state.token);
  const isNonMobileScreen = useMediaQuery("(min-width: 1000px)");

  const getUser = async () => {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = await response.json();
    delete user.password;
    delete user.email;
    dispatch(setProfileUser(user));
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

  return (
    <Box>
      <Navbar />
      <ProfileDashboard user={user} />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreen ? "flex" : "block"}
        gap="2rem"
        justifyContent="center"
      >
        <Box flexBasis={isNonMobileScreen ? "26%" : undefined}>
          <UserWidget
            userId={userId}
            picturePath={user.picturePath}
            isProfilePage={true}
          />
          <Box m="2rem 0" />
          <FriendListWidget userId={userId} isProfile />
        </Box>
        <Box flexBasis={isNonMobileScreen ? "42%" : undefined} m="0">
          <PostsWidget userId={userId} isProfile />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
