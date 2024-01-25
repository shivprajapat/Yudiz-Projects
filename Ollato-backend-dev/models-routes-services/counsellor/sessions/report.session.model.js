const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { sessionsStatus } = require('../../../data')

class SessionReport extends Sequelize.Model {}

SessionReport.init({
  sessions_id: { type: DataTypes.INTEGER, references: { model: 'sessions', as: 'id' } },
  reason: { type: DataTypes.STRING, allowNull: false },
  report_by: { type: DataTypes.ENUM(sessionsStatus), allowNull: false },
  created_by: { type: DataTypes.STRING, allowNull: true },
  updated_by: { type: DataTypes.STRING, allowNull: true }
}, {
  sequelize,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'session_reports'
})

module.exports = SessionReport
