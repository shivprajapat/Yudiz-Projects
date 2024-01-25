'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'boards', // table name
        'deleted_at', // new field name
        {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null
        }
      )
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('boards', 'deleted_at')
    ])
  }
}
