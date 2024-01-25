'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('boards', [{
      custom_id: '1',
      title: 'school-1',
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'ollato',
      updated_by: 'ollato'
    }], {})
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('boards', null, {})
  }
}
