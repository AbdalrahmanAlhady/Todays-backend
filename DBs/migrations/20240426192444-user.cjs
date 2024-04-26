"use strict";

const sequelize = require('sequelize');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn("user", "socket_id", {
      type: sequelize.DataTypes.STRING,
      allowNull: true,
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'user',
      'socket_id'
    );
  },
};
