'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.addColumn('student_tests', 'student_interest_test_id', { type: Sequelize.INTEGER, after: 'student_package_id', references: { model: 'student_interest_tests', key: 'id' }, allowNull: true, defaultValue: null })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.removeColumn('student_tests', 'student_interest_test_id')
  }
}
