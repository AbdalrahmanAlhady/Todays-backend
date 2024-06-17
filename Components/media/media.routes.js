import { Router } from "express";
import { deleteMedia, storeMedia } from "./media.controller.js";
const router = new Router();

router.post("/", storeMedia);

router.delete("/:id", deleteMedia);

export default router;
