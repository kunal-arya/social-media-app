import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import {
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setFriends, setPosts, setProfileUserFriends } from "../state/index";
import FlexBetween from "./flexBetween";
import UserImage from "./UserImage";
import { BASE_URL } from "../utils/baseUrl";
import { useState } from "react";

const Friend = ({
  friendId,
  name,
  subtitle,
  userPicturePath,
  postId,
  isFriendListWidget = false,
}) => {
  const [isDeleteMenuOpen, setDeleteMenuOpen] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { _id, friends } = useSelector((state) => state.user);
  const currentProfileId = useParams().userId;
  const isProfile = Boolean(currentProfileId);
  const token = useSelector((state) => state.token);
  const isNonMobileScreen = useMediaQuery("(min-width: 1050px)");
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;

  const isFriend = friends.find((friend) => friend._id === friendId);

  // when we post something , we don't want to show add friend to our own post
  const isUserFriendSame = _id === friendId;

  const createChat = async () => {
    try {
      const chatBody = {
        senderId: _id,
        receiverId: friendId,
      };

      const response = await fetch(`${BASE_URL}/chat/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chatBody),
      });

      const data = await response.json();
      console.log(data); // response from the server
    } catch (err) {
      console.log(err);
    }
  };

  const patchFriend = async () => {
    const response = await fetch(`${BASE_URL}/users/${_id}/${friendId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    dispatch(setFriends({ friends: data.userFriends }));
    if (isProfile && currentProfileId === _id) {
      dispatch(setProfileUserFriends({ friends: data.userFriends }));
    } else if (isProfile && currentProfileId === friendId) {
      dispatch(setProfileUserFriends({ friends: data.friendFriends }));
    }
    createChat();
  };

  const deletePost = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/posts/${postId}/${_id}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();
      dispatch(setPosts({ posts: result }));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.neutral.medium,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      {isUserFriendSame ? (
        <>
          {!isFriendListWidget && (
            <Box>
              <IconButton onClick={(e) => setDeleteMenuOpen(e.currentTarget)}>
                {isNonMobileScreen ? (
                  <MoreHorizIcon fontSize="large" />
                ) : (
                  <MoreHorizIcon fontSize="medium" />
                )}
              </IconButton>
              <Menu
                id="delete-menu"
                anchorEl={isDeleteMenuOpen}
                open={Boolean(isDeleteMenuOpen)}
                onClose={() => setDeleteMenuOpen(null)}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={() => deletePost()}>Delete Post</MenuItem>
              </Menu>
            </Box>
          )}
        </>
      ) : (
        <IconButton
          onClick={() => patchFriend()}
          sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
        >
          {isFriend ? (
            <PersonRemoveOutlined sx={{ color: primaryDark }} />
          ) : (
            <PersonAddOutlined sx={{ color: primaryDark }} />
          )}
        </IconButton>
      )}
    </FlexBetween>
  );
};

export default Friend;
