const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { status } = require('../../../data')
const careerProfileDetailModel = require('../career-profile/career-profile-detail.model')
class SoftwareMetrix extends Sequelize.Model {}

SoftwareMetrix.init({
  custom_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  career_profile_detail_id: { type: DataTypes.INTEGER, references: { model: 'software_matrix', as: 'id' } },
  test_abb_1: { type: DataTypes.STRING, allowNull: false },
  test_abb_2: { type: DataTypes.STRING, allowNull: false },
  test_abb_3: { type: DataTypes.STRING, allowNull: false },
  sort_order: { type: DataTypes.INTEGER, allowNull: false },
  math_dropped: { type: DataTypes.BOOLEAN, allowNull: false },
  science_dropped: { type: DataTypes.BOOLEAN, allowNull: false },
  is_active: { type: DataTypes.ENUM(status), allowNull: false, defaultValue: 'y' },
  deleted_at: { type: DataTypes.DATE, allowNull: true },
  created_by: { type: DataTypes.STRING, allowNull: true },
  updated_by: { type: DataTypes.STRING, allowNull: true }
}, {
  sequelize,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'software_matrix'
})

SoftwareMetrix.belongsTo(careerProfileDetailModel, { foreignKey: 'career_profile_detail_id', as: 'careerProfiles' })
module.exports = SoftwareMetrix
