'use strict'
const { counsellorStatus } = require('../data')

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.addColumn('counsellors', 'subject_expert', { type: Sequelize.STRING(), defaultValue: '0', after: 'overseas_counsellor' }),
      queryInterface.addColumn('counsellors', 'status', { type: Sequelize.ENUM(counsellorStatus), defaultValue: 'pending', allowNull: true, after: 'is_active' }),
      queryInterface.addColumn('counsellors', 'total_amount', { type: Sequelize.FLOAT(), defaultValue: '0.00', after: 'status' }),
      queryInterface.addColumn('counsellors', 'redeem_amount', { type: Sequelize.FLOAT(), defaultValue: '0.00', after: 'total_amount' }),
      queryInterface.addColumn('counsellors', 'remaining_amount', { type: Sequelize.FLOAT(), defaultValue: '0.00', after: 'redeem_amount' }),
      queryInterface.addColumn('counsellors', 'commission', { type: Sequelize.FLOAT(), defaultValue: '0.00', after: 'remaining_amount' })
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
      queryInterface.removeColumn('counsellors', 'subject_expert'),
      queryInterface.removeColumn('counsellors', 'status'),
      queryInterface.removeColumn('counsellors', 'total_amount'),
      queryInterface.removeColumn('counsellors', 'redeem_amount'),
      queryInterface.removeColumn('counsellors', 'remaining_amount'),
      queryInterface.removeColumn('counsellors', 'commission')
    ])
  }
}
