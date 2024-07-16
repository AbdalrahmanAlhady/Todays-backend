import Message from "../../DBs/models/message.model.js";
import { seenMessage, sendMessageBySocket } from "../../service/socket-io.js";
import { Op, Sequelize } from "sequelize";
import parseOData from "odata-sequelize";
import User from "../../DBs/models/user.model.js";
import Media from "../../DBs/models/media.model.js";
import Conversation from "../../DBs/models/conversation.model.js";

export const sendMessage = async (req, res) => {
  try {
    const message = await Message.create(req.body);
    if (message) {
      const conversation = await Conversation.findByPk(req.body.conversation_id);
      if (conversation) {
        conversation.first_user_id === message.receiver_id
          ? (conversation.first_user_status = "active")
          : (conversation.second_user_status = "active");
        await conversation.save();
      }
      await sendMessageBySocket(message, message.receiver_id);
      res.status(201).json({ message });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const getMessagesOfConversation = async (req, res) => {
  try {
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
    ];
    const { limit, page, filter, fields, orderby } = req.query;
    let queryOptions = {
      where: {},
      order: [["createdAt", "DESC"]],
      include: includables,
    };
    if (req.params.conversation_id) {
      queryOptions.where.conversation_id = req.params.conversation_id
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
   
    const messages = await Message.findAndCountAll(queryOptions);
    if (messages) {
      res.status(200).json({ messages });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error.message);
  }
};
export const updateMessage = async (req, res) => {
  try {
    let { sender_id, ...body } = req.body;
    const message = await Message.update(body, {
      where: { id: req.params.id },
    });
    if (message) {
      if (req.body.seen) {
        await seenMessage(req.params.id, sender_id);
      }
      res.status(200).json({ message: "updated" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const deleteMessage = async (req, res) => {
  try {
    const message = await Message.destroy({ where: { id: req.params.id } });
    res.status(200).json({ message: "deleted" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
