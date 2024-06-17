import { Router } from "express";
import {
  CreateConversation,
  getConversationsOfUser,
  updateConversation,
  deleteConversation,
  getUnseenMessages,
} from "./conversation.controller.js";

const router = new Router();

router.post("/first_user_id/:first_user_id/second_user_id/:second_user_id", CreateConversation);

router.get("/user/:user_id", getConversationsOfUser);
router.get("/:id/unseenMessages/receiver/:receiver_id", getUnseenMessages);

router.route("/:id")
.patch(updateConversation)
.delete(deleteConversation);

export default router;
