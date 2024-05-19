import { sequelizeConnection } from "../connection.js";
import { DataTypes } from "sequelize";

const Friendship = sequelizeConnection.define("friendship",
  {
    id:{
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement:true,
      primaryKey:true
    },
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