'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('counsellor_password_resets', {
      email_mobile: { type: Sequelize.STRING(), allowNull: false },
      OTP: { type: Sequelize.STRING(), allowNull: true },
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
    await queryInterface.dropTable('counsellor_password_resets')
  }
}
