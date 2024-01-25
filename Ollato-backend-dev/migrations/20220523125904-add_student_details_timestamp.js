'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'student_details', // table name
        'createdAt', // new field name
        {
          type: Sequelize.DATE,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'student_details', // table name
        'updatedAt', // new field name
        {
          type: Sequelize.DATE,
          allowNull: true
        }
      )
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('student_details', 'created_at'),
      queryInterface.removeColumn('student_details', 'updated_at')
    ])
  }
}
