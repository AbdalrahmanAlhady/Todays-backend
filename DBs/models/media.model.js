import { sequelizeConnection } from "../connection.js";
import { DataTypes, Sequelize } from "sequelize";

const Media = sequelizeConnection.define(
  "media",
  {
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("img", "video"),
      allowNull: false,
    },
    storage_provider: {
      type: DataTypes.STRING,
      defaultValue: "firebase",
    },
    dimensions: {
      type: DataTypes.JSON,
    },
    for: {
      type: DataTypes.ENUM("post", "comment", "profile", "cover"),
      allowNull: false,
    },
    current:{
      type: DataTypes.BOOLEAN,
      defaultValue: null,
      allowNull: true
    }
    
  },
  {
    freezeTableName: true,
  }
);

export default Media;
