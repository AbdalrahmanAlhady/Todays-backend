import { Router } from "express";
import { createComment, deleteComment, getComments, updateComment } from "./comment.controller.js";

const router = new Router()

router.post("/",createComment);

router.get("/",getComments);

router.put("/:id",updateComment);

router.delete("/:id",deleteComment);

export default router;