import { Router } from "express";
import {
  sendFriendRequest,
  checkFriendship,
  deleteFriendRequest,
  updateFriendRequest
} from "./friendship.controller.js";

const router = new Router();

router.route("/sender/:sender_id/receiver/:receiver_id")
  .post(sendFriendRequest)
  .patch(updateFriendRequest)
  .get(checkFriendship)
  .delete(deleteFriendRequest);

export default router;
