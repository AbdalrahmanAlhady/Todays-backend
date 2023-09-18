import Post from "./models/post.model.js";
import User from "./models/user.model.js";
import Comment from "./models/comment.model.js";
import Friendship from "./models/friendship.model.js";
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
  //  ----------------------------------------
  User.belongsToMany(User, { as: 'friend1', foreignKey: 'first_friend', through: Friendship});
  User.belongsToMany(User, { as: 'friend2', foreignKey: 'second_friend', through: Friendship });

}
export default initRelations;
