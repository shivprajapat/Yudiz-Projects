'use strict'
const { sessionsType } = require('../data')

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'sessions', // table name
        'type', // new field name
        {
          type: Sequelize.ENUM(sessionsType),
          allowNull: true,
          defaultValue: null,
          after: 'to_time'
        }
      )
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('sessions', 'type')
    ])
  }
}
