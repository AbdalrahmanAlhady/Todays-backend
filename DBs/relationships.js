import Post from "./models/post.model.js";
import User from "./models/user.model.js";
import Comment from "./models/comment.model.js";
import Friendship from "./models/friendship.model.js";
import PostLikes from "./models/postLikes.model.js";
import Media from "./models/media.model.js";
import Notification from "./models/notification.model.js";
import Message from "./models/message.model.js";
import Conversation from "./models/conversation.model.js";
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
    as: "media",
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
    as: "media",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Media.belongsTo(Comment, {
    foreignKey: { name: "comment_id", allowNull: true },
  });
  // -------------------user media----------------
  User.hasMany(Media, {
    foreignKey: {
      name: "owner_id",
      allowNull: false,
    },
    as: "media",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Media.belongsTo(User, { foreignKey: { name: "owner_id", allowNull: false } });
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
  Friendship.belongsTo(User, { as: "sender", foreignKey: "sender_id" });
  Friendship.belongsTo(User, { as: "receiver", foreignKey: "receiver_id" });
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
  //------------------user message--------------------
  Conversation.belongsTo(User, {
    foreignKey: {
      name: "first_user_id",
      allowNull: false,
    },
    as: "first_user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Conversation.belongsTo(User, {
    foreignKey: {
      name: "second_user_id",
      allowNull: false,
    },
    as: "second_user",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  //------------------user message--------------------
  Message.belongsTo(User, {
    foreignKey: {
      name: "sender_id",
      allowNull: false,
    },
    as: "sender",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Message.belongsTo(User, {
    foreignKey: {
      name: "receiver_id",
      allowNull: false,
    },
    as: "receiver",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  //------------------Conversation message--------------------
  Message.belongsTo(Conversation, {
    foreignKey: {
      name: "conversation_id",
      allowNull: false,
    },
    as: "conversation",
    through: Message,
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Conversation.hasMany(Message, {
    foreignKey: "conversation_id",
    as: "messages",
  });
}
export default initRelations;
