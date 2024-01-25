const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { sessionsStatus, sessionsType, counsellorType } = require('../../../data')
const counsellorModel = require('../counsellor.model')
const studentModel = require('../../student/auth/student.model')
class Sessions extends Sequelize.Model {}

Sessions.init({
  counsellor_id: { type: DataTypes.INTEGER, references: { model: 'counsellors', as: 'id' } },
  counsellor_aval_id: { type: DataTypes.INTEGER, references: { model: 'counsellor_availabilities', as: 'id' } },
  student_package_id: { type: DataTypes.INTEGER, references: { model: 'sessions', as: 'id' } },
  student_id: { type: DataTypes.INTEGER, references: { model: 'students', as: 'id' } },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  from_time: { type: DataTypes.TIME, allowNull: false },
  to_time: { type: DataTypes.TIME, allowNull: true },
  type: { type: DataTypes.ENUM(sessionsType), allowNull: true },
  counsellor_type: { type: DataTypes.ENUM(counsellorType), allowNull: true },
  status: { type: DataTypes.ENUM(sessionsStatus), allowNull: false },
  created_by: { type: DataTypes.STRING, allowNull: true },
  updated_by: { type: DataTypes.STRING, allowNull: true }
}, {
  sequelize,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'sessions'
})

Sessions.belongsTo(counsellorModel, { foreignKey: 'counsellor_id', as: 'counsellors' })
Sessions.belongsTo(studentModel, { foreignKey: 'student_id', as: 'student' })
module.exports = Sessions
