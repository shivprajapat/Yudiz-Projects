'use strict'
const { randomStr } = require('../helper/utilities.services')

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
    const { sequelize } = queryInterface
    try {
      await sequelize.transaction(async (transaction) => {
        const options = { transaction }
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', options)
        await sequelize.query('TRUNCATE TABLE tests', options)
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', options)
      })
    } catch (error) {
      console.log(error)
    }
    await queryInterface.bulkInsert('tests', [{
      custom_id: randomStr(8, 'string'),
      title: 'Aptitude Test',
      is_active: 'y',
      sort_order: 0,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    },
    {
      custom_id: randomStr(8, 'string'),
      title: 'Interest Test',
      description: '<p>Mentioned below are some activities that one would like to do or not like to do. Read each activity carefully and click on ‘Yes’ if you would like to do the activity. Or click on ‘No’ if you would not like to do it.</p><p>And mentioned below are a number of skills which you would be able to acquire competently. Click on ‘Yes’ for those skills that you think you would be able to do well. And click on ‘No’ for those skills which you think you wouldn’t be able to perform well enough.</p>',
      is_active: 'y',
      sort_order: 1,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('tests', null, {})
  }
}
