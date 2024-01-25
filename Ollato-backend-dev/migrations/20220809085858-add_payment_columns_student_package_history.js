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
      queryInterface.addColumn('student_payment_histories', 'razorpay_order_id', { type: Sequelize.STRING(), allowNull: true, after: 'transaction_id' }),
      queryInterface.addColumn('student_payment_histories', 'razorpay_signature', { type: Sequelize.STRING(), allowNull: true, after: 'razorpay_order_id' })
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
      queryInterface.removeColumn('student_payment_histories', 'razorpay_order_id'),
      queryInterface.removeColumn('student_payment_histories', 'razorpay_signature')
    ])
  }
}
