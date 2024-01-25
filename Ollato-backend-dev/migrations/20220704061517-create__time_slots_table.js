'use strict'
const { status } = require('../data')

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('time_slots', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fromTime: {
        type: Sequelize.TIME,
        allowNull: false
      },
      toTime: {
        type: Sequelize.TIME,
        allowNull: true
      },
      is_active: {
        type: Sequelize.ENUM(status),
        allowNull: false,
        defaultValue: 'y'
      },
      created_by: {
        type: Sequelize.STRING,
        allowNull: true
      },
      updated_by: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('time_slots')
  }
}
