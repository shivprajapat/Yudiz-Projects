'use strict'
const { randomStr } = require('../helper/utilities.services')

module.exports = {
  async up (queryInterface, Sequelize) {
    const { sequelize } = queryInterface
    try {
      await sequelize.transaction(async (transaction) => {
        const options = { transaction }
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', options)
        await sequelize.query('TRUNCATE TABLE states', options)
        await sequelize.query('SET FOREIGN_KEY_CHECKS = 1', options)
      })
    } catch (error) {
      console.log(error)
    }

    await queryInterface.bulkInsert('states', [
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Andaman and Nicobar Islands', abbreviation: 'AN', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Andhra Pradesh', abbreviation: 'AP', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Arunachal Pradesh', abbreviation: 'ARP', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Assam', abbreviation: 'AS', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Bihar', abbreviation: 'BH', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Chandigarh', abbreviation: 'CHG', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Dadra and Nagar Haveli', abbreviation: 'DNH', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Delhi', abbreviation: 'DL', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Goa', abbreviation: 'GA', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Gujarat', abbreviation: 'GJ', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Haryana', abbreviation: 'HR', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Himachal Pradesh', abbreviation: 'HP', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Jammu and Kashmir', abbreviation: 'JK', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Jharkhand', abbreviation: 'JHR', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Karnataka', abbreviation: 'KR', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Kerala', abbreviation: 'KRL', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Madhya Pradesh', abbreviation: 'MP', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Maharashtra', abbreviation: 'MH', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Manipur', abbreviation: 'MN', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Meghalaya', abbreviation: 'MG', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Mizoram', abbreviation: 'MZ', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Nagaland', abbreviation: 'NG', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Odisha', abbreviation: 'OD', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Puducherry', abbreviation: 'PD', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Punjab', abbreviation: 'PN', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Rajasthan', abbreviation: 'RJ', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Tamil Nadu', abbreviation: 'TN', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Telangana', abbreviation: 'TL', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Tripura', abbreviation: 'TP', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Uttar Pradesh', abbreviation: 'UP', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'Uttarakhand', abbreviation: 'UT', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' },
      { custom_id: randomStr(8, 'string'), county_id: 103, title: 'West Bengal', abbreviation: 'WB', is_active: 'y', created_at: new Date(), updated_at: new Date(), created_by: 'admin', updated_by: 'admin' }
    ], {})
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('states', null, {})
  }
}
