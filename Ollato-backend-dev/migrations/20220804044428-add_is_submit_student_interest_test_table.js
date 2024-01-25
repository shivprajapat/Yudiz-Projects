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
      queryInterface.addColumn('student_interest_tests', 'is_submitted', { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false, after: 'student_package_id' }),
      queryInterface.addColumn('student_interest_tests', 'submission_Time', { type: Sequelize.DATE, allowNull: true, defaultValue: null, after: 'is_submitted' }),
      queryInterface.addColumn('student_interest_tests', 'test_id', { type: Sequelize.INTEGER, after: 'custom_id', references: { model: 'tests', key: 'id' }, allowNull: true, defaultValue: null })
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
      queryInterface.removeColumn('student_interest_tests', 'test_id'),
      queryInterface.removeColumn('student_interest_tests', 'is_submitted'),
      queryInterface.removeColumn('student_interest_tests', 'submission_Time')
    ])
  }
}
