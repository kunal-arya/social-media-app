import { useTheme } from "@emotion/react";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { BASE_URL } from "../../utils/baseUrl";
import FlexBetween from "../../components/flexBetween";
import { useNavigate } from "react-router-dom";
import UploadButton from "../../components/UploadButton";
import { useDispatch, useSelector } from "react-redux";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SendIcon from "@mui/icons-material/Send";
import { setFriends, setProfileUserFriends } from "../../state";

const ProfileDashboard = ({ user }) => {
  const { palette } = useTheme();
  const backgroundColor = palette.background.alt;
  const dark = palette.neutral.dark;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedInUserID = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 600px)");
  const isLoggedInUser = user._id === loggedInUserID;
  const isFriend = Boolean(
    user.friends.find((friend) => friend._id === loggedInUserID)
  );

  const patchFriend = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/users/${loggedInUserID}/${user._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      dispatch(setFriends({ friends: data.userFriends }));
      dispatch(setProfileUserFriends({ friends: data.friendFriends }));
      messageBtnClickHandler({ type: "add Friend" });
    } catch (err) {
      console.log(err);
    }
  };

  const messageBtnClickHandler = async (e) => {
    try {
      const chatBody = {
        senderId: loggedInUserID,
        receiverId: user._id,
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
      console.log(data);
      if (e.type === "click") {
        navigate("/chat");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Box
      maxWidth="60rem"
      height="30rem"
      margin="auto"
      backgroundColor={backgroundColor}
      borderRadius={"0 0 10px 10px"}
      sx={{
        display: "grid",
        gridTemplateColumns: "170px 1fr",
        gridTemplateRows: "60% 40%",
        gridTemplateAreas: `
        "cover cover"
        "picture info"
        `,
      }}
    >
      <Box
        sx={{
          gridArea: "cover",
          position: "relative",
        }}
      >
        <img
          width="100%"
          height="112%"
          style={{
            objectFit: "cover",
          }}
          src={
            user.coverPicturePath
              ? `${BASE_URL}/assets/${user.coverPicturePath}`
              : `${BASE_URL}/assets/default-cover-image.jpg`
          }
        />
        {isLoggedInUser && (
          <UploadButton user={user} isCoverImgBtn isCoverProfileBtn />
        )}
      </Box>
      <Box
        sx={{
          gridArea: "picture",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Box width="150px" height="150px">
          <img
            style={{
              objectFit: "cover",
              borderRadius: "50%",
              borderColor: `${backgroundColor}`,
              boxShadow: "0px 0px 10px rgba(0,0,0,0.4)",
            }}
            width="100%"
            height="100%"
            border="5px solid"
            src={`${BASE_URL}/assets/${user.picturePath}`}
          />
        </Box>
        {isLoggedInUser && <UploadButton isIconButton user={user} />}
      </Box>
      <Box
        sx={{
          gridArea: "info",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          flexDirection: "column",
          paddingLeft: "1rem",
          paddingTop: "2rem",
        }}
      >
        <Typography variant="h2" fontWeight="bold" mb="1rem">
          {user.firstName} {user.lastName}
        </Typography>
        {isLoggedInUser ? (
          <Button
            variant="outlined"
            sx={{ borderColor: `${dark}`, color: `${dark}` }}
            onClick={() => navigate(`/profile/edit/${user._id}`)}
          >
            <FlexBetween gap="0.25rem">
              <EditIcon />
              <Typography sx={{ textTransform: "capitalize" }}>
                Edit Profile
              </Typography>
            </FlexBetween>
          </Button>
        ) : (
          <>
            {!isFriend ? (
              <Button
                variant="contained"
                sx={{ borderColor: `${dark}` }}
                onClick={() => patchFriend()}
              >
                <FlexBetween gap="0.25rem">
                  <PersonAddIcon />
                  <Typography sx={{ textTransform: "capitalize" }}>
                    Add Friend
                  </Typography>
                </FlexBetween>
              </Button>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="outlined"
                  sx={{ borderColor: `${dark}`, color: `${dark}` }}
                  onClick={() => patchFriend()}
                >
                  <FlexBetween gap="0.25rem">
                    <PersonRemoveIcon />
                    <Typography sx={{ textTransform: "capitalize" }}>
                      Remove Friend
                    </Typography>
                  </FlexBetween>
                </Button>
                <Button
                  onClick={messageBtnClickHandler}
                  variant="contained"
                  endIcon={<SendIcon />}
                >
                  {isNonMobileScreens ? "Send Message" : "Send"}
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default ProfileDashboard;
