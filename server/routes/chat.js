import express from "express";
import { createChat, findChat, userChats } from "../controllers/chat.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", verifyToken, createChat);
router.get("/:userId", verifyToken, userChats);
router.get("/find/:firstId/:secondId", verifyToken, findChat);

export default router;
