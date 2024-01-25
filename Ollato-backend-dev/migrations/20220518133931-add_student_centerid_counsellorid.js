'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'students', // table name
        'center_id', // new field name
        {
          type: Sequelize.INTEGER,
          after: 'custom_id',
          references: { model: 'centers', key: 'id' },
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'students', // table name
        'counselor_id', // new field name
        {
          type: Sequelize.INTEGER,
          after: 'center_id',
          references: { model: 'counsellors', key: 'id' },
          allowNull: true
        }
      )
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('students', 'center_id'),
      queryInterface.removeColumn('students', 'counselor_id')
    ])
  }
}
