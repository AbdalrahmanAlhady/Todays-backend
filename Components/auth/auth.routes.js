import { forgetOrResetPassword,  refreshAccessToken,  sendOTPCode, signin, signup, verifyEmail } from "./auth.controller.js";
import { Router } from "express";
const router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/refreshToken", refreshAccessToken);
router.post("/sendOTP", sendOTPCode);
router.post("/changePassword", forgetOrResetPassword);
router.post("/verify-email", verifyEmail);
export default router;
