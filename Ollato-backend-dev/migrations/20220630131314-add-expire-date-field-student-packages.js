'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'student_packages', // table name
        'expireDate', // new field name
        {
          type: Sequelize.DATE,
          allowNull: true,
          defaultValue: null
        }
      ),
      queryInterface.addColumn(
        'student_packages', // table name
        'isExpired', // new field name
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false
        }
      ),
      queryInterface.addColumn(
        'student_packages', // table name
        'onlineTest', // new field name
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false
        }
      ),
      queryInterface.addColumn(
        'student_packages', // table name
        'testReport', // new field name
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false
        }
      ),
      queryInterface.addColumn(
        'student_packages', // table name
        'videoCall', // new field name
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false
        }
      ),
      queryInterface.addColumn(
        'student_packages', // table name
        'f2fCall', // new field name
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false
        }
      )

    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('student_packages', 'expireDate'),
      queryInterface.removeColumn('student_packages', 'isExpired'),
      queryInterface.removeColumn('student_packages', 'onlineTest'),
      queryInterface.removeColumn('student_packages', 'videoCall'),
      queryInterface.removeColumn('student_packages', 'profile'),
      queryInterface.removeColumn('student_packages', 'f2fCall')
    ])
  }
}
