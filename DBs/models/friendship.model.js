import { sequelizeConnection } from "../connection.js";
import { DataTypes } from "sequelize";

const Friendship = sequelizeConnection.define("friendship",
  {
    status:{
      type: DataTypes.ENUM('requested','accepted'),
      allowNull: false,
      defaultValue:'requested'
    }
  },
  {
    freezeTableName: true,
  }
);
export default Friendship