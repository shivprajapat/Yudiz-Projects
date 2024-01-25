'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('role_permissions', 'module_permission_id', { type: Sequelize.INTEGER, references: { model: 'modules_permissions', key: 'id' }, allowNull: true, defaultValue: null })
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('role_permissions', 'module_permission_id')
    ])
  }
}
