import { io } from "../app.js";
import { getUser } from "../Components/user/user.controller.js";
import User from "../DBs/models/user.model.js";
import Friendship from "../DBs/models/friendship.model.js";
import Notification from "../DBs/models/notification.model.js";
import { Op } from "sequelize";
import Media from "../DBs/models/media.model.js";

let onlineUserAndHisFriends = new Map();
let Socket;
export async function connect() {
  io.on("connection", async (socket) => {
    let Socket = socket;
    socket.on("set-userID", async (user_id) => {
      if (user_id) {
        await addUser(user_id, socket);
        disconnectUser(socket, user_id);
      }
    });
    socket.on("get-online-friends", async (user_id) => {
      getOnlineFriendsAndNotifyThem(user_id, socket);
    });
  });
}

async function addUser(user_id, socket) {
  const updatedUser = await User.update(
    { socket_id: socket.id, online: true },
    { where: { id: user_id } }
  );
  socket.join("user" + user_id);
}
async function getOnlineFriendsAndNotifyThem(user_id, socket) {
  const currentUser = await User.findByPk(user_id, {
    attributes: [
      "id",
      "first_name",
      "last_name",
      "online",
      "socket_id",
      "updatedAt",
    ],
    include: [
      {
        model: Media,
        as: "media",
        where: {
          [Op.and]: [{ current: true }, { for: "profile" }],
        },
        attributes: ["url", "for"],
        required: false,
      },
    ],
  });
  //send to user a list of their online friends
  let userFriendships = await Friendship.findAll({
    where: {
      [Op.and]: [
        { status: "accepted" },
        { [Op.or]: [{ sender_id: user_id }, { receiver_id: user_id }] },
      ],
    },
    attributes: ["sender_id", "receiver_id"],
    raw: true,
  });
  let senders_ids = [];
  let receivers_ids = [];
  userFriendships.forEach((friendship) => {
    if (user_id !== friendship.sender_id) {
      senders_ids.push(friendship.sender_id);
    }
    if (user_id !== friendship.receiver_id) {
      receivers_ids.push(friendship.receiver_id);
    }
  });
  let onlineFriends = await User.findAll({
    where: {
      [Op.and]: [
        {
          [Op.or]: [
            { id: { [Op.in]: senders_ids } },
            { id: { [Op.in]: receivers_ids } },
          ],
        },
        { online: true },
      ],
    },
    attributes: [
      "id",
      "first_name",
      "last_name",
      "online",
      "socket_id",
      "updatedAt",
    ],
    include: [
      {
        model: Media,
        as: "media",
        where: {
          [Op.and]: [{ current: true }, { for: "profile" }],
        },
        attributes: ["url", "for"],
        required: false,
      },
    ],
  });

  const mappedOnlineFriends = new Map(
    onlineFriends.map((user) => [user.id, user])
  );
  onlineUserAndHisFriends.set(user_id, mappedOnlineFriends);
  // notify user about online friends
  io.sockets
    .in("user" + user_id)
    .emit("online-friends-list", [
      ...onlineUserAndHisFriends.get(user_id).values(),
    ]);
  // notify online friends about user became online
  onlineUserAndHisFriends.get(user_id).forEach((value, key) => {
    //adds the current user to friend's online friends list
    if (!onlineUserAndHisFriends.has(key)) {
      onlineUserAndHisFriends.set(key, new Map());
    }
    onlineUserAndHisFriends.get(key).set(user_id, currentUser);
    io.sockets
      .in("user" + key)
      .emit("online-friends-list", [
        ...onlineUserAndHisFriends.get(key).values(),
      ]);
  });
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
      attributes: ["id", "first_name", "last_name"],
      include: [
        {
          model: Media,
          as: "media",
          where: {
            [Op.and]: [{ current: true }, { for: "profile" }],
          },
          attributes: ["url", "for"],
          required: false,
        },
      ],
    },
  ];
  let sender = await User.findByPk(sender_id);
  notificationMsg =
    type === "friend_post" || type === "friend_comment"
      ? `your friend <strong>${sender.first_name} ${sender.last_name}</strong> ${notificationMsg}`
      : `<strong>${sender.first_name} ${sender.last_name}</strong> ${notificationMsg}`;
  let createdNotification = await Notification.create({
    message: notificationMsg,
    sender_id,
    receiver_id,
    type,
    post_id,
    comment_id,
    friendship_id,
  });
  let notification = await Notification.findByPk(createdNotification.id, {
    include: includables,
  });
  if (notification) {
    io.sockets.in("user" + receiver_id).emit("notify", notification);
  }
}
export async function sendMessageBySocket(message, receiver_id) {
  io.sockets.in("user" + receiver_id).emit("message", message);
}
export async function seenMessage(message_id, sender_id) {

  io.sockets.in("user" + sender_id).emit("seen-message", message_id);
}
export function disconnectUser(socket, user_id) {
  socket.on("disconnect", async (reason) => {
    if (reason === "io server disconnect") {
      // the disconnection was initiated by the server, you need to reconnect manually
      socket.connect();
    }
    let userFriends = onlineUserAndHisFriends.get(user_id);
    const offlineUser = await User.update(
      { online: false },
      { where: { id: user_id } }
    );
    onlineUserAndHisFriends.delete(user_id);
    userFriends?.forEach((friend) => {
      let hisFriend = onlineUserAndHisFriends.get(friend.id);
      if (hisFriend) {
        hisFriend.delete(user_id);
        io.sockets
          .in("user" + friend.id)
          .emit("online-friends-list", [...hisFriend.values()]);
      }
    });
  });
}
