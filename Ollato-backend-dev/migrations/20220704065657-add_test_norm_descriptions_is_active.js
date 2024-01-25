'use strict'
const { status } = require('../data')

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'test_norm_descriptions', // table name
        'is_active', // new field name
        {
          type: Sequelize.ENUM(status),
          allowNull: true,
          defaultValue: 'y'
        }
      )
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('test_norm_descriptions', 'is_active')
    ])
  }
}
