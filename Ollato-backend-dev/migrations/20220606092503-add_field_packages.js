'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'packages', // table name
        'package_number', // new field name
        {
          type: Sequelize.INTEGER,
          defaultValue: null
        }
      ),
      queryInterface.addColumn(
        'packages', // table name
        'package_type', // new field name
        {
          type: Sequelize.ENUM('subcription', 'addon'),
          defaultValue: 'subcription'
        }
      ),
      queryInterface.addColumn(
        'packages', // table name
        'online_test', // new field name
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }
      ),
      queryInterface.addColumn(
        'packages', // table name
        'test_report', // new field name
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }
      ),
      queryInterface.addColumn(
        'packages', // table name
        'video_call', // new field name
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }
      ),
      queryInterface.addColumn(
        'packages', // table name
        'f2f_call', // new field name
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        }
      )
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('packages', 'package_number'),
      queryInterface.removeColumn('packages', 'package_type'),
      queryInterface.removeColumn('packages', 'online_test'),
      queryInterface.removeColumn('packages', 'test_report'),
      queryInterface.removeColumn('packages', 'video_call'),
      queryInterface.removeColumn('packages', 'f2f_call')
    ])
  }
}
