'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('student_packages', 'custom_id', { type: Sequelize.STRING(), allowNull: true }),
      queryInterface.addColumn(
        'student_packages', // table name
        'center_id', // new field name
        {
          type: Sequelize.STRING,
          after: 'custom_id',
          allowNull: true
        }
      )
    ])
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('student_packages', 'center_id')
  }
}
