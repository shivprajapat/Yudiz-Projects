'use strict'
const { couponType } = require('../data')

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      await queryInterface.addColumn('center_packages', 'final_amount', { type: Sequelize.FLOAT, after: 'total_amount', allowNull: true }),
      await queryInterface.addColumn('center_packages', 'coupon_code', { type: Sequelize.STRING, after: 'final_amount', allowNull: true }),
      await queryInterface.addColumn('center_packages', 'coupon_type', { type: Sequelize.ENUM(couponType), after: 'coupon_code', allowNull: true }),
      await queryInterface.addColumn('center_packages', 'amount_percentage', { type: Sequelize.INTEGER(11), after: 'coupon_type', allowNull: true })
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
      await queryInterface.removeColumn('center_packages', 'final_amount'),
      await queryInterface.removeColumn('center_packages', 'coupon_code'),
      await queryInterface.removeColumn('center_packages', 'coupon_type'),
      await queryInterface.removeColumn('center_packages', 'amount_percentage')
    ])
  }
}
