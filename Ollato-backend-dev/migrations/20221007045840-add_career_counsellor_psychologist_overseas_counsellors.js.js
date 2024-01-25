'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('counsellors', 'career_counsellor', { type: Sequelize.STRING(), allowNull: true, after: 'mobile' }),
      queryInterface.addColumn('counsellors', 'psychologist', { type: Sequelize.STRING(), allowNull: true, after: 'career_counsellor' }),
      queryInterface.addColumn('counsellors', 'overseas_counsellor', { type: Sequelize.STRING(), allowNull: true, after: 'psychologist' })
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('counsellors', 'career_counsellor'),
      queryInterface.removeColumn('counsellors', 'psychologist'),
      queryInterface.removeColumn('counsellors', 'overseas_counsellor')
    ])
  }
}
