import User from "../../DBs/models/user.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { sendEmail } from "../../service/mail.js";

dotenv.config({ path: "./config/config.env" });
const secret = process.env.SECRET;

export const signup = async (req, res) => {
  try {
    const userData = req.body;
    if (await User.findOne({ where: { email: userData.email } })) {
      res.status(400).json({ message: "this email is already exist" });
      return;
    } else if (await User.findOne({ where: { phone: userData.phone } })) {
      res.status(400).json({ message: "this phone number is already exist" });
      return;
    }
    if (userData.password === userData.cPassword) {
      userData.password = await bcrypt.hash(userData.password, 10);
      let newUser = new User(userData);
      const savedUser = await newUser.save();
      res.status(201).json({ User: savedUser });
    } else {
      res.status(400).json({ message: "password not match confirm-Password" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const signin = async (req, res) => {
  try {
    const userData = req.body;
    const foundUser = await User.findOne({ where: { email: userData.email } });

    if (!foundUser) {
      return res.status(404).json({ message: "Invalid credentials" });
    }

    const passwordMatched = await bcrypt.compare(
      userData.password,
      foundUser.password
    );
    if (!passwordMatched) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const accessToken = jwt.sign(
      { id: foundUser.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { id: foundUser.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    foundUser.online = true;
    await foundUser.save();
    res.json({ user: foundUser, accessToken, refreshToken });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const refreshAccessToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(400).json({ message: "Missing refresh token" });
  }
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }
    const userId = decoded.id;
    const newAccessToken = jwt.sign(
      { id: userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    res.json({ newAccessToken });
  });
};
export const forgetOrResetPassword = async (req, res) => {
  try {
    let { newPassword, cNewPassword, currentPassword, OTP, email } = req.body;
    const foundUser = await User.findOne({ where: { email } });
    let OTPMatch = OTP === foundUser.OTP;
    if (newPassword !== cNewPassword) {
      res
        .status(400)
        .json({ message: "new password don't match confirm-newPassword" });
      //change password
    } else if (currentPassword && newPassword && cNewPassword) {
      let currentPasswordMatchUserPassword = await bcrypt.compare(
        currentPassword,
        foundUser.password
      );
      let newPasswordMatchCurrentPassword = await bcrypt.compare(
        newPassword,
        foundUser.password
      );
      if (
        currentPasswordMatchUserPassword &&
        newPassword === cNewPassword &&
        !newPasswordMatchCurrentPassword
      ) {
        newPassword = await bcrypt.hash(newPassword, 10);
        foundUser.password = newPassword;
        await foundUser.save();
        res.status(200).json({ message: "password changed successfully" });
      }
      if (!currentPasswordMatchUserPassword) {
        res.status(400).json({ message: "incorrect current password " });
      }
      if (newPasswordMatchCurrentPassword) {
        res.status(400).json({
          message: "new password match old password, please choose new one",
        });
      } //forgot password
    } else if (!currentPassword && newPassword && cNewPassword && OTPMatch) {
      newPassword = await bcrypt.hash(newPassword, 10);
      foundUser.password = newPassword;
      await foundUser.save();
      res.status(200).json({ message: "password changed successfully" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const sendOTPCode = async (req, res) => {
  try {
    const userData = req.body;
    const foundUser = await User.findOne({ where: { email: userData.email } });
    let OTP = nanoid();
    if (foundUser) {
      foundUser.OTP = OTP;
      await foundUser.save();
      sendEmail(
        foundUser.email,
        `your verification code is : ${OTP} `,
        "OTP code"
      );
      res.status(200).json({ message: "mail sent" });
    } else {
      res.status(404).json({ message: "credential not found" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const verifyEmail = async (req, res) => {
  try {
    const userData = req.body;
    const foundUser = await User.findOne({ where: { email: userData.email } });
    if (foundUser) {
      if (userData.OTP === foundUser.OTP) {
        foundUser.verified = true;
        await foundUser.save();
        res.status(201).json({ message: "Email Verified" });
      } else {
        res.status(400).json({ message: "wrong OTP" });
      }
    } else {
      res.status(400).json({ message: "wrong credientials" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
