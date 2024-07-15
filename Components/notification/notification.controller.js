import { Op } from "sequelize";
import Media from "../../DBs/models/media.model.js";
import Notification from "../../DBs/models/notification.model.js";
import User from "../../DBs/models/user.model.js";

export const getUserNotification = async (req, res) => {
  try {
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
    let notifications = await Notification.findAndCountAll({
      where: { receiver_id: req.params.receiver_id },
      include: includables,
    });
    if (notifications) {
      res.status(201).json({ notifications });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const UpdateNotification = async (req, res) => {
  try {
    const updatedNotification = await Notification.update(req.body, {
      where: { id: req.params.id },
    });
    if (updatedNotification) {
      res.status(201).json({
        message: "notification updated",
      });
    } else {
      res.status(400).json({ message: "notification not updated!" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
