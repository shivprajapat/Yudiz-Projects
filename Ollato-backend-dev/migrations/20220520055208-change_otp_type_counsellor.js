'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('counsellors', 'OTP', {
        type: Sequelize.STRING,
        allowNull: true
      })
    ])
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn('counsellors', 'OTP', {
        type: Sequelize.INTEGER,
        allowNull: true
      })
    ])
  }
}
