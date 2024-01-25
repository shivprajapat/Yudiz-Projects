'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.renameColumn('time_slots', 'fromTime', 'from_time'),
      queryInterface.renameColumn('time_slots', 'toTime', 'to_time'),
      queryInterface.renameColumn('time_slots', 'createdAt', 'created_at'),
      queryInterface.renameColumn('time_slots', 'updatedAt', 'updated_at')
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.renameColumn('time_slots', 'fromTime', 'from_time'),
      queryInterface.renameColumn('time_slots', 'toTime', 'to_time'),
      queryInterface.renameColumn('time_slots', 'createdAt', 'created_at'),
      queryInterface.renameColumn('time_slots', 'updatedAt', 'updated_at')
    ])
  }
}
