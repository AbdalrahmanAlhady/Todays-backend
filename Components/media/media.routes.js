import { Router } from "express";
import { deleteMedia, getMedia, storeMedia } from "./media.controller.js";
const router = new Router();

router.post("/", storeMedia);
router.get("/user/:user_id", getMedia);

router.delete("/:id", deleteMedia);

export default router;
