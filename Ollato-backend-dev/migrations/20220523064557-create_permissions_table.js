'use strict'
const { status, permissionType, permissionModule } = require('../data')

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('permissions', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      custom_id: { type: Sequelize.STRING, unique: true, allowNull: false },
      title: { type: Sequelize.STRING, unique: true, allowNull: false },
      module_name: { type: Sequelize.ENUM(permissionModule), allowNull: false }, // defined modules in data json
      type: { type: Sequelize.ENUM(permissionType), allowNull: false }, // 'access', 'view', 'edit', 'delete', 'view'
      is_active: { type: Sequelize.ENUM(status), defaultValue: 'y' }, // y = Active, n = Inactive
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: Sequelize.DATE,
      created_by: { type: Sequelize.STRING(), allowNull: true },
      updated_by: { type: Sequelize.STRING(), allowNull: true }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('permissions')
  }
}
