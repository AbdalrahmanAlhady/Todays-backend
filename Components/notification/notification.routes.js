import { Router } from "express";
import {getUserNotification, UpdateNotification,} from "./notification.controller.js";
const router = new Router();

router.get("/user/:receiver_id", getUserNotification);

router.patch("/:id",UpdateNotification);

export default router;
