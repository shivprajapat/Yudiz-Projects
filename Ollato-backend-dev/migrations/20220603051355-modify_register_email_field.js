'use strict'
module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.renameColumn('register_email_verifies', 'email', 'email_mobile')
    ])
  },
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.renameColumn('register_email_verifies', 'email_mobile', 'email')
    ])
  }
}
