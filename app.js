import connectDB from "./DBs/connection.js";
import * as routes from "./Components/index.route.js";
import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { auth } from "./middleware/auth.js";
dotenv.config({ path: "./config/config.env" });

const app = express();
const PORT = process.env.PORT;
connectDB();

app.use(express.json());
app.use(cors());
app.use("/api/v1/auth", routes.authRoutes);
app.use("/api/v1/posts", auth,routes.postRoutes);
app.use("/api/v1/comments", auth,routes.commentRoutes);

app.listen(PORT, (error) => {
  if (!error) console.log("listening on " + PORT);
  else console.log("Error occurred, server can't start", error);
});
