'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.renameColumn('sessions', 'fromTime', 'from_time'),
      queryInterface.renameColumn('sessions', 'toTime', 'to_time'),
      queryInterface.renameColumn('sessions', 'createdAt', 'created_at'),
      queryInterface.renameColumn('sessions', 'updatedAt', 'updated_at')
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.renameColumn('sessions', 'fromTime', 'from_time'),
      queryInterface.renameColumn('sessions', 'toTime', 'to_time'),
      queryInterface.renameColumn('sessions', 'createdAt', 'created_at'),
      queryInterface.renameColumn('sessions', 'updatedAt', 'updated_at')
    ])
  }
}
