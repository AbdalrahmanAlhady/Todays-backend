import Conversation from "../../DBs/models/conversation.model.js";
import { Op, Sequelize } from "sequelize";
import parseOData from "odata-sequelize";
import User from "../../DBs/models/user.model.js";
import Message from "../../DBs/models/message.model.js";
import Media from "../../DBs/models/media.model.js";

export const CreateConversation = async (req, res) => {
  try {
    const { first_user_id, second_user_id } = req.params;
    const first_user = await User.findByPk(first_user_id);
    const second_user = await User.findByPk(second_user_id);
    const initiator_id = first_user_id;
    const existingConversation = await Conversation.findOne({
      where: {
        [Op.or]: [
          { first_user_id, second_user_id },
          { first_user_id: second_user_id, second_user_id: first_user_id },
        ],
      },
    });
    if (existingConversation) {
      const updatedConversation = await Conversation.update(
        initiator_id === first_user_id
          ? { first_user_status: "active" }
          : { second_user_status: "active" },
        { where: { id: existingConversation.id } }
      );
      res.status(200).json({
        conversation: {
          ...existingConversation.dataValues,
          first_user,
          second_user,
        },
      });
      return;
    } else {
      const conversation = await Conversation.create({
        first_user_id,
        second_user_id,
        ...req.body,
      });
      if (conversation) {
        res.status(201).json({
          conversation: {
            ...conversation.dataValues,
            first_user,
            second_user,
          },
        });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const getConversationsOfUser = async (req, res) => {
  try {
    let includables = [
      {
        model: User,
        as: "first_user",
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
        as: "second_user",
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
    const { limit, page, filter, fields, orderby, id } = req.query;
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
        { first_user_id: req.params.user_id },
        { second_user_id: req.params.user_id },
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
    const conversations = await Conversation.findAndCountAll(queryOptions);
    if (conversations) {
      res.status(200).json({ conversations });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const updateConversation = async (req, res) => {
  try {
    const conversation = await Conversation.update(req.body, {
      where: { id: req.params.id },
    });
    if (conversation) {
      res.status(200).json({ message: "updated" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const deleteConversation = async (req, res) => {
  try {
    const conversation = await Conversation.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const getUnseenMessages = async (req, res) => {
  try {
    const unseenMessages = await Message.findAndCountAll({
      where: {
        conversation_id: req.params.id,
        seen: false,
        receiver_id: req.params.receiver_id,
      },
    });
    if (unseenMessages) {
      res.status(200).json({ messages: unseenMessages });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
