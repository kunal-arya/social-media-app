import { Box, Typography, useTheme } from "@mui/material";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends, setProfileUserFriends } from "../../state";
import { BASE_URL } from "../../utils/baseUrl";

const FriendListWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const { friends } = isProfile
    ? useSelector((state) => state.profileUser)
    : useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const { palette } = useTheme();

  const getFriends = async () => {
    const response = await fetch(`${BASE_URL}/users/${userId}/friends`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (isProfile) {
      dispatch(setProfileUserFriends({ friends: data }));
    } else {
      dispatch(setFriends({ friends: data }));
    }
  };

  useEffect(() => {
    /* if the friends array is just a bunch of _ids of friends , we call getFriends() to get all the friends
    based on the _ids but if a users has no friends , typeof friends[0] !== "object" will be true , so this
    will create an infinite loop of fetching data ... thats why , we are alse checking is friends array
    is empty or not */
    if (typeof friends[0] !== "object" && friends.length !== 0) {
      getFriends();
    }
  }, [friends]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper sx={{ marginBottom: "1rem" }}>
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Friend List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {friends.map((friend) => (
          <Friend
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
            isFriendListWidget
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
