'use strict'
const { sessionsStatus } = require('../data')
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('sessions', 'status', {
        type: Sequelize.ENUM(sessionsStatus),
        allowNull: false
      })
    ])
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('sessions', 'status', {
        type: Sequelize.ENUM(sessionsStatus),
        allowNull: false
      })
    ])
  }
}
