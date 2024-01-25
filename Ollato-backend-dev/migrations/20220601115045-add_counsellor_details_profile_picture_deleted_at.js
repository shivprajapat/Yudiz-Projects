'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'counsellor_details', // table name
        'profile_picture', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      ),
      queryInterface.addColumn(
        'counsellor_details', // table name
        'deleted_at', // new field name
        {
          type: Sequelize.DATE,
          allowNull: true
        }
      )
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('counsellor_details', 'profile_picture'),
      queryInterface.removeColumn('counsellor_details', 'deleted_at')
    ])
  }
}
