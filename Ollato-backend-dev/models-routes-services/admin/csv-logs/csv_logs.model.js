const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')

class CsvLogs extends Sequelize.Model {}

CsvLogs.init({
  email: { type: DataTypes.STRING(), allowNull: true },
  mobile: { type: DataTypes.STRING(), allowNull: true },
  student_name: { type: DataTypes.STRING(), allowNull: true },
  description: { type: DataTypes.STRING(), allowNull: true },
  action_by: { type: DataTypes.INTEGER },
  created_at: { type: Sequelize.DATE, allowNull: true },
  updated_at: { type: Sequelize.DATE, allowNull: true },
  deleted_at: { type: Sequelize.DATE, allowNull: true, defaultValue: null }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'csv_logs'
})

module.exports = CsvLogs
