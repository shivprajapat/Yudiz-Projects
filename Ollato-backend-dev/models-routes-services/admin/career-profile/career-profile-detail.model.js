const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { status } = require('../../../data')
const CareerProfileModel = require('./career-profile.model')

class CareerProfileDetail extends Sequelize.Model {}

CareerProfileDetail.init({
  custom_id: { type: DataTypes.STRING(), allowNull: true },
  career_profile_id: { type: DataTypes.INTEGER, references: { model: 'career_profiles', key: 'id' } },
  profile_type_det: { type: DataTypes.STRING(), allowNull: false },
  is_active: { type: DataTypes.ENUM(status), defaultValue: 'y' }, // y = Active, n = Inactive
  created_by: { type: DataTypes.STRING(), allowNull: true },
  updated_by: { type: DataTypes.STRING(), allowNull: true },
  deleted_at: { type: DataTypes.DATE, allowNull: true }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'career_profile_details'
})

CareerProfileDetail.belongsTo(CareerProfileModel, { foreignKey: 'career_profile_id', as: 'career_profiles' })
CareerProfileModel.hasMany(CareerProfileDetail, { foreignKey: 'career_profile_id', as: 'career_detail' })

module.exports = CareerProfileDetail
