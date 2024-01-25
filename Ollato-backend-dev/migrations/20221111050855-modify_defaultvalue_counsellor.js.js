'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('counsellors', 'career_counsellor', { type: Sequelize.STRING(), defaultValue: '0' }),
      queryInterface.changeColumn('counsellors', 'psychologist', { type: Sequelize.STRING(), defaultValue: '0' }),
      queryInterface.changeColumn('counsellors', 'overseas_counsellor', { type: Sequelize.STRING(), defaultValue: '0' })
    ])
  },

  async down (queryInterface, Sequelize) {
  }
}
