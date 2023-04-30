import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  deletePost,
  postComment,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */

router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

/* DELETE */
router.delete("/:postId/:userId/delete", verifyToken, deletePost);

/* POST COMMENT */
router.post("/:postId/comment", verifyToken, postComment);

export default router;
