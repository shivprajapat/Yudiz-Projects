'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'userleagues',
        'sRemarks',
        {
          type: Sequelize.TEXT
        }
      ),
      queryInterface.addColumn(
        'userleagues',
        'dBonusExpiryDate',
        {
          type: Sequelize.DATE
        }
      )
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('userleagues', 'sRemarks'),
      queryInterface.removeColumn('userleagues', 'dBonusExpiryDate')
    ])
  }
}
