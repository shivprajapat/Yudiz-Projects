'use strict'
const { status } = require('../data')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('coupon_code', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      custom_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false
      },
      from_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      to_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      number_time_use: {
        type: Sequelize.INTEGER(11),
        allowNull: false
      },
      remaining_time_use: {
        type: Sequelize.INTEGER(11),
        allowNull: false
      },
      is_active: {
        type: Sequelize.ENUM(status),
        defaultValue: 'y'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('coupon_code')
  }
}
