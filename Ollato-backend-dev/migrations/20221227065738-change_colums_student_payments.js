'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      // Student Package table
      queryInterface.addColumn('student_packages', 'transaction_id', { type: Sequelize.STRING(), defaultValue: false, allowNull: true, after: 'payment_status' }),
      queryInterface.renameColumn('student_packages', 'razorpay_order_id', 'order_id'),

      // For student payment histories
      queryInterface.renameColumn('student_payment_histories', 'razorpay_order_id', 'order_id'),
      queryInterface.renameColumn('student_payment_histories', 'razorpay_signature', 'order_signature')
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
      queryInterface.removeColumn('student_packages', 'transaction_id'),
      queryInterface.renameColumn('student_packages', 'order_id', 'razorpay_order_id'),
      queryInterface.renameColumn('student_payment_histories', 'order_id', 'razorpay_order_id'),
      queryInterface.renameColumn('student_payment_histories', 'order_signature', 'razorpay_signature')
    ])
  }
}
