const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../database/sequelize')
const { status } = require('../../data')

class TimeSlot extends Sequelize.Model {}

TimeSlot.init({
  from_time: { type: DataTypes.TIME, allowNull: false },
  to_time: { type: DataTypes.TIME, allowNull: true },
  is_active: { type: DataTypes.ENUM(status), allowNull: false, defaultValue: 'y' },
  created_by: { type: DataTypes.STRING, allowNull: true },
  updated_by: { type: DataTypes.STRING, allowNull: true }
}, {
  sequelize,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'time_slots'
})

module.exports = TimeSlot
