import { where } from "sequelize";
import Friendship from "../../DBs/models/friendship.model.js";
import { notifyUserBySocket } from "../../service/socket-io.js";

export const sendFriendRequest = async (req, res) => {
  try {
    const { sender_id, receiver_id } = req.params;
    const friendship = await Friendship.create({ sender_id, receiver_id });
    if (friendship) {
      await notifyUserBySocket(
        "has sent friend request to you",
        sender_id,
        receiver_id,
        "friendship_request",
        null,
        null,
        friendship.id
      );
      res.status(201).json({ message: "sent" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const updateFriendRequest = async (req, res) => {
  try {
    //  receriver is the one who will accept request so he is sender now
    const { sender_id, receiver_id } = req.params;
    const friendship = await Friendship.update(req.body, {
      where: { sender_id, receiver_id },
    });
    if (friendship) {
      // sender is  the recevier of the friend request so ids is
      await notifyUserBySocket(
        "has accepted your friend request",
        receiver_id,
        sender_id,
        "friendship_accept",
        null,
        null,
        friendship.id
      );
      res.status(200).json({ message: "accepted" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const deleteFriendRequest = async (req, res) => {
  try {
    const { sender_id, receiver_id } = req.params;
    const friendship = await Friendship.deleteOne({ sender_id, receiver_id });
    if (friendship) res.status(200).json({ message: "friendship removed" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const checkFriendship = async (req, res) => {
  try {
    const { sender_id, receiver_id } = req.params;
    const friendship = await Friendship.findOne({
      where: { sender_id, receiver_id },
    });
    if (friendship) {
      res.status(201).json({ friendship_status: friendship.status });
    } else {
      res.status(201).json({ friendship_status: "none" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
