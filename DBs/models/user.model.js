import { sequelizeConnection } from "../connection.js";
import { DataTypes } from "sequelize";
import Post from "./post.model.js";
const User = sequelizeConnection.define(
  "user",
  {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [3,20]
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      len: [3,20]
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,

    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      isEmail: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("male", "female"),
      allowNull: false,
    },
    profileImg: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profileCoverImg: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    online:{
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    socket_id: {
      type: sequelize.DataTypes.STRING,
      allowNull: true,
    },
    OTP: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
  }
);

export default User;