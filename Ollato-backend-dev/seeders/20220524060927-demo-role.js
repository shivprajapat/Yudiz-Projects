'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    return queryInterface.bulkInsert('roles', [{
      custom_id: 'role1',
      title: 'sub-admin',
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    },
    {
      custom_id: 'role2',
      title: 'head',
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    }])
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('roles', null, {})
  }
}
