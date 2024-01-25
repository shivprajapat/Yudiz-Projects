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
      queryInterface.removeIndex('students', 'email'),
      queryInterface.removeIndex('students', 'mobile'),

      // For counsellor
      queryInterface.removeIndex('counsellors', 'email'),
      queryInterface.removeIndex('counsellors', 'mobile'),

      // for center
      queryInterface.removeIndex('centers', 'email'),
      queryInterface.removeIndex('centers', 'mobile'),

      // for Admin
      queryInterface.removeIndex('admins', 'email'),
      queryInterface.removeIndex('admins', 'mobile')
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
