import { Router } from "express";
import {
  acceptFriendRequest,
  getUser,
  sendFriendRequest,
  unfriend,
} from "./user.controller.js";

const router = new Router();

router.post("/sendFriendRequest", sendFriendRequest);
router.post("/acceptFriendRequest", acceptFriendRequest);
router.get('/:id?',getUser)

router.delete("/unfriend", unfriend);

export default router;