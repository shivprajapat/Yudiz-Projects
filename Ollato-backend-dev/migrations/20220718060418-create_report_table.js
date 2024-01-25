'use strict'
const { reportBy } = require('../data')
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('session_reports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sessions_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'sessions',
          as: 'id'
        },
        allowNull: false
      },
      reason: {
        type: Sequelize.STRING,
        allowNull: false
      },
      report_by: {
        type: Sequelize.ENUM(reportBy),
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
      created_at: {
        type: Sequelize.DATE
      },
      updated_at: {
        type: Sequelize.DATE
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('session_reports')
  }
}
