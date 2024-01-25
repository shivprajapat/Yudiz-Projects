const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { status } = require('../../../data')

class Norms extends Sequelize.Model {}

Norms.init({
  custom_id: { type: DataTypes.STRING(), allowNull: true },
  title: { type: DataTypes.STRING(), allowNull: false },
  code: { type: DataTypes.STRING(), allowNull: false },
  sort_order: { type: DataTypes.INTEGER(11), defaultValue: '0' },
  is_active: { type: DataTypes.ENUM(status), defaultValue: 'y' }, // y = Active, n = Inactive
  created_by: { type: DataTypes.STRING(), allowNull: true },
  updated_by: { type: DataTypes.STRING(), allowNull: true },
  deleted_at: { type: DataTypes.DATE(), allowNull: true }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'norms'
})

module.exports = Norms
