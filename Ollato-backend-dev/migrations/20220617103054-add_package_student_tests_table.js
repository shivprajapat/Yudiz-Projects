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
      queryInterface.addColumn('student_tests', 'package_id', { type: Sequelize.INTEGER, after: 'test_detail_id', references: { model: 'packages', key: 'id' }, allowNull: true, defaultValue: null }),
      queryInterface.addColumn('student_tests', 'student_package_id', { type: Sequelize.INTEGER, after: 'package_id', references: { model: 'student_packages', key: 'id' }, allowNull: true, defaultValue: null })
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
      queryInterface.removeColumn('student_tests', 'package_id'),
      queryInterface.removeColumn('student_tests', 'student_package_id')
    ])
  }
}
