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
      queryInterface.addColumn('modules_permissions', 'slug', { type: Sequelize.STRING(), allowNull: true, after: 'module_name' }),
      queryInterface.addColumn('modules_permissions', 'sort_order', { type: Sequelize.INTEGER(11), defaultValue: '0', after: 'is_active' })
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
      queryInterface.removeColumn('modules_permissions', 'slug'),
      queryInterface.removeColumn('modules_permissions', 'sort_order')
    ])
  }
}
