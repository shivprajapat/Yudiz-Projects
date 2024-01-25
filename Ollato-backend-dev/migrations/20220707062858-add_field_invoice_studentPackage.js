'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'student_packages', // table name
        'invoice_path', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: null
        }
      )
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('student_packages', 'invoice_path')
    ])
  }
}
