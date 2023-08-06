import Comment from "../../DBs/models/comment.model.js";
import APIFeatures from "../../utils/apiFeatures.js";

export const createComment = async (req, res) => {
  try {
    const { body, ownerId, postId } = req.body;
    const comment = new Comment({ body, owner: ownerId, post: postId });
    const savedComment = await comment.save();
    res.status(201).json({ comment: savedComment });
  } catch (error) {
    res.status(201).json({ message: error.message });
  }
};
export const getComments = async (req, res) => {
  try {
    let feature = new APIFeatures(Comment.find(), req.query)
      .filter()
      .sort()
      .paginate()
      .limitFields();
    const comments = await feature.query;
    res.status(200).json({ comments });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const body = req.body.body;
    const comment = await Comment.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { body } },
      { new: true }
    );
    res.status(200).json({ comment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.deleteOne({ _id: req.params.id });
    res.status(200).json({ comment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
