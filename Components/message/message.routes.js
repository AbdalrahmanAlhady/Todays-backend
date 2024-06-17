import { Router } from "express";
import {
  sendMessage,
  getMessagesOfConversation,
  updateMessage,
  deleteMessage,
} from "./message.controller.js";

const router = new Router();

router.post("/", sendMessage);

router.get("/conversation/:conversation_id", getMessagesOfConversation);

router.route("/:id")
  .patch(updateMessage)
  .delete(deleteMessage);

export default router;
