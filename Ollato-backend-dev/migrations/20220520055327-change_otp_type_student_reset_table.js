'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('student_password_resets', 'otp', {
        type: Sequelize.STRING,
        allowNull: true
      })
    ])
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('student_password_resets', 'otp', {
        type: Sequelize.INTEGER,
        allowNull: true
      })
    ])
  }
}
