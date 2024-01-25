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
        await sequelize.query('TRUNCATE TABLE packages', options)
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', options)
      })
    } catch (error) {
      console.log(error)
    }
    /* END */
    await queryInterface.bulkInsert('packages', [{
      custom_id: randomStr(8, 'string'),
      title: '3999 - Online Testing, Report Generation',
      amount: 3999,
      description: '<p>- Ollato Career Assessment</p><p>- Detailed Career Assessment Report</p><p>- 3 prospective career paths along with Career portfolios</p>',
      sort_order: 0,
      is_active: 'y', // y = Active, n = Inactive
      package_number: 1,
      package_type: 'subcription',
      online_test: true,
      test_report: true,
      video_call: false,
      f2f_call: false,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    },
    {
      custom_id: randomStr(8, 'string'),
      title: '6499 - Online Testing, Report Generation, Virtual Counseling',
      amount: 6499,
      description: '<p>- Ollato Career Assessment</p><p>- Detailed Career Assessment Report</p><p>- 3 prospective career paths along with Career portfolios</p><p>- An Online video counselling session</p>',
      sort_order: 1,
      is_active: 'y', // y = Active, n = Inactive
      package_number: 0,
      package_type: 'subcription',
      online_test: true,
      test_report: true,
      video_call: true,
      f2f_call: false,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    },
    {
      custom_id: randomStr(8, 'string'),
      title: '8999 - Online Testing, Report Generation, F2F Counseling',
      amount: 8999,
      description: '<p>- Ollato Career Assessment</p><p>- Detailed Career Assessment Report</p><p>- 3 prospective career paths along with Career portfolios</p><p>- A Face to Face counselling session</p>',
      sort_order: 3,
      is_active: 'y', // y = Active, n = Inactive
      package_number: 2,
      package_type: 'subcription',
      online_test: true,
      test_report: true,
      video_call: false,
      f2f_call: true,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    },
    {
      custom_id: randomStr(8, 'string'),
      title: '499- Add on counseling for only virtual counseling ',
      amount: 499,
      description: 'test description',
      sort_order: 1,
      is_active: 'y', // y = Active, n = Inactive
      package_number: 0,
      package_type: 'addon',
      online_test: false,
      test_report: false,
      video_call: true,
      f2f_call: false,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    },
    {
      custom_id: randomStr(8, 'string'),
      title: '999- Add on counseling for only F2F counseling',
      amount: 999,
      description: 'test description',
      sort_order: 1,
      is_active: 'y', // y = Active, n = Inactive
      package_number: 0,
      package_type: 'addon',
      online_test: false,
      test_report: false,
      video_call: false,
      f2f_call: true,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin'
    }]
    , {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('packages', null, {})
  }
}
