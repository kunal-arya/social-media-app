import React from "react";
import Navbar from "../navbar";
import EditProfilePicWidget from "../widgets/EditProfilePicWidget";
import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import EditProfileWidget from "../widgets/EditProfileWidget";

const EditProfilePage = () => {
  const isNonMobileScreen = useMediaQuery("(min-width: 1000px)");
  const user = useSelector((state) => state.user);
  return (
    <>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={"flex"}
        flexDirection={!isNonMobileScreen && "column"}
        alignItems={isNonMobileScreen && "flex-start"}
        gap="2rem"
        justifyContent="center"
      >
        <EditProfilePicWidget user={user} />
        {/* <EditProfileWidget user={user} /> */}
      </Box>
    </>
  );
};

export default EditProfilePage;
