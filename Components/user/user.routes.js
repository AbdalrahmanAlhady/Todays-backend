import { Router } from "express";
import {
  getUser,
} from "./user.controller.js";

const router = new Router();

router.get('/:id',getUser);

export default router;