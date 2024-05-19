import { sequelizeConnection } from "../connection.js";
import { DataTypes } from "sequelize";

const PostLikes = sequelizeConnection.define(
  "postLikes",
  {
    id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement:true,
      primaryKey:true
    }
  },
  {
    freezeTableName: true,
  }
);

export default PostLikes;
