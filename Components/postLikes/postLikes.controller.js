import PostLikes from "../../DBs/models/postLikes.model.js";


export const likePost = async (req, res) => {
  try {
    const { post_id, user_id } = req.params;
    const oldPostsLikes = await PostLikes.findAll({ where: { post_id } });
    const newPostLike = await PostLikes.create({ post_id, user_id });
    const newPostsLikes = await PostLikes.findAll({ where: { post_id } });
    if (newPostsLikes.length > oldPostsLikes.length) {
      res.status(201).json({
        message: "post liked",
        likesCount: newPostsLikes.length,
      });
    } else {
      res
        .status(400)
        .json({ message: "post not liked!", likesCount: oldPostCounts });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
    console.log(error);
  }
};
export const unlikePost = async (req, res) => {
  try {
    const { post_id, user_id } = req.params;
    const oldPostLikes = await PostLikes.findAll({ where: { post_id } });
    const newPostLike = await PostLikes.destroy({
      where: { post_id, user_id },
    });
    const newPostLikes = await PostLikes.findAll({ where: { post_id } });
    if (newPostLikes.length < oldPostLikes.length) {
      res.status(201).json({
        message: "post unliked",
        likesCount: newPostLikes.length,
        newPostLikes,
      });
    } else {
      res.status(400).json({
        message: "post unlike failed!",
        likesCount: newPostLikes.length,
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const isLikedPost = async (req, res) => {
  try {
    const { post_id, user_id } = req.params;
    const ifPostLiked = await PostLikes.findOne({
      where: { post_id, user_id },
    });
    res.status(201).json({ postLiked: !!ifPostLiked });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
