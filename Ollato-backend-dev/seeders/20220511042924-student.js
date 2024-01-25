'use strict'
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(1)

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('students', [{
      custom_id: 'test12345454',
      slug: 'test',
      user_name: 'zarna123',
      first_name: 'zarna',
      middle_name: 'mehulbhai',
      last_name: 'patel',
      email: 'zarna.p@gmail.com',
      mobile: '7698994724',
      OTP: '123456',
      dob: new Date('2015-03-25'),
      gender: 'female',
      father_name: 'mehulbhai',
      mother_name: 'madhuriben',
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
    return queryInterface.bulkDelete('students', null, {})
  }
}
