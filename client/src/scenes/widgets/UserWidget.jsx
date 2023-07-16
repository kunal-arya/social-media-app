import {
  ManageAccountsOutlined,
  EditOutlined,
  LocationOnOutlined,
  WorkOutlineOutlined,
} from "@mui/icons-material";
import {
  Box,
  Typography,
  Divider,
  useTheme,
  Link,
  Button,
} from "@mui/material";
import UserImage from "../../components/UserImage";
import FlexBetween from "../../components/flexBetween";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../utils/baseUrl";
import { setFriends, setProfileUserFriends } from "../../state";

const UserWidget = ({ userId, picturePath, isProfilePage = false }) => {
  const [user, setUser] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const loggedinUser = useSelector((state) => state.user._id);
  const isLoggedInUser = user && user._id === loggedinUser;
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  const getUser = async () => {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
  };

  useEffect(() => {
    getUser();
  }, []); // esLint-disable-line react-hooks/exhausted-deps

  const getFriends = async () => {
    const response = await fetch(`${BASE_URL}/users/${userId}/friends`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    dispatch(setFriends({ friends: data }));
  };

  useEffect(() => {
    if (typeof friends[0] !== "object" && friends.length !== 0) {
      getFriends();
    }
  }, [friends]);

  if (!user) {
    return null;
  }

  const {
    firstName,
    lastName,
    location,
    occupation,
    viewedProfile,
    impressions,
  } = user;

  return (
    <WidgetWrapper>
      {/* First ROW */}
      {!isProfilePage && (
        <>
          <FlexBetween gap="0.5rem" pb="1.1rem">
            <FlexBetween gap="1rem">
              <UserImage image={picturePath} />
              <Box>
                <Typography
                  variant="h4"
                  color={dark}
                  fontWeight="500"
                  sx={{
                    "&:hover": {
                      color: palette.neutral.medium,
                      cursor: "pointer",
                    },
                  }}
                  onClick={() => navigate(`/profile/${userId}`)}
                >
                  {firstName} {lastName}
                </Typography>
                <Typography color={medium}>
                  {friends.length} {friends.length < 2 ? "friend" : "friends"}
                </Typography>
              </Box>
            </FlexBetween>
            <Box
              onClick={() => navigate(`/profile/edit/${userId}`)}
              sx={{
                "&:hover": {
                  color: palette.neutral.medium,
                  cursor: "pointer",
                },
              }}
            >
              <ManageAccountsOutlined />
            </Box>
          </FlexBetween>
          <Divider />
        </>
      )}

      {/* SECOND ROW */}
      <Box p="1rem 0">
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <LocationOnOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap="1rem" mb="0.5rem">
          <WorkOutlineOutlined fontSize="large" sx={{ color: main }} />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box p="1rem 0">
        <FlexBetween mb="0.5rem">
          <Typography color={medium}>Who's viewed your profile</Typography>
          <Typography color={main} fontWeight="500">
            {viewedProfile}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography color={main} fontWeight="500">
            {impressions}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* FOURTH ROW */}
      <Box p="1rem 0">
        <Typography fontSize="1rem" color={main} fontWeight="500" mb="1rem">
          Social Profiles
        </Typography>
        <FlexBetween gap="1rem " mb="0.5rem">
          <FlexBetween gap="1rem">
            {user.twitterProfile ? (
              <Link
                underline="none"
                href={`${user.twitterProfile}`}
                target="_blank"
                rel="noopener"
              >
                <img src="../assets/twitter.png" alt="twitter" />
              </Link>
            ) : (
              <img src="../assets/twitter.png" alt="twitter" />
            )}

            <Box>
              {user.twitterProfile ? (
                <Link
                  underline="hover"
                  href={`${user.twitterProfile}`}
                  aria-label="twitter Profile link"
                  target="_blank"
                  rel="noopener"
                >
                  <Typography color={main} fontWeight="500">
                    Twitter
                  </Typography>
                </Link>
              ) : (
                <Typography color={main} fontWeight="500">
                  Twitter
                </Typography>
              )}

              <Typography color={medium}>Social Network</Typography>
            </Box>
          </FlexBetween>
          {isLoggedInUser && (
            <Button onClick={() => navigate(`/profile/edit/${userId}`)}>
              <EditOutlined sx={{ color: main }} />
            </Button>
          )}
        </FlexBetween>

        <FlexBetween gap="1rem " mb="0.5rem">
          <FlexBetween gap="1rem">
            {user.linkedinProfile ? (
              <Link
                underline="none"
                href={`${user.linkedinProfile}`}
                target="_blank"
                rel="noopener"
              >
                <img src="../assets/linkedin.png" alt="linkedin" />
              </Link>
            ) : (
              <img src="../assets/linkedin.png" alt="linkedin" />
            )}

            <Box>
              {user.linkedinProfile ? (
                <Link
                  underline="hover"
                  href={`${user.linkedinProfile}`}
                  aria-label="linkedin Profile link"
                  target="_blank"
                  rel="noopener"
                >
                  <Typography color={main} fontWeight="500">
                    Linkedin
                  </Typography>
                </Link>
              ) : (
                <Typography color={main} fontWeight="500">
                  Linkedin
                </Typography>
              )}

              <Typography color={medium}>Network Platform</Typography>
            </Box>
          </FlexBetween>
          {isLoggedInUser && (
            <Button onClick={() => navigate(`/profile/edit/${userId}`)}>
              <EditOutlined sx={{ color: main }} />
            </Button>
          )}
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
