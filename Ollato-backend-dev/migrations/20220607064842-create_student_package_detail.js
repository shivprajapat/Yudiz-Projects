'use strict'
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('student_package_detail', {
      id: { type: Sequelize.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      custom_id: { type: Sequelize.INTEGER(11), allowNull: false },
      student_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'students', // 'students' refers to table name
          key: 'id' // 'id' refers to column name in countries table
        }
      },
      online_test: {
        type: Sequelize.INTEGER,
        defaultValue: false
      },
      test_report:
      {
        type: Sequelize.INTEGER,
        defaultValue: false
      },
      video_call: {
        type: Sequelize.INTEGER,
        defaultValue: false
      },
      f2f_call: {
        type: Sequelize.INTEGER,
        defaultValue: false
      },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: Sequelize.DATE

    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('student_package_detail')
  }
}
