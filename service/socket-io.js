import { Server } from "socket.io";
import { httpServer } from "../app.js";
import { getUser } from "../Components/user/user.controller.js";
import User from "../DBs/models/user.model.js";
import Friendship from "../DBs/models/friendship.model.js";
import Notification from "../DBs/models/notification.model.js";

let onlineUsersList = new Map();
let Socket;

export async function connect() {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });
  io.on("connection", async (socket) => {
    Socket = socket;
    socket.on("set-userID", async (user_id) => {
      if (user_id) {
        await addUser(user_id, socket.id, socket);
      }
    });

    socket.on("disconnect", (reason) => {
      socket.disconnect();
      //   deleteUser(userName, socket.id, socket);
    });
  });
}

async function addUser(user_id, socket_id, socket) {
  let user = await User.findByPk(user_id);
  if (!!user) {
    const updatedUser = await User.update(
      { socket_id: socket_id },
      { where: { id: user_id } }
    );
    onlineUsersList.set(user_id, user);
    socket.emit("online-user-list", [...onlineUsersList.values()]);
    socket.broadcast.emit("online-user-list", [...onlineUsersList.values()]);
  }
}

export async function notifyUserBySocket(
  notificationMsg,
  sender_id,
  receiver_id,
  type,
  post_id,
  comment_id,
  friendship_id
) {
  let includables = [
    {
      model: User,
      as: "sender",
      attributes: ["id", "profileImg", "first_name", "last_name"],
    },
  ];
  let sender = await User.findByPk(sender_id);
  let receiver = await User.findByPk(receiver_id);
  notificationMsg =
    type === "friend_post"
      ? `your friend ${sender.first_name} ${sender.last_name} ${notificationMsg}`
      : `${sender.first_name} ${sender.last_name} ${notificationMsg}`;
  let createdNotification = await Notification.create({
    message: notificationMsg,
    sender_id,
    receiver_id,
    type,
    post_id,
    comment_id,
    friendship_id
  });
  let notification = await Notification.findByPk(createdNotification.id, {
    include: includables,
  });
  Socket.broadcast.to(receiver.socket_id).emit("notify", notification);
}

function deleteUser(userName, id, socket) {
  onlineUsersList.delete(userName);
  socket.emit("online-user-list", [...onlineUsersList.keys()]);
  socket.broadcast.emit("online-user-list", [...onlineUsersList.keys()]);
}
