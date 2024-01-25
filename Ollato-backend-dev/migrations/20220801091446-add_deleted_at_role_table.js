'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('roles', 'deleted_at', { type: Sequelize.DATE, allowNull: true, defaultValue: null })
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('roles', 'deleted_at')
    ])
  }
}
