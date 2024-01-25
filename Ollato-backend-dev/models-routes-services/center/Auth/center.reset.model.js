const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')

class CenterResetModel extends Sequelize.Model {}

CenterResetModel.init({
  email_mobile: { type: DataTypes.STRING, unique: true, allowNull: false },
  token: { type: DataTypes.STRING, allowNull: true },
  OTP: { type: DataTypes.STRING, unique: true, allowNull: true }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  tableName: 'center_password_resets',
  modelName: 'center_password_resets'
})
CenterResetModel.removeAttribute('id')
module.exports = CenterResetModel
