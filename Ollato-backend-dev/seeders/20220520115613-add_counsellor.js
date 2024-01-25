'use strict'
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(1)
const { randomStr } = require('../helper/utilities.services')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('counsellors', [{
      custom_id: randomStr(8, 'string'),
      center_id: 1,
      slug: 'counsellor-1',
      user_name: 'counsellor-1',
      first_name: 'zarna',
      middle_name: 'mehulbhai',
      last_name: 'patel',
      email: 'zarna.p@gmail.com',
      mobile: '7698994724',
      OTP: randomStr(4, 'otp'),
      dob: new Date(),
      gender: 'female',
      password: bcrypt.hashSync('Zarna@123', salt),
      is_active: 'y',
      is_verify: 'y',
      verified_at: new Date(),
      created_by: 'zarna',
      updated_by: 'zarna',
      token: ''
    }], {})
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('counsellors', null, {})
  }
}
