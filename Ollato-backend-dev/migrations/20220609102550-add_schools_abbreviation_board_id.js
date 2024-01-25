'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'schools', // table name
        'abbreviation', // new field name
        {
          type: Sequelize.STRING,
          after: 'title',
          allowNull: true,
          defaultValue: null
        }
      ),

      queryInterface.addColumn(
        'schools', // table name
        'board_id', // new field name
        {
          type: Sequelize.INTEGER,
          references: { model: 'boards', key: 'id' },
          after: 'city_id',
          allowNull: true,
          defaultValue: null
        }
      ),
      queryInterface.changeColumn(
        'schools', // table name
        'area', // new field name
        {
          type: Sequelize.STRING,
          after: 'address_2',
          allowNull: true,
          defaultValue: null
        }
      )
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('schools', 'abbreviation'),
      queryInterface.removeColumn('schools', 'board_id'),
      queryInterface.removeColumn('schools', 'area')
    ])
  }
}
