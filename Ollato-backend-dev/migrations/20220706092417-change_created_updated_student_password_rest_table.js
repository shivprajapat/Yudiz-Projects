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
      queryInterface.changeColumn('student_password_resets', 'created_at', {
        type: Sequelize.DATE, defaultValue: Sequelize.NOW, allowNull: true
      }),
      queryInterface.changeColumn('student_password_resets', 'updated_at', {
        type: Sequelize.DATE, defaultValue: Sequelize.NOW, allowNull: true
      })
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
}
