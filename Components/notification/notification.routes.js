import { Router } from "express";
import {getUserNotification, seenNotification,} from "./notification.controller.js";
const router = new Router();

router.get("/getUserNotification/:receiver_id?", getUserNotification);
router.post("/seenNotification/:receiver_id?/:id?", seenNotification);

export default router;
