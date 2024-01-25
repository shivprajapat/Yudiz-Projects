const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { status } = require('../../../data')

class ModulesPermissions extends Sequelize.Model {}

ModulesPermissions.init({
  custom_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  module_name: { type: DataTypes.STRING, allowNull: false, unique: true },
  slug: { type: DataTypes.STRING, allowNull: true },
  list: { type: DataTypes.STRING, allowNull: true },
  view: { type: DataTypes.STRING, allowNull: true },
  create: { type: DataTypes.STRING, allowNull: true },
  update: { type: DataTypes.STRING, allowNull: true },
  delete: { type: DataTypes.STRING, allowNull: true },
  sort_order: { type: DataTypes.INTEGER, allowNull: false },
  is_active: { type: DataTypes.ENUM(status), defaultValue: 'y' },
  created_by: { type: DataTypes.STRING, allowNull: true },
  updated_by: { type: DataTypes.STRING, allowNull: true },
  deleted_at: { type: DataTypes.DATE, allowNull: true }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'modules_permissions'
})

module.exports = ModulesPermissions
