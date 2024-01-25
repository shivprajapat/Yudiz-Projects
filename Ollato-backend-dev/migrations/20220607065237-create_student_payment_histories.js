'use strict'
const { paymentStatus } = require('../data')
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('student_payment_histories', {
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
      transaction_id: {
        type: Sequelize.STRING,
        defaultValue: false
      },
      amount: {
        type: Sequelize.FLOAT,
        defaultValue: false
      },
      status: { type: Sequelize.ENUM(paymentStatus), defaultValue: 'P' },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: Sequelize.DATE

    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('student_payment_histories')
  }
}
