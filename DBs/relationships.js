import Post from "./models/post.model.js";
import User from "./models/user.model.js";
import Comment from "./models/comment.model.js";
import Friendship from "./models/friendship.model.js";
import PostLikes from "./models/postLikes.model.js";
import Media from "./models/media.model.js";
export function initRelations() {
  // user relations
  User.hasMany(Post, {
    foreignKey: {
      name: "owner_id",
      allowNull: false,
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Post.belongsTo(User, {
    foreignKey: "owner_id",
  });
  //   -------------------------------------------
  User.hasMany(Comment, {
    foreignKey: {
      name: "owner_id",
      allowNull: false,
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Comment.belongsTo(User, {
    foreignKey: "owner_id",
  });
  //  ----------------------------------------
  Post.hasMany(Comment, {
    foreignKey: {
      name: "post_id",
      allowNull: false,
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Comment.belongsTo(Post, {
    foreignKey: "post_id",
  });
  // ----------------------------------------
  Post.hasMany(Media, {
    foreignKey: {
      name: "post_id",
      allowNull: true,
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Media.belongsTo(Post, { foreignKey: {name:"post_id",allowNull:true} });
  //  ----------------------------------------
  Comment.hasOne(Media, {
    foreignKey: {
      name: "comment_id",
      allowNull: true,
    },as:'media',
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Media.belongsTo(Comment,  { foreignKey: {name:"comment_id",allowNull:true} });
  //  ----------------------------------------
  User.belongsToMany(User, {
    as: "friend1",
    foreignKey: "first_friend",
    through: Friendship,
  });
  User.belongsToMany(User, {
    as: "friend2",
    foreignKey: "second_friend",
    through: Friendship,
  });
  //  ----------------------------------------
  User.belongsToMany(Post, {
    as: "liked",
    foreignKey: "user_id",
    through: PostLikes,
  });
  Post.belongsToMany(User, {
    as: "likes",
    foreignKey: "post_id",
    through: PostLikes,
  });
}
export default initRelations;
