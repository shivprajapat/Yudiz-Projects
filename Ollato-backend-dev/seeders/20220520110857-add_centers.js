'use strict'
const bcrypt = require('bcryptjs')
const salt = bcrypt.genSaltSync(1)

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('centers', [{
      custom_id: '1',
      slug: 'olatto-1',
      user_name: 'olatto-1',
      title: 'center-1',
      email: 'zarna.p@yudiz.com',
      mobile: '7698994724',
      password: bcrypt.hashSync('Zarna@123', salt),
      is_active: 'y',
      created_by: 'admin',
      updated_by: 'admin'
    }], {})
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('centers', null, {})
  }
}
