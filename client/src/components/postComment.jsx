import { useTheme } from "@emotion/react";
import UserImage from "./UserImage";
import FlexBetween from "./flexBetween";
import SendIcon from "@mui/icons-material/Send";
import { IconButton, InputBase } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { BASE_URL } from "../utils/baseUrl";
import { setPost } from "../state";

function PostComment({ postId }) {
  const [comment, setComment] = useState("");
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const neutralLight = palette.neutral.light;
  const { _id, picturePath } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);

  async function postComment() {
    try {
      const commentObj = {
        comment: comment,
        userId: _id,
      };

      const response = await fetch(`${BASE_URL}/posts/${postId}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // set content type to JSON
        },

        body: JSON.stringify(commentObj),
      });

      const post = await response.json();
      dispatch(setPost({ post }));
      setComment("");
    } catch (err) {
      console.err(err.message);
    }
  }

  return (
    <FlexBetween m="1rem 0">
      <UserImage image={picturePath} size="35px" />
      <FlexBetween
        backgroundColor={neutralLight}
        borderRadius="20px"
        gap="3rem"
        padding="0.25rem 1.5rem"
        width="100%"
        ml="0.5rem"
        sx={{
          position: "relative",
        }}
      >
        <InputBase
          placeholder="Write a comment..."
          fullWidth
          onChange={(e) => setComment(e.target.value)}
          value={comment}
        />
        <IconButton
          sx={{
            position: "absolute",
            right: "0",
          }}
          disabled={!comment}
          onClick={postComment}
        >
          <SendIcon />
        </IconButton>
      </FlexBetween>
    </FlexBetween>
  );
}

export default PostComment;
