import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import { Box, Divider, IconButton, Typography, useTheme } from "@mui/material";
import FlexBetween from "../../components/flexBetween";
import Friend from "../../components/Friend";
import WidgetWrapper from "../../components/WidgetWrapper";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "../../state/index";
import { BASE_URL } from "../../utils/baseUrl";
import PostComment from "../../components/postComment";
import Comment from "../../components/comment";
import Skeleton from "@mui/material/Skeleton";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isLoading, setLoading] = useState(true);
  const [isComments, setComments] = useState(false);
  const [loadingSec, setLoadingSec] = useState(0);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const posts = useSelector((state) => state.posts);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`${BASE_URL}/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  async function isImageAvailable(url) {
    try {
      const response = await fetch(url, {
        method: "get",
      });

      if (response.status == 200) {
        if (isLoading) {
          setLoading(false);
        }
      }

      return response.status;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("URL returns 404 Not Found");
      } else {
        console.error("Error occurred while checking URL:", error.message);
      }
    }
  }

  useEffect(() => {
    if (isLoading) {
      const responseStatus = isImageAvailable(
        `${BASE_URL}/assets/${picturePath}`
      );

      if (responseStatus !== 200) {
        setLoadingSec((prevSec) => prevSec + 1);
      }
    }
  }, [posts, loadingSec]);

  return (
    <WidgetWrapper mb="2rem">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
        postId={postId}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>

      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Skeleton variant="rectangular" width={500} height={400} />
        </Box>
      ) : (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`${BASE_URL}/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {!isComments && (
        <Box mt="0.5rem">
          <PostComment postId={postId} />
          <Divider />
          {comments.map(
            (
              { firstName, lastName, userPicturePath, comment, userId, _id },
              index
            ) => (
              <Comment
                key={`${firstName} ${index}`}
                firstName={firstName}
                lastName={lastName}
                userPicturePath={userPicturePath}
                comment={comment}
                userId={userId}
                postId={postId}
                commentId={_id}
              />
            )
          )}
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
