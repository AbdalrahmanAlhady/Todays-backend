import { Router } from "express";
import { likePost, isLikedPost, unlikePost } from "./postLikes.controller.js";

const router = new Router();

router.route("/user/:user_id/post/:post_id")
    .post(likePost)      
    .get(isLikedPost)  
    .delete(unlikePost);

export default router;
