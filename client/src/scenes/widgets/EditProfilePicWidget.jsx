import { Box, Button, Input, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../../utils/baseUrl";
import { useTheme } from "@emotion/react";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect, useState } from "react";
import { setPicturePath, setPosts } from "../../state";
import UploadButton from "../../components/UploadButton";

const EditProfilePicWidget = ({ user }) => {
  const { firstName, lastName, picturePath } = user;
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const primaryMain = palette.primary.main;

  return (
    <WidgetWrapper
      gap="1rem"
      display="flex"
      flexDirection="column"
      alignItems="center"
      minWidth="300px"
    >
      <Typography variant="h2">
        {firstName} {lastName}
      </Typography>
      <Box>
        <img
          style={{ borderRadius: "50%", width: "150px" }}
          src={`${BASE_URL}/assets/${picturePath}`}
        />
      </Box>
      <UploadButton user={user} />
    </WidgetWrapper>
  );
};

export default EditProfilePicWidget;
