'use strict'
const { userLeagueTransactionType, category } = require('../data')

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'userleagues',
        'eTransactionType',
        {
          type: Sequelize.ENUM(userLeagueTransactionType),
          defaultValue: 'Win'
        }
      ),
      queryInterface.addIndex('userleagues', ['iMatchLeagueId', 'eTransactionType'], { name: 'userleagues_transaction_type' }),
      queryInterface.addColumn(
        'userleagues',
        'eCategory',
        {
          type: Sequelize.ENUM(category),
          defaultValue: 'CRICKET'
        }
      )
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('userleagues', 'eTransactionType'),
      queryInterface.removeIndex('userleagues', ['iMatchLeagueId', 'eTransactionType'], { name: 'userleagues_transaction_type' }),
      queryInterface.removeColumn('userleagues', 'eCategory')

    ])
  }
}
