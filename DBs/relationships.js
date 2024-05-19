import Post from "./models/post.model.js";
import User from "./models/user.model.js";
import Comment from "./models/comment.model.js";
import Friendship from "./models/friendship.model.js";
import PostLikes from "./models/postLikes.model.js";
import Media from "./models/media.model.js";
import Notification from "./models/notification.model.js";
export function initRelations() {
  // ---------------- user post------------
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
  //   -------------------user comment-----------------
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
  //  -----------------post and comment-----------------
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
  // -------------------post media----------------
  Post.hasMany(Media, {
    foreignKey: {
      name: "post_id",
      allowNull: true,
    },
    as:'media',
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Media.belongsTo(Post, { foreignKey: { name: "post_id", allowNull: true } });
  //  --------------comment media-----------------
  Comment.hasOne(Media, {
    foreignKey: {
      name: "comment_id",
      allowNull: true,
    },
    as:'media',
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Media.belongsTo(Comment, {
    foreignKey: { name: "comment_id", allowNull: true },
  });
  //  -----------------friendship-----------------
  User.belongsToMany(User, {
    foreignKey: {
      name: "sender_id",
      allowNull: false,
    },
    as: "sender",
    through: Friendship,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  User.belongsToMany(User, {
    foreignKey: {
      name: "receiver_id",
      allowNull: false,
    },
    as: "receiver",
    through: Friendship,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  //  ---------------PostLikes------------------
  User.belongsToMany(Post, {
    foreignKey: {
      name: "user_id",
      allowNull: false,
    },
    as: "liked",
    through: PostLikes,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Post.belongsToMany(User, {
    foreignKey: {
      name: "post_id",
      allowNull: false,
    },
    as: "likes",
    through: PostLikes,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  //   ---------------------user notification---------------------
  Notification.belongsTo(User, {
    foreignKey: {
      name: "sender_id",
      allowNull: false,
    },
    as: "sender",
    through: Notification,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Notification.belongsTo(User, {
    foreignKey: {
      name: "receiver_id",
      allowNull: false,
    },
    as: "receiver",
    through: Notification,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  User.hasMany(Notification, {
    foreignKey: "sender_id",
    as: "sentNotifications",
  });
  User.hasMany(Notification, {
    foreignKey: "receiver_id",
    as: "receivedNotifications",
  });
  // ----------post notification(likes)-----------
  Notification.belongsTo(Post, {
    foreignKey: {
      name: "post_id",
      allowNull: true,
    },
    as: "post",
    through: Notification,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Post.hasMany(Notification, {
    foreignKey: "post_id",
    as: "notifications",
  });
  // ---------------comment notification--------
  Notification.belongsTo(Comment, {
    foreignKey: {
      name: "comment_id",
      allowNull: true,
    },
    as: "comment",
    through: Notification,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Comment.hasOne(Notification, {
    foreignKey: "comment_id",
    as: "notification",
  });
  // ---------------friendship notification--------
  Notification.belongsTo(Friendship, {
    foreignKey: {
      name: "friendship_id",
      allowNull: true,
    },
    as: "friendship",
    through: Notification,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Friendship.hasMany(Notification, {
    foreignKey: "friendship_id",
    as: "notification",
  });
  
}
export default initRelations;
