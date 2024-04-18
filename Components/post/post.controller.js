import Post from "../../DBs/models/post.model.js";
import User from "../../DBs/models/user.model.js";
import Media from "../../DBs/models/media.model.js";
import { Op, Sequelize, col } from "sequelize";
import { sequelizeConnection } from "../../DBs/connection.js";
import { json } from "express";
import parseOData from "odata-sequelize";
import PostLikes from "../../DBs/models/postLikes.model.js";
import { model } from "mongoose";
import Comment from "../../DBs/models/comment.model.js";

export const createPost = async (req, res) => {
  try {
    const { body, owner_id } = req.body;
    const post = await Post.create({ body, owner_id });
    const user = await User.findByPk(owner_id);
    post.setDataValue("user", user);
    res.status(201).json({ post });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    let query = "";
    let includables = [
      {
        model: User,
        attributes: ["id", "profileImg", "first_name", "last_name"],
      },
      {
        model: Media,
        attributes: ["id", "url", "type","dimensions"],
      },
      {
        model: Comment,
        attributes: ["id", "body", "createdAt"],
        include: [
          {
            model: User,
            attributes: ["id", "profileImg", "first_name", "last_name"],
          },
          {
            model: Media,
            as: "media",
            attributes: ["id", "url", "type", "dimensions"],
          },
        ],
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
    const { limit, page, filter, fields, orderby } = req.query;
    let query = "";
    let includables = [
      {
        model: User,
        attributes: ["id", "profileImg", "first_name", "last_name"],
      },
      {
        model: Media,
        attributes: ["id", "url", "type","dimensions"],
      },
      {
        model: Comment,
        attributes: ["id", "body", "createdAt"],
        include: [
          {
            model: User,
            attributes: ["id", "profileImg", "first_name", "last_name"],
          },
          {
            model: Media,
            as: "media",
            attributes: ["id", "url", "type", "dimensions"],
          },
        ],
      },
      {
        model: User,
        attributes: ["id", "first_name", "last_name"],
        as: "likes",
        through: { model: PostLikes, attributes: [] },
      },
    ];
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
    query = query.slice(0, -1);
    const posts = await Post.findAndCountAll(
      query
        ? (parseOData(query, Sequelize),
          {
            include: includables,
          })
        : { include: includables }
    );
    res.status(200).json({ posts });
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error);
  }
};

export const updatePost = async (req, res) => {
  try {
    const body = req.body.body;
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { body } },
      { new: true }
    );
    res.status(200).json({ post });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.deleteOne({ _id: req.params.id });
    res.status(200).json({ post });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const likePost = async (req, res) => {
  try {
    const { post_id, user_id } = req.query;
    const oldPostsLikes = await PostLikes.findAll({ where: { post_id } });
    const newPostLike = await PostLikes.create({ post_id, user_id });
    const newPostsLikes = await PostLikes.findAll({ where: { post_id } });
    if (newPostsLikes.length > oldPostsLikes.length) {
      res
        .status(201)
        .json({
          message: "post liked",
          likesCount: newPostsLikes.length,
          newLike: newPostLike,
        });
    } else {
      res
        .status(400)
        .json({ message: "post not liked!", likesCount: oldPostCounts });
    }
    console.log(oldPostsLikes.length, newPostsLikes.length);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const isLikedPost = async (req, res) => {
  try {
    const { post_id, user_id } = req.query;
    const ifPostLiked = await PostLikes.findOne({
      where: { post_id, user_id },
    });
    res.status(201).json({ postLiked: !!ifPostLiked });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
