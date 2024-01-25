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
      queryInterface.addColumn('student_tests', 'student_calc_test_id', { type: Sequelize.INTEGER, after: 'custom_id', references: { model: 'student_calc_tests', key: 'id' }, allowNull: true, defaultValue: null })
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
      queryInterface.removeColumn('student_tests', 'student_calc_test_id')
    ])
  }
}
