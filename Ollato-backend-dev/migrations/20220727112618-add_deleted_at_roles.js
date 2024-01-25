'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('role_permissions', 'deleted_at', { type: Sequelize.DATE, allowNull: true, defaultValue: null })
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('role_permissions', 'deleted_at')
    ])
  }
}
