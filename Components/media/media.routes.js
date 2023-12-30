import { Router } from "express";
import { storePostImgsUrls } from "./media.controller.js";
const router = new Router();

router.post("/storePostImgsUrls", storePostImgsUrls);

export default router;
