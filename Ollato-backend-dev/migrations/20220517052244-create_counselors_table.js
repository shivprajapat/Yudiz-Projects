'use strict'
const { status } = require('../data')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('counsellors', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      custom_id: { type: Sequelize.STRING, unique: true, allowNull: false },
      center_id: { type: Sequelize.INTEGER, references: { model: 'centers', key: 'id' } },
      slug: { type: Sequelize.STRING, unique: true, allowNull: true },
      user_name: { type: Sequelize.STRING, unique: true, allowNull: false },
      first_name: { type: Sequelize.STRING, allowNull: false },
      middle_name: { type: Sequelize.STRING, allowNull: false },
      last_name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, unique: true, allowNull: false },
      mobile: { type: Sequelize.STRING, unique: true, allowNull: false },
      OTP: { type: Sequelize.INTEGER, max: 4, min: 4, allowNull: true },
      dob: { type: Sequelize.DATE, allowNull: true },
      gender: { type: Sequelize.ENUM, values: ['male', 'female', 'other'], allowNull: true },
      password: { type: Sequelize.STRING, allowNull: false },
      is_active: { type: Sequelize.ENUM(status), defaultValue: 'y' }, // y = Active, n = Inactive
      is_verify: { type: Sequelize.ENUM(status), defaultValue: 'y' },
      verified_at: { type: Sequelize.DATE },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: Sequelize.DATE,
      created_by: { type: Sequelize.STRING(), allowNull: true },
      updated_by: { type: Sequelize.STRING(), allowNull: true },
      token: { type: Sequelize.STRING, allowNull: true }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('counsellors')
  }
}
