'use strict'
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('time_slots', [{
      from_time: '9:00:00',
      to_time: '10:00:00',
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    },
    {
      from_time: '10:00:00',
      to_time: '11:00:00',
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    },
    {
      from_time: '11:00:00',
      to_time: '12:00:00',
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    },
    {
      from_time: '12:00:00',
      to_time: '13:00:00',
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    },
    {
      from_time: '13:00:00',
      to_time: '14:00:00',
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    },
    {
      from_time: '14:00:00',
      to_time: '15:00:00',
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    },
    {
      from_time: '15:00:00',
      to_time: '16:00:00',
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    },
    {
      from_time: '16:00:00',
      to_time: '17:00:00',
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    },
    {
      from_time: '17:00:00',
      to_time: '18:00:00',
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('time_slots', null, {})
  }
}
