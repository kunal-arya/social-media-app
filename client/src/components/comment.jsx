import {
  Box,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import UserImage from "./UserImage";
import { useTheme } from "@emotion/react";
import FlexBetween from "./flexBetween";
import { useNavigate } from "react-router-dom";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useSelector } from "react-redux";
import { useState } from "react";

const Comment = ({ firstName, lastName, userPicturePath, comment, userId }) => {
  const [isDeleteMenuOpen, setDeleteMenuOpen] = useState(null);
  const { palette } = useTheme();
  const neutralLight = palette.neutral.light;
  const primaryDark = palette.primary.dark;
  const navigate = useNavigate();
  const loggedInUserId = useSelector((state) => state.user._id);

  console.log(userPicturePath);
  return (
    <FlexBetween m="1rem 0">
      <UserImage image={userPicturePath} size="35px" />
      <FlexBetween
        ml="0.5rem"
        width="100%"
        backgroundColor={neutralLight}
        borderRadius="8px"
      >
        <Box
          display="flex"
          flexDirection="column"
          m="0.25rem"
          p="0.5rem"
          width="100%"
        >
          <Link
            onClick={() => navigate(`/profile/${userId}`)}
            color={primaryDark}
            fontWeight="bold"
            underline="hover"
            sx={{
              "&:hover": {
                cursor: "pointer",
              },
            }}
          >
            {firstName} {lastName}
          </Link>
          <Typography>{comment}</Typography>
        </Box>
        {loggedInUserId === userId && (
          <>
            <IconButton onClick={(e) => setDeleteMenuOpen(e.currentTarget)}>
              <MoreHorizIcon />
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
              <MenuItem onClick={() => deleteComment()}>
                Delete Comment
              </MenuItem>
            </Menu>
          </>
        )}
      </FlexBetween>
    </FlexBetween>
  );
};

export default Comment;
