import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config({ path: "./config/config.env" });
const { MONGO_URI } = process.env;

const connectDB = () => {
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected to database");
    })
    .catch((error) => {
      console.log("database connection failed.");
      console.error(error);
    });
};
export default connectDB;