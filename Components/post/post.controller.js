import Post from "../../DBs/models/post.model.js";
import User from "../../DBs/models/user.model.js";
import Media from "../../DBs/models/media.model.js";
import { Op, Sequelize, where } from "sequelize";
import parseOData from "odata-sequelize";
import PostLikes from "../../DBs/models/postLikes.model.js";
import Comment from "../../DBs/models/comment.model.js";
import { notifyUserBySocket } from "../../service/socket-io.js";
import Friendship from "../../DBs/models/friendship.model.js";

export const createPost = async (req, res) => {
  try {
    const { body, owner_id } = req.body;
    const post = await Post.create({ body, owner_id });
    const user = await User.findByPk(owner_id);
    post.setDataValue("user", user);
    // get friends of user
    const friends = await Friendship.findAll({
      where: {
        [Op.or]: [{ sender_id: owner_id }, { receiver_id: owner_id }],
      },
    });
    friends.forEach((friend) => {
      notifyUserBySocket(
        `has new post`,
        user.id,
        friend.sender_id === owner_id ? friend.receiver_id : friend.sender_id,
        "friend_post",
        post.id,
        null,
        null
      );
    });

    res.status(201).json({ post });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    let includables = [
      {
        model: User,
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
        model: Media,
        as: "media",
        attributes: ["id", "url", "type", "dimensions"],
      },
      {
        model: User,
        attributes: ["id", "first_name", "last_name"],
        as: "likes",
        through: { model: PostLikes, attributes: [] },
      },
    ];
    const post = await Post.findByPk(req.params.id, { include: includables });
    if (post) {
      res.status(201).json({ post });
    } else {
      res.status(404).json({ message: "not found" });
    }
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const { limit, page, filter, fields, orderby, user_id, id } = req.query;
    let includables = [
      {
        model: User,
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
        model: Media,
        as: "media",
        attributes: ["id", "url", "type", "dimensions"],
      },
      {
        model: User,
        attributes: ["id", "first_name", "last_name"],
        as: "likes",
        through: { model: PostLikes, attributes: [] },
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
    if (user_id) {
      queryOptions.where.owner_id = user_id;
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
    const posts = await Post.findAndCountAll(queryOptions);
    res.status(200).json({ posts });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const body = req.body.body;
    const post = await Post.update({ body }, { where: { id: req.params.id } });
    res.status(200).json({ post });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.destroy({ where: { id: req.params.id } });
    res.status(200).json({ post });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
