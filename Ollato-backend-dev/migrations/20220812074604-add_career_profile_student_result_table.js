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
      queryInterface.addColumn('student_test_results', 'career_profile_detail_id', { type: Sequelize.INTEGER, after: 'software_matrix_id', references: { model: 'career_profile_details', key: 'id' }, allowNull: true, defaultValue: null })
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
      queryInterface.removeColumn('student_test_results', 'career_profile_detail_id')
    ])
  }
}
