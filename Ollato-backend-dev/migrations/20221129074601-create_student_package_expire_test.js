'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('student_package_expire_tests', {
      id: { type: Sequelize.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      student_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'students', // 'students' refers to table name
          key: 'id' // 'id' refers to column name in counsellors table
        }
      },
      student_package_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'student_packages', // 'student_packages' refers to table name
          key: 'id' // 'id' refers to column name in counsellors table
        }
      },
      student_calc_test_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'student_calc_tests', // 'student_packages' refers to table name
          key: 'id' // 'id' refers to column name in counsellors table
        }
      },
      student_test_id: { type: Sequelize.INTEGER, allowNull: true },
      student_test: { type: Sequelize.TEXT(), allowNull: true },
      student_test_ans: { type: Sequelize.TEXT(), allowNull: true },
      student_test_norm: { type: Sequelize.TEXT(), allowNull: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: Sequelize.DATE
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('student_package_expire_tests')
  }
}
