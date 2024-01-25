'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('admin_password_resets', {
      email: { type: Sequelize.STRING(), allowNull: false },
      token: { type: Sequelize.STRING(), allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('admin_password_resets')
  }
}
