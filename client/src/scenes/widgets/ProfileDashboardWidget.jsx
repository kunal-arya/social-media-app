import { useTheme } from "@emotion/react";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { BASE_URL } from "../../utils/baseUrl";
import FlexBetween from "../../components/flexBetween";
import { useNavigate } from "react-router-dom";
import { PhotoCamera } from "@mui/icons-material";
import UploadButton from "../../components/UploadButton";

const ProfileDashboard = ({ user }) => {
  const { palette } = useTheme();
  const backgroundColor = palette.background.alt;
  const dark = palette.neutral.dark;
  const navigate = useNavigate();

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
      <Box sx={{ gridArea: "cover" }}>
        <img
          width="100%"
          height="112%"
          style={{ objectFit: "cover" }}
          src={`${BASE_URL}/assets/pexels-thirdman-5981929.jpg`}
        />
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
        <UploadButton isIconButton={true} user={user} />
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
        <Button
          variant="outlined"
          sx={{ borderColor: `${dark}`, color: `${dark}` }}
          onClick={() => navigate(`/profile/edit/${user.userId}`)}
        >
          <FlexBetween gap="0.25rem">
            <EditIcon />
            <Typography sx={{ textTransform: "capitalize" }}>
              Edit Profile
            </Typography>
          </FlexBetween>
        </Button>
      </Box>
    </Box>
  );
};

export default ProfileDashboard;
