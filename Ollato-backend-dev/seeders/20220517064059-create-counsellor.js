'use strict'
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(1)

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('counsellors', [{
      custom_id: 'test123',
      slug: 'test',
      user_name: 'parth007',
      first_name: 'parth',
      middle_name: 'k',
      last_name: 'panchal',
      email: 'parth.panchal@yudiz.com',
      mobile: '8980422681',
      OTP: null,
      dob: new Date(),
      gender: 'male',
      password: bcrypt.hashSync('Parth@123', salt),
      is_active: 'y', // y = Active, n = Inactive
      is_verify: 'y',
      verified_at: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    }], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('counselors', null, {})
  }
}
