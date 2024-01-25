'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'counsellor_revenue', // table name
        'counsellor_id', // new field name
        {
          type: Sequelize.INTEGER,
          after: 'custom_id',
          references: { model: 'counsellors', key: 'id' },
          allowNull: true
        }
      )
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('counsellor_revenue', 'counsellor_id')
    ])
  }
}
