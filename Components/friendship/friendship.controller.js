import { Op, Sequelize, where } from "sequelize";
import Friendship from "../../DBs/models/friendship.model.js";
import { notifyUserBySocket } from "../../service/socket-io.js";
import parseOData from "odata-sequelize";
import User from "../../DBs/models/user.model.js";
import Notification from "../../DBs/models/notification.model.js";
import Media from "../../DBs/models/media.model.js";

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

export const getFriendships = async (req, res) => {
  try {
    const { limit, page, filter, fields, orderby, id } = req.query;

    let includables = [
      {
        model: User,
        as: "receiver",
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
    let queryOptions = {
      where: {},
      order: [["createdAt", "DESC"]],
      include: includables,
    };
    if (id) {
      queryOptions.where.id = id;
    }
    if (req.params.user_id) {
      queryOptions.where[Op.or] = [
        { sender_id: req.params.user_id },
        { receiver_id: req.params.user_id },
      ];
    }
    if (limit && page) {
      queryOptions.offset = (page - 1) * limit;
      queryOptions.limit = limit * 1;
    }
    if (fields) {
      queryOptions.attributes = [...fields.split(",")];
    }
    if (orderby) {
      queryOptions.order.push([orderby.split(",")[0], orderby.split(",")[1]]);
    }
    const friendships = await Friendship.findAndCountAll(queryOptions);
    res.status(200).json({ friendships });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};
export const updateFriendRequest = async (req, res) => {
  try {
    //  receriver is the one who will accept request so he is sender now
    const { sender_id, receiver_id } = req.params;
    const updatedFriendship = await Friendship.update(req.body, {
      where: { sender_id, receiver_id },
    });
    const friendship = await Friendship.findOne({
      where: { sender_id, receiver_id },
    })
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
     const deletedNotification = await Notification.destroy({
        where: { type: "friendship_request", friendship_id: friendship.id },
      });
      if (deletedNotification) {
        
        res.status(200).json({ message: "accepted" });
      }
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
