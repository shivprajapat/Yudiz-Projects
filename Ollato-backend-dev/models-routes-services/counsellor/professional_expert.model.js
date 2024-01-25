const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../database/sequelize')
const { status } = require('../../data')

class ProfessionalExpert extends Sequelize.Model {}

ProfessionalExpert.init({
  custom_id: { type: DataTypes.STRING(), allowNull: true },
  title: { type: DataTypes.STRING(), allowNull: false },
  is_active: { type: DataTypes.ENUM(status), defaultValue: 'y' }, // y = Active, n = Inactive
  created_by: { type: DataTypes.STRING(), allowNull: true },
  updated_by: { type: DataTypes.STRING(), allowNull: true },
  deleted_at: { type: DataTypes.DATE(), allowNull: true }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'professional_expertnesses'
})

module.exports = ProfessionalExpert
