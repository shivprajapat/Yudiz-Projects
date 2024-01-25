'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'center_packages', // table name
        'onlineTest', // new field name
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
          after: 'gst_amount'
        }
      ),
      queryInterface.addColumn(
        'center_packages', // table name
        'testReport', // new field name
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
          after: 'onlineTest'
        }
      ),
      queryInterface.addColumn(
        'center_packages', // table name
        'videoCall', // new field name
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
          after: 'testReport'
        }
      ),
      queryInterface.addColumn(
        'center_packages', // table name
        'f2fCall', // new field name
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
          after: 'videoCall'
        }
      )

    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('center_packages', 'onlineTest'),
      queryInterface.removeColumn('center_packages', 'videoCall'),
      queryInterface.removeColumn('center_packages', 'profile'),
      queryInterface.removeColumn('center_packages', 'f2fCall')
    ])
  }
}
