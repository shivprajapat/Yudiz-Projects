'use strict'
const { status } = require('../data')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('modules_permissions', {
      id: { type: Sequelize.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      custom_id: { type: Sequelize.STRING(), allowNull: true },
      module_name: { type: Sequelize.STRING(), allowNull: true },
      list: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false },
      view: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false },
      create: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false },
      update: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false },
      delete: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false },
      is_active: { type: Sequelize.ENUM(status), defaultValue: 'y' }, // y = Active, n = Inactive
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: Sequelize.DATE,
      created_by: { type: Sequelize.STRING(), allowNull: true },
      updated_by: { type: Sequelize.STRING(), allowNull: true },
      deleted_at: { type: Sequelize.DATE, allowNull: true, defaultValue: null }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('modules_permissions')
  }
}
