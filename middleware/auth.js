import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../DBs/models/user.model.js";
dotenv.config({ path: "./config/config.env" });

export const auth = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Access Denied. No tokens provided. " });
    }

    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findOne({ _id: decoded.id });
    if (user) {
      next();
    } else {
      res.status(401).json({ message: "unauthorized" });
    }
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "access token expired" });
    } else {
      res.status(401).json({ message: "unauthorized" });
    }
  }
};
