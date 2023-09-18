import Post from "../../DBs/models/post.model.js";
import { Op, Sequelize } from "sequelize";
import { json } from "express";

export const createPost = async (req, res) => {
  try {
    const { body, owner_id } = req.body;
    const post = new Post({ body, owner_id });
    const savedPost = await post.save();
    res.status(201).json({ post: savedPost });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
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
    const posts = await Post.findAndCountAll({
      attributes: fields?.split(",") || "",
      limit: limit * 1 || 100,
      offset: (page - 1) * limit || 0,
      where: Sequelize.where(col(filter.split(",")[0]),filter.split(",")[2],filter.split(",")[3]),
      order: orderby ? [orderby.split(",")] : [],
    });
    console.log(filter)
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
