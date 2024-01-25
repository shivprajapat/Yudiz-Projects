'use strict'
const { packageType } = require('../data')
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('student_packages', {
      id: { type: Sequelize.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      custom_id: { type: Sequelize.INTEGER(11), allowNull: false },
      student_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'students', // 'students' refers to table name
          key: 'id' // 'id' refers to column name in countries table
        }
      },
      package_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'packages', // 'students' refers to table name
          key: 'id' // 'id' refers to column name in countries table
        }
      },
      package_type: { type: Sequelize.ENUM(packageType), defaultValue: 'subcription' }, // Y = Active, N = Inactive
      purchase_date: Sequelize.DATE,
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: Sequelize.DATE

    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('student_packages')
  }
}
