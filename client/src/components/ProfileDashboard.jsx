import { useTheme } from "@emotion/react";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Typography } from "@mui/material";
import { BASE_URL } from "../utils/baseUrl";
import FlexBetween from "./flexBetween";

const ProfileDashboard = ({ user }) => {
  const { palette } = useTheme();
  const backgroundColor = palette.background.alt;
  const dark = palette.neutral.dark;

  return (
    <Box
      maxWidth="60rem"
      height="35rem"
      margin="auto"
      backgroundColor={backgroundColor}
      borderRadius={"0 0 10px 10px"}
      sx={{
        display: "grid",
        gridTemplateColumns: "170px 1fr",
        gridTemplateRows: "65% 35%",
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
        }}
      >
        <Box
          width="150px"
          height="150px"
          sx={{ postion: "absolute", right: "10px" }}
        >
          <img
            style={{ objectFit: "cover", borderRadius: "50%" }}
            width="100%"
            height="100%"
            border={`5px solid ${dark}`}
            src={`${BASE_URL}/assets/${user.picturePath}`}
          />
        </Box>
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
        <Button variant="outlined" sx={{ borderColor: `${dark}` }}>
          <FlexBetween
            gap="0.25rem"
            variant="h4"
            color={dark}
            fontWeight="500"
            sx={{
              "&:active": {
                color: palette.neutral.medium,
                cursor: "pointer",
              },
            }}
          >
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
