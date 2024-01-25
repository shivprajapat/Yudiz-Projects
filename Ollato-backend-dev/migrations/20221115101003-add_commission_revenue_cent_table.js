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
      queryInterface.addColumn('centers', 'total_amount', { type: Sequelize.FLOAT(), defaultValue: '0.00', after: 'password' }),
      queryInterface.addColumn('centers', 'redeem_amount', { type: Sequelize.FLOAT(), defaultValue: '0.00', after: 'total_amount' }),
      queryInterface.addColumn('centers', 'remaining_amount', { type: Sequelize.FLOAT(), defaultValue: '0.00', after: 'redeem_amount' }),
      queryInterface.addColumn('centers', 'commission', { type: Sequelize.FLOAT(), defaultValue: '0.00', after: 'remaining_amount' })
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
      queryInterface.removeColumn('centers', 'total_amount'),
      queryInterface.removeColumn('centers', 'redeem_amount'),
      queryInterface.removeColumn('centers', 'remaining_amount'),
      queryInterface.removeColumn('centers', 'commission')
    ])
  }
}
