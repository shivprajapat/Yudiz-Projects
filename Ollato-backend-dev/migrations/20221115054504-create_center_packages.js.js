'use strict'
const { packageType, paymentStatus } = require('../data')
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('center_packages', {
      id: { type: Sequelize.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      custom_id: { type: Sequelize.STRING(), allowNull: false },
      center_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'centers', // 'students' refers to table name
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
      payment_status: { type: Sequelize.ENUM(paymentStatus), defaultValue: 'P' }, // P = pending, S = success, C = cancelled, R = refunded
      razorpay_order_id: { type: Sequelize.STRING(), allowNull: true },
      purchase_date: Sequelize.DATE,
      invoice_path: { type: Sequelize.STRING, allowNull: true, defaultValue: null },
      total_packages: { type: Sequelize.INTEGER(11), allowNull: true },
      assigned_packages: { type: Sequelize.INTEGER(11), allowNull: true },
      remaining_packages: { type: Sequelize.INTEGER(11), allowNull: true },
      total_amount: { type: Sequelize.INTEGER(11), allowNull: true },
      package_amount: { type: Sequelize.INTEGER(11), allowNull: true },
      gst_amount: { type: Sequelize.INTEGER(11), allowNull: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: Sequelize.DATE
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('center_packages')
  }
}
