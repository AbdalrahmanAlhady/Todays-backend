import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../DBs/models/user.model.js";
dotenv.config({ path: "./config/config.env" });

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({ _id: decoded.id });
    if (user) {
      next();
    } else {
      res.status(401).json({ message: "unauthorized" });
    }
  } catch (error) {
    console.log(error.message)
    res.status(401).json({ message: "unauthorized"});
  }
};
