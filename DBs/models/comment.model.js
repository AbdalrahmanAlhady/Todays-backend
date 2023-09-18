import { sequelizeConnection } from "../connection.js";
import { DataTypes } from "sequelize";

const Comment = sequelizeConnection.define(
  "comment",
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

export default Comment;
