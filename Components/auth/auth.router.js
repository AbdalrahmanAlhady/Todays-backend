import { forgetPassword, sendOTPCode, signin, signup } from "./auth.controller.js";
import { Router } from "express";
const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/sendOTP", sendOTPCode);
router.post("/forgetPassword", forgetPassword);

export default router;
