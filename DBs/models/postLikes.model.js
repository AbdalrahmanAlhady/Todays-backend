import { sequelizeConnection } from "../connection.js";
import { DataTypes } from "sequelize";

const PostLikes = sequelizeConnection.define(
  "postLikes",
  {
  },
  {
    freezeTableName: true,
  }
);

export default PostLikes;
