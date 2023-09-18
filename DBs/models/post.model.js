import { sequelizeConnection } from "../connection.js";
import { DataTypes } from "sequelize";

const Post = sequelizeConnection.define(
  "post",
  {
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Post;