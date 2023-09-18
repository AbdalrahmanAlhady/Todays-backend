import Comment from "../../DBs/models/comment.model.js";


export const createComment = async (req, res) => {
  try {
    const { body, owner_id, post_id } = req.body;
    const comment = new Comment({ body, owner_id, post_id });
    const savedComment = await comment.save();
    res.status(201).json({ comment: savedComment });
  } catch (error) {
    res.status(201).json({ message: error.message });
  }
};
export const getComments = async (req, res) => {
  try {
    const { limit, page, search, fields, orderby } = req.query;
    const comments = await Comment.findAndCountAll({
      attributes: fields?.split(",") || "",
      limit: limit * 1 || 100,
      offset: (page - 1) * limit || 0,
      where: { body: { [Op.like]: "%" + (search ? search : "") + "%" } },
      order: orderby ? [orderby.split(",")] : [],
    });
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
