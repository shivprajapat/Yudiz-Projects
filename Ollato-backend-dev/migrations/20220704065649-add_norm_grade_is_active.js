'use strict'
const { status } = require('../data')

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'norm_grades', // table name
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
      queryInterface.removeColumn('norm_grades', 'is_active')
    ])
  }
}
