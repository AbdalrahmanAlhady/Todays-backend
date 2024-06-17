import connectDB from "./DBs/connection.js";
import { sequelizeConnection } from "./DBs/connection.js";
import initRelations from "./DBs/relationships.js";
import * as routes from "./Components/index.route.js";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import http from "http";
import { auth } from "./middleware/auth.js";
import { connect } from "./service/socket-io.js";
import { Server } from "socket.io";
dotenv.config({ path: "./config/config.env" });

const app = express();
const PORT = process.env.PORT;

connectDB();
await initRelations();
await sequelizeConnection
  .sync({})
  .then(() => {
    console.log("table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table  : ", error);
  });
app.use(express.json());
app.use(cors());
app.use("/api/v1/auth", routes.authRoutes);
app.use("/api/v1/users", auth, routes.userRoutes);
app.use("/api/v1/posts", auth, routes.postRoutes);
app.use("/api/v1/comments", auth, routes.commentRoutes);
app.use("/api/v1/media", auth, routes.mediaRoutes);
app.use("/api/v1/notifications", auth, routes.notificationRoutes);
app.use("/api/v1/friendships", auth, routes.friendshipRoutes);
app.use("/api/v1/postLikes", auth, routes.postLikesRoutes);
app.use("/api/v1/conversations", auth, routes.conversationRoutes);
app.use("/api/v1/messages", auth, routes.messageRoutes);

const httpServer = http.createServer(app);
httpServer.listen(PORT, (error) => {
  if (!error) {
    console.log("listening on " + PORT);
    connect();
  } else console.log("Error occurred, server can't start", error);
});
let io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});
export  {io};
