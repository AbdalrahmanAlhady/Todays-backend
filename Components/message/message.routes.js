import { Router } from "express";
import {
  sendMessage,
  getMessagesOfConversation,
  updateMessage,
  deleteMessage,
  countMessagesOfConversation,
} from "./message.controller.js";

const router = new Router();

router.post("/", sendMessage);

router.get("/conversation/:conversation_id", getMessagesOfConversation);
router.get("/count/conversation/:conversation_id", countMessagesOfConversation);

router.route("/:id")
  .patch(updateMessage)
  .delete(deleteMessage);

export default router;
