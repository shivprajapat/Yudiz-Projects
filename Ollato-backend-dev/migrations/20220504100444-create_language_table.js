'use strict'
const { status } = require('../data')

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('languages', {
      code: { type: Sequelize.STRING(), allowNull: false, primaryKey: true },
      title: { type: Sequelize.STRING(), allowNull: false },
      is_active: { type: Sequelize.ENUM(status), defaultValue: 'y' }, // Y = Active, N = Inactive
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: Sequelize.DATE
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('languages')
  }
}
