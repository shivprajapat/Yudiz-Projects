const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../database/sequelize')
const { availableStatus, status } = require('../../data')
const CounsellorModel = require('./counsellor.model')
const TimeSlotsModel = require('./timeslots.model')

class CounsellorAvailability extends Sequelize.Model {}

CounsellorAvailability.init({
  counsellor_id: { type: DataTypes.INTEGER, references: { model: 'counsellors', as: 'id' } },
  time_slot_id: { type: DataTypes.INTEGER, references: { model: 'time_slots', as: 'id' } },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  from_time: { type: DataTypes.TIME, allowNull: false },
  to_time: { type: DataTypes.TIME, allowNull: true },
  is_active: { type: DataTypes.ENUM(status), allowNull: false, defaultValue: 'y' },
  status: { type: DataTypes.ENUM(availableStatus), allowNull: false },
  created_by: { type: DataTypes.STRING, allowNull: true },
  updated_by: { type: DataTypes.STRING, allowNull: true },
  deleted_at: { type: DataTypes.DATE(), allowNull: true }
}, {
  sequelize,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'counsellor_availabilities'
})

CounsellorAvailability.belongsTo(CounsellorModel, { foreignKey: 'counsellor_id', as: 'counsellors' })
CounsellorModel.hasMany(CounsellorAvailability, { foreignKey: 'counsellor_id', as: 'availableTimes' })
CounsellorAvailability.belongsTo(TimeSlotsModel, { foreignKey: 'time_slot_id', as: 'time_slots' })

module.exports = CounsellorAvailability
