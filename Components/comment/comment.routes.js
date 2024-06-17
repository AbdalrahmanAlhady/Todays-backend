import { Router } from "express";
import { createComment, deleteComment, getComments, updateComment } from "./comment.controller.js";

const router = new Router()

router.post("/",createComment);

router.get("/post/:post_id",getComments);

router.route("/:id")
    .patch(updateComment)  
    .delete(deleteComment);

export default router;