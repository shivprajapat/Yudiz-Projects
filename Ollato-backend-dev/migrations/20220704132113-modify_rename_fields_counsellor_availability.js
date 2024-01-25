'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.renameColumn('counsellor_availabilities', 'timeSlot_id', 'time_slot_id'),
      queryInterface.renameColumn('counsellor_availabilities', 'fromTime', 'from_time'),
      queryInterface.renameColumn('counsellor_availabilities', 'toTime', 'to_time'),
      queryInterface.renameColumn('counsellor_availabilities', 'createdAt', 'created_at'),
      queryInterface.renameColumn('counsellor_availabilities', 'updatedAt', 'updated_at')
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.renameColumn('counsellor_availabilities', 'timeSlot_id',
        'time_slot_id'),
      queryInterface.renameColumn('counsellor_availabilities', 'fromTime', 'from_time'),
      queryInterface.renameColumn('counsellor_availabilities', 'toTime', 'to_time'),
      queryInterface.renameColumn('counsellor_availabilities', 'createdAt', 'created_at'),
      queryInterface.renameColumn('counsellor_availabilities', 'updatedAt', 'updated_at')
    ])
  }
}
