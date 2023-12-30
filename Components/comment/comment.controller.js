import Comment from "../../DBs/models/comment.model.js";
import User from "../../DBs/models/user.model.js";

export const createComment = async (req, res) => {
  try {
    const { body, owner_id, post_id } = req.body;
    const comment = await Comment.create({ body, owner_id, post_id });
    const user = await User.findByPk(owner_id);
    comment.setDataValue('user',user)
    res.status(201).json({ comment});
  } catch (error) {
    res.status(201).json({ message: error.message });
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
        attributes: ["id", "url", "type"],
      },
    ];
    const { limit, page, search, fields, orderby } = req.query;
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
    const comments = await Comment.findAndCountAll(  query
      ? (parseOData(query, Sequelize),
        {
          include: includables,
        })
      : { include: includables });
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
