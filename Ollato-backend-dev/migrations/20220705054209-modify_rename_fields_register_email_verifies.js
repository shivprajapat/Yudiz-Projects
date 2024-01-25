'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.renameColumn('register_email_verifies', 'createdAt', 'created_at'),
      queryInterface.renameColumn('register_email_verifies', 'updatedAt', 'updated_at')
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.renameColumn('register_email_verifies', 'createdAt', 'created_at'),
      queryInterface.renameColumn('register_email_verifies', 'updatedAt', 'updated_at')
    ])
  }
}
