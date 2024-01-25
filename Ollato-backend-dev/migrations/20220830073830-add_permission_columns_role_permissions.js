'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.addColumn('role_permissions', 'list', { type: Sequelize.STRING(), allowNull: true, after: 'module_permission_id' }),
      queryInterface.addColumn('role_permissions', 'view', { type: Sequelize.STRING(), allowNull: true, after: 'list' }),
      queryInterface.addColumn('role_permissions', 'create', { type: Sequelize.STRING(), allowNull: true, after: 'view' }),
      queryInterface.addColumn('role_permissions', 'update', { type: Sequelize.STRING(), allowNull: true, after: 'create' }),
      queryInterface.addColumn('role_permissions', 'delete', { type: Sequelize.STRING(), allowNull: true, after: 'update' })
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.removeColumn('role_permissions', 'list'),
      queryInterface.removeColumn('role_permissions', 'view'),
      queryInterface.removeColumn('role_permissions', 'create'),
      queryInterface.removeColumn('role_permissions', 'update'),
      queryInterface.removeColumn('role_permissions', 'delete')
    ])
  }
}
