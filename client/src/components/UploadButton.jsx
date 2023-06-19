import { useTheme } from "@emotion/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCoverPicturePath, setPicturePath } from "../state";
import { Button, IconButton, useMediaQuery } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import { BASE_URL } from "../utils/baseUrl";

const UploadButton = ({
  user,
  isIconButton = false,
  isCoverImgBtn = false,
  isCoverProfileBtn = false,
}) => {
  const { _id } = user;
  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const primaryMain = palette.primary.main;
  const isNonMobileScreens = useMediaQuery("(min-width: 600px)");

  function handleImageUpload(e) {
    setProfilePic(e.target.files[0]);
  }

  function handleCoverImageUpload(e) {
    setCoverPic(e.target.files[0]);
  }

  async function changeProfilePic() {
    if (!profilePic) {
      return;
    }

    // making a formData and appending the profilePic in it so that multer can store our image in the backend
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

  async function changeCoverPicture() {
    if (!coverPic) {
      return;
    }

    // creating and storing coverPic in it so that multer can store the image in the backend
    const formData = new FormData();
    formData.append("picture", coverPic);

    const response = await fetch(
      `${BASE_URL}/users/${_id}/${coverPic.name}/changeCover`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      }
    );

    const data = await response.json();
    dispatch(setCoverPicturePath({ user: data.user }));
  }

  useEffect(() => {
    changeProfilePic();
  }, [profilePic]);

  useEffect(() => {
    changeCoverPicture();
  }, [coverPic]);

  return (
    <>
      {isIconButton ? (
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="label"
          sx={{
            position: "absolute",
            right: "0px",
            bottom: isNonMobileScreens ? "40px" : "10px",
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
        <>
          {isCoverImgBtn ? (
            <>
              {isCoverProfileBtn ? (
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: `${palette.neutral.main}`,
                    textTransform: "capitalize",
                    position: "absolute",
                    top: isNonMobileScreens ? "none" : "10px",
                    bottom: isNonMobileScreens ? "0" : "none",
                    right: "20px",
                  }}
                  component="label"
                  onChange={handleCoverImageUpload}
                >
                  Upload Cover Image
                  <input hidden accept="image/*" type="file" />
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: `${palette.neutral.main}`,
                    color: `${palette.neutral.main}`,
                    textTransform: "capitalize",
                  }}
                  component="label"
                  onChange={handleCoverImageUpload}
                >
                  Upload Cover Image
                  <input hidden accept="image/*" type="file" />
                </Button>
              )}
            </>
          ) : (
            <Button
              variant="contained"
              sx={{
                backgroundColor: { primaryMain },
                textTransform: "capitalize",
              }}
              component="label"
              onChange={handleImageUpload}
            >
              Upload Profile Image
              <input hidden accept="image/*" type="file" />
            </Button>
          )}
        </>
      )}
    </>
  );
};

export default UploadButton;
