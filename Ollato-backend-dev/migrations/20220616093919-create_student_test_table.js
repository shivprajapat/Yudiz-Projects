'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('student_tests', {
      id: { type: Sequelize.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      custom_id: { type: Sequelize.STRING(), allowNull: true },
      student_id: { type: Sequelize.INTEGER, references: { model: 'students', key: 'id' }, allowNull: false },
      grade_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'grades', // 'grades' refers to table name
          key: 'id' // 'id' refers to column name in grades table
        }
      },
      test_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tests', // 'tests' refers to table name
          key: 'id' // 'id' refers to column name in tests table
        }
      },
      test_detail_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'test_details', // 'test_details' refers to table name
          key: 'id' // 'id' refers to column name in test_details table
        }
      },
      start_time: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      is_submitted: { type: Sequelize.BOOLEAN, defaultValue: false },
      submission_Time: { type: Sequelize.DATE, allowNull: true, defaultValue: null },
      marks_obtained: { type: Sequelize.INTEGER(11), defaultValue: '0' },
      marks_wrong: { type: Sequelize.INTEGER(11), defaultValue: '0' },
      not_attempted: { type: Sequelize.INTEGER(11), defaultValue: '0' },
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
    await queryInterface.dropTable('student_tests')
  }
}
