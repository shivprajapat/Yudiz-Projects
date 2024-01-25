'use strict'
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(1)

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('admins', [{
      custom_id: 'test123',
      slug: 'test',
      user_name: 'parth007',
      first_name: 'parth',
      last_name: 'panchal',
      email: 'parth.panchal@yudiz.com',
      mobile: '8980422681',
      password: bcrypt.hashSync('Parth@123', salt),
      admin_type: 'super',
      is_active: 'y', // y = Active, n = Inactive
      created_at: new Date(),
      updated_at: new Date(),
      created_by: 'admin',
      updated_by: 'admin',
      role_id: 1,
      profile_pic: 'profile'
    }], {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('admins', null, {})
  }
}
