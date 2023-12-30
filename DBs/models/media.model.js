import { sequelizeConnection } from "../connection.js";
import { DataTypes } from "sequelize";

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
  },
  {
    freezeTableName: true,
  }
);

export default Media;
