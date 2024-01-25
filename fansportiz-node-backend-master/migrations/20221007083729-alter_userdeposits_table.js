'use strict'
const { paymentGetaways } = require('../data')

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.al('users', { id: Sequelize.INTEGER });
     */

    return Promise.all([
      queryInterface.changeColumn('userdeposits', 'ePaymentGateway',
        { type: Sequelize.ENUM(paymentGetaways), defaultValue: 'PAYTM', comment: 'PAYTM, ADMIN, PAYBROKERS, CASHFREE, CASHFREE_UPI, BAMBORA' })
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
      queryInterface.changeColumn('userdeposits', 'ePaymentGateway',
        { type: Sequelize.ENUM(paymentGetaways), defaultValue: 'PAYTM', comment: 'PAYTM, ADMIN, PAYBROKERS, CASHFREE, CASHFREE_UPI' })
    ])
  }
}
