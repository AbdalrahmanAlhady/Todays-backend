import { Router } from "express";
import { createPost,deletePost,getPostById,getPosts, isLikedPost, likePost, updatePost } from "./post.controller.js";

const router = new Router();

router.post("/", createPost);
router.post("/likePost/:user_id?/:post_id?", likePost);

router.get("/",getPosts)
router.get("/isLikedPost/:user_id?/:post_id?",isLikedPost)
router.get("/:id?",getPostById)

router.put("/:id?",updatePost)

router.delete("/:id?",deletePost)


export default router;