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
    dimensions:{
      type: DataTypes.JSON,
    }
  },
  {
    freezeTableName: true,
  }
);

export default Media;
