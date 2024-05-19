import { Router } from "express";
import {
  acceptFriendRequest,
  getUser,
  sendFriendRequest,
  checkFriendship,
  unfriendOrDeclineFriendRequest
} from "./user.controller.js";

const router = new Router();

router.post("/sendFriendRequest", sendFriendRequest);

router.patch("/acceptFriendRequest", acceptFriendRequest);

router.get('/checkFriendship',checkFriendship);
router.get('/:id?',getUser);

router.delete("/unfriendOrDeclineFriendRequest", unfriendOrDeclineFriendRequest);

export default router;