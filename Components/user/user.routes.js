import { Router } from "express";
import { getUser, updateUser } from "./user.controller.js";

const router = new Router();

router.route("/:id").patch(updateUser).get(getUser);

export default router;
