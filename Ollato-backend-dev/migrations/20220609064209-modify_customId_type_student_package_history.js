'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn(
        'student_payment_histories', // table name
        'custom_id', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      )
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn(
        'student_payment_histories', // table name
        'custom_id', // new field name
        {
          type: Sequelize.INTEGER(11)
        }
      )
    ])
  }
}
