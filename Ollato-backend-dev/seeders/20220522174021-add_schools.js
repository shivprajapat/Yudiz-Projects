'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('schools', [{
      custom_id: '1',
      center_id: 1,
      title: 'school-1',
      address_1: 'bapunagar',
      address_2: 'ahmedabad',
      area: 'bapunagar',
      county_id: 103,
      state_id: 4,
      city_id: 1,
      pin_code: '380024',
      contact_name: 'school admin',
      contact_email: 'school@gmail.com',
      contact_mobile: '7698994724',
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'ollato',
      updated_by: 'ollato'
    }], {})
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('schools', null, {})
  }
}
