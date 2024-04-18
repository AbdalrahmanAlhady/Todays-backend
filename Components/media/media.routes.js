import { Router } from "express";
import { storeMediaUrls } from "./media.controller.js";
const router = new Router();

router.post("/storeMediaUrls", storeMediaUrls);

export default router;
