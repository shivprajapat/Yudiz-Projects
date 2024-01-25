'use strict'
const { randomStr } = require('../helper/utilities.services')

module.exports = {
  async up (queryInterface, Sequelize) {
    const { sequelize } = queryInterface
    try {
      await sequelize.transaction(async (transaction) => {
        const options = { transaction }
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', options)
        await sequelize.query('TRUNCATE TABLE modules_permissions', options)
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', options)
      })
    } catch (error) {
      console.log(error)
    }

    await queryInterface.bulkInsert('modules_permissions', [{
      custom_id: randomStr(8, 'string'),
      module_name: 'Manage School',
      list: true,
      view: true,
      create: true,
      update: true,
      delete: true,
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    },
    {
      custom_id: randomStr(8, 'string'),
      module_name: 'Manage Grade',
      list: true,
      view: true,
      create: true,
      update: true,
      delete: true,
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    },
    {
      custom_id: randomStr(8, 'string'),
      module_name: 'Test Time Norms',
      list: true,
      view: true,
      create: true,
      update: true,
      delete: true,
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    },
    {
      custom_id: randomStr(8, 'string'),
      module_name: 'Grade Norms',
      list: true,
      view: true,
      create: true,
      update: true,
      delete: true,
      is_active: 'y',
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('modules_permissions', null, {})
  }
}
