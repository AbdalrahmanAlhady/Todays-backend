import parseOData from "odata-sequelize";
import Comment from "../../DBs/models/comment.model.js";
import Media from "../../DBs/models/media.model.js";
import Post from "../../DBs/models/post.model.js";
import User from "../../DBs/models/user.model.js";
import { notifyUserBySocket } from "../../service/socket-io.js";
import { Sequelize } from "sequelize";

export const createComment = async (req, res) => {
  try {
    const { body, owner_id, post_id } = req.body;
    const comment = await Comment.create({ body, owner_id, post_id });
    const commentOwner = await User.findByPk(owner_id);
    const post = await Post.findByPk(post_id);
    comment.setDataValue("user", commentOwner);
    await notifyUserBySocket(
      "has commented on your post",
      commentOwner.id,
      post.owner_id,
      "comment",
      post_id,
      comment.dataValues.id,
      null
    );
    res.status(201).json({ comment });
  } catch (error) {
    res.status(201).json({ message: error.message });
    console.log(error);
  }
};
export const getComments = async (req, res) => {
  try {
    let includables = [
      {
        model: User,
        attributes: ["id", "profileImg", "first_name", "last_name"],
      },
      {
        model: Media,
        as: "media",
        attributes: ["id", "url", "type"],
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
    if (req.params.post_id) {
      query = query + `$filter=post_id eq ${req.params.post_id}&`;
    }
    let queryWithIncludables = query
      ? {
          include: includables,
          ...parseOData(query.slice(0, -1), Sequelize),
        }
      : { include: includables };
    const comments = await Comment.findAndCountAll(queryWithIncludables);
    res.status(200).json({ comments });
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error.message);
  }
};

export const updateComment = async (req, res) => {
  try {
    const body = req.body.body;
    const comment = await Comment.update(
      { body },
      { where: { id: req.params.id } }
    );
    res.status(200).json({ comment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.destroy({ where: { id: req.params.id } });
    res.status(200).json({ comment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
