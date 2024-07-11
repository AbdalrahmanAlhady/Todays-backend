import { Router } from "express";
import {
  sendFriendRequest,
  checkFriendship,
  deleteFriendRequest,
  updateFriendRequest,
  getFriendships,
} from "./friendship.controller.js";

const router = new Router();

router
  .route("/sender/:sender_id/receiver/:receiver_id")
  .post(sendFriendRequest)
  .patch(updateFriendRequest)
  .get(checkFriendship)
  .delete(deleteFriendRequest);
router.get("/user/:user_id", getFriendships);
export default router;
