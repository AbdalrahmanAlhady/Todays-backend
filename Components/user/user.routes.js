import { Router } from "express";
import {
  acceptFriendRequest,
  sendFriendRequest,
  unfriend,
} from "./user.controller.js";

const router = new Router();

router.post("/sendFriendRequest", sendFriendRequest);
router.post("/acceptFriendRequest", acceptFriendRequest);

router.delete("/unfriend", unfriend);

export default router;