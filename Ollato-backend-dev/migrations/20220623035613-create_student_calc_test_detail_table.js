'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('student_calc_test_details', {
      id: { type: Sequelize.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      custom_id: { type: Sequelize.STRING(), allowNull: true },
      student_calc_test_id: { type: Sequelize.INTEGER, references: { model: 'student_calc_tests', key: 'id' }, allowNull: false },
      student_test_id: { type: Sequelize.INTEGER, references: { model: 'student_tests', key: 'id' }, allowNull: false },
      test_id: { type: Sequelize.INTEGER, references: { model: 'tests', key: 'id' }, allowNull: false },
      test_detail_id: { type: Sequelize.INTEGER, references: { model: 'test_details', key: 'id' }, allowNull: false },
      marks_obtained: { type: Sequelize.INTEGER(11), defaultValue: '0' },
      test_abb: { type: Sequelize.STRING(), allowNull: false },
      converted_score: { type: Sequelize.FLOAT(11), defaultValue: '0' },
      sten_scores: { type: Sequelize.FLOAT(11), defaultValue: '0' },
      score_round: { type: Sequelize.INTEGER(11), defaultValue: '0' },
      out_of_score: { type: Sequelize.INTEGER(11), defaultValue: '0' },
      rank: { type: Sequelize.INTEGER(11), defaultValue: '0' },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: Sequelize.DATE,
      deleted_at: { type: Sequelize.DATE, allowNull: true, defaultValue: null }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('student_calc_test_details')
  }
}
