'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'students', // table name
        'token', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      )
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('students', 'token')
    ])
  }
}
