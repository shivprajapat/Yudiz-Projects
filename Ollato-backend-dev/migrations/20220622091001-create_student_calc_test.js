'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('student_calc_tests', {
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
      package_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'packages', // 'packages' refers to table name
          key: 'id' // 'id' refers to column name in grades table
        }
      },
      student_package_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'student_packages', // 'student_packages' refers to table name
          key: 'id' // 'id' refers to column name in student_packages table
        }
      },
      start_time: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      is_submitted: { type: Sequelize.BOOLEAN, defaultValue: false },
      submission_Time: { type: Sequelize.DATE, allowNull: true, defaultValue: null },
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
    await queryInterface.dropTable('student_calc_tests')
  }
}
