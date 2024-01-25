'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn(
        'schools', // table name
        'center_id', // new field name
        {
          type: Sequelize.INTEGER(11),
          allowNull: true
        }
      )
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn(
        'schools', // table name
        'center_id', // new field name
        {
          type: Sequelize.INTEGER(11)
        }
      )
    ])
  }
}
