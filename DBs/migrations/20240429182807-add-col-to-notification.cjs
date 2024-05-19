'use strict';

const sequelize = require("sequelize");
const {DataTypes} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.addColumn("notification", "seen", {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.removeColumn(
            "notification", "seen"
        );
    },
};
