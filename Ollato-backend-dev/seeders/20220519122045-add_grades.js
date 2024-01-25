'use strict'
const { randomStr } = require('../helper/utilities.services')

module.exports = {
  async up (queryInterface, Sequelize) {
    /* Trucate data before inster data */
    /* START */
    const { sequelize } = queryInterface
    try {
      await sequelize.transaction(async (transaction) => {
        const options = { transaction }
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', options)
        await sequelize.query('TRUNCATE TABLE grades', options)
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', options)
      })
    } catch (error) {
      console.log(error)
    }
    /* END */

    await queryInterface.bulkInsert('grades', [{
      custom_id: randomStr(8, 'string'),
      title: 'IX',
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    },
    {
      custom_id: randomStr(8, 'string'),
      title: 'X',
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    },
    {
      custom_id: randomStr(8, 'string'),
      title: 'XI',
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    },
    {
      custom_id: randomStr(8, 'string'),
      title: 'XII',
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    }], {})
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('grades', null, {})
  }
}
