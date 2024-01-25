'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        'admin_password_resets', // table name
        'OTP', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      )
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('admin_password_resets', 'OTP')
    ])
  }
}
