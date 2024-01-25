'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'centers', // table name
        'profile', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      )
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('centers', 'profile')
    ])
  }
}
