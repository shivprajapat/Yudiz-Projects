'use strict'
const { availableStatus, status } = require('../data')
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('counsellor_availabilities', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      counsellor_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'counsellors',
          as: 'id'
        }
      },
      timeSlot_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'time_slots', // 'time_slots
          as: 'id'
        }
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false
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
      status: {
        type: Sequelize.ENUM(availableStatus),
        allowNull: false
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
    await queryInterface.dropTable('counsellor_availabilities')
  }
}
