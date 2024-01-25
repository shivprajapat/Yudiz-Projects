'use strict'
const { paymentStatus } = require('../data')
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.addColumn('student_packages', 'payment_status', { type: Sequelize.ENUM(paymentStatus), allowNull: true, defaultValue: 'P', after: 'package_type' }),
      queryInterface.addColumn('student_packages', 'razorpay_order_id', { type: Sequelize.STRING(), allowNull: true, after: 'payment_status' })
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.removeColumn('student_packages', 'payment_status'),
      queryInterface.removeColumn('student_packages', 'razorpay_order_id')
    ])
  }
}
