'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('student_test_ans', {
      id: { type: Sequelize.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      custom_id: { type: Sequelize.STRING(), allowNull: true },
      student_id: { type: Sequelize.INTEGER, references: { model: 'students', key: 'id' }, allowNull: false },
      student_test_id: { type: Sequelize.INTEGER, references: { model: 'student_tests', key: 'id' }, allowNull: false },
      question_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'questions', // 'questions' refers to table name
          key: 'id' // 'id' refers to column name in questions table
        }
      },
      question_ans_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'question_ans', // 'grades' refers to table name
          key: 'id' // 'id' refers to column name in grades table
        }
      },
      is_correct_ans: { type: Sequelize.BOOLEAN, defaultValue: false },
      marks_obtained: { type: Sequelize.INTEGER(11), defaultValue: '0' },
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
    await queryInterface.dropTable('student_test_ans')
  }
}
