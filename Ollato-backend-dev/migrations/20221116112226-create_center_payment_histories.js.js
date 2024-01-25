'use strict'
const { paymentStatus } = require('../data')
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('center_payment_histories', {
      id: { type: Sequelize.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      custom_id: { type: Sequelize.STRING, allowNull: true },
      center_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'centers', // 'centers' refers to table name
          key: 'id' // 'id' refers to column name in countries table
        }
      },
      package_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'packages', // 'packages' refers to table name
          key: 'id' // 'id' refers to column name in countries table
        }
      },
      razorpay_order_id: {
        type: Sequelize.STRING,
        defaultValue: false
      },
      razorpay_signature: {
        type: Sequelize.STRING,
        defaultValue: false
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
    await queryInterface.dropTable('center_payment_histories')
  }
}
