import { Router } from "express";
import { createPost,getPosts } from "./post.controller.js";

const router = new Router();

router.post("/", createPost);

router.get("/",getPosts)


export default router;