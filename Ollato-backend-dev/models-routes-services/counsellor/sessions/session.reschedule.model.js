const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { rescheduledBy } = require('../../../data')
const SessionModel = require('./session.model')

class SessionReschedule extends Sequelize.Model {}

SessionReschedule.init({
  sessions_id: { type: DataTypes.INTEGER, references: { model: 'sessions', as: 'id' } },
  reason: { type: DataTypes.STRING, allowNull: false },
  rescheduled_by: { type: DataTypes.ENUM(rescheduledBy), allowNull: false },
  created_by: { type: DataTypes.STRING, allowNull: true },
  updated_by: { type: DataTypes.STRING, allowNull: true }
}, {
  sequelize,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'sessions_reschedules'
})

SessionModel.hasOne(SessionReschedule, { foreignKey: 'sessions_id', as: 'session_reschedule' })

module.exports = SessionReschedule
