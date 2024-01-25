'use strict'
const { sessionsStatus } = require('../data')
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sessions', {
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
      counsellor_aval_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'counsellor_availabilities',
          as: 'id'
        }
      },
      student_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'students', // 'time_slots
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
      status: {
        type: Sequelize.ENUM(sessionsStatus),
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
    await queryInterface.dropTable('sessions')
  }
}
