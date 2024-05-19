import {sequelizeConnection} from "../connection.js";
import {DataTypes, Sequelize} from "sequelize";

const Notification = sequelizeConnection.define(
    "notification",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.ENUM('like', 'comment', 'friend_post', 'friendship_request', 'friendship_accept'),
            allowNull: false,
        },
        seen: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    },
    {
        freezeTableName: true,
    }
);

export default Notification;
