'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('counsellors', 'avg_ratings', { type: Sequelize.FLOAT(11), allowNull: true, after: 'mobile', max: 5 })
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('counsellors', 'avg_ratings')
    ])
  }
}
