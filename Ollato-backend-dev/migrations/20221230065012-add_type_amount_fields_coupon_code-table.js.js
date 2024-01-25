'use strict'
const { couponType } = require('../data')

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.addColumn('coupon_code', 'coupon_type', { type: Sequelize.ENUM(couponType), after: 'to_date' }),
      await queryInterface.addColumn('coupon_code', 'amount_percentage', { type: Sequelize.INTEGER(11), after: 'coupon_type' })
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.removeColumn('coupon_code', 'type'),
      await queryInterface.removeColumn('coupon_code', 'amount_percentage')
    ])
  }
}
