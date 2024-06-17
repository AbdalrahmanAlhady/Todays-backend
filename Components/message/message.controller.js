import Message from "../../DBs/models/message.model.js";
import { sendMessageBySocket } from "../../service/socket-io.js";
import { Sequelize } from "sequelize";
import parseOData from "odata-sequelize";
import User from "../../DBs/models/user.model.js";

export const sendMessage = async (req, res) => {
  try {
    const message = await Message.create(req.body);
    if (message) {
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
        attributes: ["id", "profileImg", "first_name", "last_name"],
      },
    ];
    const { limit, page, filter, fields, orderby } = req.query;
    let query = "";
    if (page && limit) {
      query =
        query + `$top=${limit * 1 || 100}&$skip=${(page - 1) * limit || 0}&`;
    }
    if (fields) {
      query = query + `$select=${fields}&`;
    }
    if (filter) {
      query = query + `$filter=substringof('${filter.split(",")[2]}', body)&`;
    }
    if (orderby) {
      query =
        query + `$orderby=${orderby.split(",")[0]} ${orderby.split(",")[1]}&`;
    }
    if (req.params.conversation_id) {
      query = query + `$filter=conversation_id eq ${req.params.conversation_id}&`;
    }
    let queryWithIncludables = query
      ? {
          include: includables,
          ...parseOData(query.slice(0, -1), Sequelize),
        }
      : { include: includables };
    const messages = await Message.findAndCountAll(queryWithIncludables);
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
    const message = await Message.update(
       req.body ,
      { where: { id: req.params.id }}
    );
    if (message) {
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
