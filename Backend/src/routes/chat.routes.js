import express from "express";
import { protect } from "../middlewares/protect.js";
import {
  getConversationController,
  getSpecificMessages,
  startConversationController,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.post("/startConversation", protect, startConversationController);

/* ---------------- GET USER CONVERSATIONS ---------------- */
router.get("/getConversation", protect, getConversationController);

/* ---------------- GET MESSAGES (SECURED) ---------------- */
router.get("/messages/:conversationId", protect, getSpecificMessages);

export default router;
