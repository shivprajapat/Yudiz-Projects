'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn(
        'userleagues',
        'iUserLeagueId',
        {
          type: Sequelize.STRING(24),
          allowNull: true
        }
      )
    ])
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn(
        'userleagues',
        'iUserLeagueId',
        {
          type: Sequelize.STRING(24),
          allowNull: false
        }
      )
    ])
  }
}
