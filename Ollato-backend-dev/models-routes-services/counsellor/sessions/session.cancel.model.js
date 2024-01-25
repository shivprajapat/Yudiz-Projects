const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { canceleddBy } = require('../../../data')
const SessionModel = require('./session.model')

class SessionCancel extends Sequelize.Model {}

SessionCancel.init({
  sessions_id: { type: DataTypes.INTEGER, references: { model: 'sessions', as: 'id' } },
  reason: { type: DataTypes.STRING, allowNull: false },
  canceled_by: { type: DataTypes.ENUM(canceleddBy), allowNull: false },
  created_by: { type: DataTypes.STRING, allowNull: true },
  updated_by: { type: DataTypes.STRING, allowNull: true }
}, {
  sequelize,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'sessions_cancels'
})

SessionModel.hasOne(SessionCancel, { foreignKey: 'sessions_id', as: 'session' })

module.exports = SessionCancel
