'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'centers', // table name
        'country_id', // new field name
        {
          type: Sequelize.INTEGER,
          after: 'state_id',
          references: { model: 'countries', key: 'id' },
          allowNull: true
        }
      )
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('centers', 'country_id')
    ])
  }
}
