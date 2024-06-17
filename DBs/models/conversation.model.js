import { sequelizeConnection } from "../connection.js";
import { DataTypes } from "sequelize";

const Conversation = sequelizeConnection.define(
  "conversation",
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    first_user_status: {
      type: DataTypes.ENUM("active", "minimzed", "closed"),
      allowNull: false,
      defaultValue: "closed",
    },
    second_user_status: {
      type: DataTypes.ENUM("active", "minimzed", "closed"),
      allowNull: false,
      defaultValue: "closed",
    },
  },
  {
    freezeTableName: true,
  }
);

export default Conversation;
