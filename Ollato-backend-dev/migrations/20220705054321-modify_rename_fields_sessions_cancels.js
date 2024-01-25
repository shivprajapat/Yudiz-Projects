'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.renameColumn('sessions_cancels', 'createdAt', 'created_at'),
      queryInterface.renameColumn('sessions_cancels', 'updatedAt', 'updated_at')
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.renameColumn('sessions_cancels', 'createdAt', 'created_at'),
      queryInterface.renameColumn('sessions_cancels', 'updatedAt', 'updated_at')
    ])
  }
}
