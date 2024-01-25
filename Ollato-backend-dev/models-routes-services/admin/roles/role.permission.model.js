const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { status } = require('../../../data')
const RoleModel = require('./roles.model')
const ModulePermission = require('./module.permissions.model')

class RolePermissions extends Sequelize.Model {}

RolePermissions.init({
  custom_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  role_id: { type: DataTypes.INTEGER, references: { model: 'roles', key: 'id' } },
  module_permission_id: { type: DataTypes.INTEGER, references: { model: 'modules_permissions', key: 'id' } },
  list: { type: DataTypes.STRING, allowNull: true },
  view: { type: DataTypes.STRING, allowNull: true },
  create: { type: DataTypes.STRING, allowNull: true },
  update: { type: DataTypes.STRING, allowNull: true },
  delete: { type: DataTypes.STRING, allowNull: true },
  is_active: { type: DataTypes.ENUM(status), defaultValue: 'y' },
  created_by: { type: DataTypes.STRING, allowNull: true },
  updated_by: { type: DataTypes.STRING, allowNull: true },
  deleted_at: { type: DataTypes.DATE, allowNull: true }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'role_permissions'
})
RoleModel.hasMany(RolePermissions, { foreignKey: 'role_id', as: 'role_permissions' })
RolePermissions.belongsTo(ModulePermission, { foreignKey: 'module_permission_id', as: 'module_permissions' })
module.exports = RolePermissions
