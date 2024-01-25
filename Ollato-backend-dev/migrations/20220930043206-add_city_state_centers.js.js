'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('centers', 'city_id', { type: Sequelize.INTEGER(11), references: { model: 'cities', key: 'id' }, allowNull: true, after: 'user_name' }),
      queryInterface.addColumn('centers', 'state_id', { type: Sequelize.INTEGER(11), references: { model: 'states', key: 'id' }, allowNull: true, after: 'city_id' })
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('centers', 'city_id'),
      queryInterface.removeColumn('centers', 'state_id')
    ])
  }
}
