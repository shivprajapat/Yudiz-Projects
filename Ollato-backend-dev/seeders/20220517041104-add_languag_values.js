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
    return queryInterface.bulkInsert('languages', [{
      code: 'en',
      title: 'English',
      is_active: 'y', // y = Active, n = Inactive
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      code: 'hi',
      title: 'Hindi',
      is_active: 'y', // y = Active, n = Inactive
      created_at: new Date(),
      updated_at: new Date()
    }])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete('languages', null, {})
  }
}
