const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { status } = require('../../../data')

class CareerProfile extends Sequelize.Model {}

CareerProfile.init({
  custom_id: { type: DataTypes.STRING(), allowNull: true },
  profile_type: { type: DataTypes.STRING(), allowNull: false },
  filename: { type: DataTypes.STRING(), allowNull: true },
  path: { type: DataTypes.STRING(), allowNull: true },
  contenttype: { type: DataTypes.STRING(), allowNull: true },
  is_active: { type: DataTypes.ENUM(status), defaultValue: 'y' }, // y = Active, n = Inactive
  created_by: { type: DataTypes.STRING(), allowNull: true },
  updated_by: { type: DataTypes.STRING(), allowNull: true },
  deleted_at: { type: DataTypes.DATE, allowNull: true }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'career_profiles'
})

module.exports = CareerProfile
