import { Router } from "express";
import { createPost,deletePost,getPosts,updatePost } from "./post.controller.js";

const router = new Router();

router.post("/", createPost);

router.get("/:id?",getPosts)

router.route("/:id")
  .patch(updatePost)
  .delete(deletePost);

export default router;
