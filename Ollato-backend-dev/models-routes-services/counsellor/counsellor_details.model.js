const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../database/sequelize')
const countryModel = require('../../models-routes-services/common/country/country.model')
const stateModel = require('../admin/state/state.model')
const cityModel = require('../admin/city/city.model')
const counsellorModel = require('./counsellor.model')
const qualificationsModel = require('../admin/qualification/qualification.model')
const universitiesModel = require('../admin/university/university.model')

class CounsellorDetail extends Sequelize.Model {}

CounsellorDetail.init({
  custom_id: { type: DataTypes.STRING(), allowNull: false, unique: true },
  counsellor_id: { type: DataTypes.INTEGER, references: { model: 'counsellors', key: 'id' }, allowNull: false },
  resume: { type: DataTypes.STRING(), allowNull: true },
  professional_expert_id: { type: DataTypes.INTEGER, references: { model: 'qualifications', key: 'id' }, allowNull: true },
  country_id: { type: DataTypes.INTEGER, references: { model: 'countries', key: 'id' }, allowNull: false },
  state_id: { type: DataTypes.INTEGER, references: { model: 'states', key: 'id' }, allowNull: false },
  city_id: { type: DataTypes.INTEGER, references: { model: 'cities', key: 'id' }, allowNull: false },
  pin_code: { type: DataTypes.STRING, allowNull: true },
  high_qualification_id: { type: DataTypes.INTEGER, references: { model: 'qualifications', key: 'id' }, allowNull: true },
  high_university_id: { type: DataTypes.INTEGER, references: { model: 'universities', key: 'id' }, allowNull: true },
  last_qualification_id: { type: DataTypes.INTEGER, references: { model: 'qualifications', key: 'id' }, allowNull: true },
  last_university_id: { type: DataTypes.INTEGER, references: { model: 'universities', key: 'id' }, allowNull: true },
  certificate_qualification_id: { type: DataTypes.INTEGER, references: { model: 'qualifications', key: 'id' }, allowNull: true },
  certificate_university_id: { type: DataTypes.INTEGER, references: { model: 'universities', key: 'id' }, allowNull: true },
  experience_year: { type: DataTypes.INTEGER, allowNull: true },
  experience_month: { type: DataTypes.INTEGER, allowNull: true },
  total_experience: { type: DataTypes.STRING, allowNull: true },
  professional_expertness: { type: DataTypes.STRING, allowNull: true },
  pan_number: { type: DataTypes.STRING, allowNull: true },
  pan_file: { type: DataTypes.STRING, allowNull: true },
  adhar_card_number: { type: DataTypes.STRING, allowNull: true },
  adhar_card_number_front: { type: DataTypes.STRING, allowNull: true },
  adhar_card_number_back: { type: DataTypes.STRING, allowNull: true },
  gst_no: { type: DataTypes.STRING, allowNull: true },
  signature: { type: DataTypes.STRING, allowNull: true },
  created_by: { type: DataTypes.STRING(), allowNull: true },
  updated_by: { type: DataTypes.STRING(), allowNull: true },
  created_at: { type: DataTypes.DATE(), allowNull: true, defaultValue: new Date() },
  updated_at: { type: DataTypes.DATE(), allowNull: true, defaultValue: new Date() },
  deleted_at: { type: DataTypes.DATE(), allowNull: true },
  profile_picture: { type: DataTypes.STRING, allowNull: true }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'counsellor_details'
})

CounsellorDetail.belongsTo(countryModel, { foreignKey: 'country_id', as: 'country' })
CounsellorDetail.belongsTo(stateModel, { foreignKey: 'state_id', as: 'state' })
CounsellorDetail.belongsTo(cityModel, { foreignKey: 'city_id', as: 'city' })
// CounsellorDetail.belongsTo(counsellorModel, { foreignKey: 'counsellor_id', as: 'Allcounsellors' })

CounsellorDetail.belongsTo(qualificationsModel, { foreignKey: 'high_qualification_id', as: 'high_qualification' })
CounsellorDetail.belongsTo(qualificationsModel, { foreignKey: 'last_qualification_id', as: 'last_qualification' })

CounsellorDetail.belongsTo(universitiesModel, { foreignKey: 'high_university_id', as: 'high_university' })
CounsellorDetail.belongsTo(universitiesModel, { foreignKey: 'last_university_id', as: 'last_university' })

CounsellorDetail.belongsTo(qualificationsModel, { foreignKey: 'certificate_qualification_id', as: 'certificate_qualification' })
CounsellorDetail.belongsTo(universitiesModel, { foreignKey: 'certificate_university_id', as: 'certificate_university' })

CounsellorDetail.belongsTo(qualificationsModel, { foreignKey: 'professional_expert_id', as: 'professional_expertnesses' })

counsellorModel.hasOne(CounsellorDetail, { foreignKey: 'counsellor_id', as: 'details' })

module.exports = CounsellorDetail
