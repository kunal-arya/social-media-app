import { useTheme } from "@emotion/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPicturePath, setPosts } from "../state";
import { Button, IconButton } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { BASE_URL } from "../utils/baseUrl";
import { useNavigate } from "react-router-dom";

const UploadButton = ({ user, isIconButton = false }) => {
  const { _id } = user;
  const [profilePic, setProfilePic] = useState(null);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const navigate = useNavigate();
  const primaryMain = palette.primary.main;

  function handleImageUpload(e) {
    setProfilePic(e.target.files[0]);
  }

  async function changeProfilePic() {
    if (!profilePic) {
      return;
    }
    const formData = new FormData();

    formData.append("picture", profilePic);

    const response = await fetch(
      `${BASE_URL}/users/${_id}/${profilePic.name}/changePicture`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    const data = await response.json();

    dispatch(setPicturePath({ user: data.user }));
  }

  useEffect(() => {
    changeProfilePic();
  }, [profilePic]);

  return (
    <>
      {isIconButton ? (
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="label"
          sx={{
            position: "absolute",
            right: "5px",
            bottom: "40px",
            backgroundColor: `${palette.primary.light}`,
            color: `${palette.primary.dark}`,
            boxShadow: "0px 0px 10px rgba(0,0,0,0.4)",
          }}
          onChange={handleImageUpload}
        >
          <input hidden accept="image/*" type="file" />
          <PhotoCamera />
        </IconButton>
      ) : (
        <Button
          variant="contained"
          sx={{ backgroundColor: { primaryMain }, textTransform: "capitalize" }}
          component="label"
          onChange={handleImageUpload}
        >
          Upload New Photo
          <input hidden accept="image/*" type="file" />
        </Button>
      )}
    </>
  );
};

export default UploadButton;
