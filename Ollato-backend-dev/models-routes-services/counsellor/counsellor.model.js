const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../database/sequelize')
const { userGender, status, counsellorStatus } = require('../../data')
const CenterModel = require('../center/Auth/center.model')

class Counsellor extends Sequelize.Model {}

Counsellor.init({
  custom_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  ollato_code: { type: DataTypes.STRING, allowNull: true },
  slug: { type: DataTypes.STRING, unique: true, allowNull: true },
  center_id: { type: DataTypes.INTEGER, references: { model: 'centers', key: 'id' }, allowNull: true },
  user_name: { type: DataTypes.STRING, unique: true, allowNull: false },
  first_name: { type: DataTypes.STRING, allowNull: false },
  middle_name: { type: DataTypes.STRING, allowNull: true },
  last_name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  mobile: { type: DataTypes.STRING, allowNull: false },
  avg_ratings: { type: DataTypes.FLOAT, allowNull: true, max: 5 },
  career_counsellor: { type: DataTypes.STRING, allowNull: true },
  psychologist: { type: DataTypes.STRING, allowNull: true },
  overseas_counsellor: { type: DataTypes.STRING, allowNull: true },
  subject_expert: { type: DataTypes.STRING, allowNull: true },
  OTP: { type: DataTypes.INTEGER, max: 4, min: 4 },
  dob: { type: DataTypes.DATEONLY },
  gender: { type: DataTypes.ENUM(userGender) },
  password: { type: DataTypes.STRING, allowNull: false },
  is_active: { type: DataTypes.ENUM(status) },
  status: { type: DataTypes.ENUM(counsellorStatus), defaultValue: 'pending' },
  is_verify: { type: DataTypes.ENUM(status) },
  total_amount: { type: DataTypes.FLOAT, allowNull: true, defaultValue: '0.00' },
  redeem_amount: { type: DataTypes.FLOAT, allowNull: true, defaultValue: '0.00' },
  remaining_amount: { type: DataTypes.FLOAT, allowNull: true, defaultValue: '0.00' },
  commission: { type: DataTypes.FLOAT, allowNull: true, defaultValue: '0.00' },
  verified_at: { type: DataTypes.DATE },
  created_by: { type: DataTypes.STRING, allowNull: true },
  updated_by: { type: DataTypes.STRING, allowNull: true },
  token: { type: DataTypes.STRING, allowNull: true },
  deleted_at: { type: DataTypes.DATE(), allowNull: true }
}, {
  sequelize,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'counsellors',
  defaultScope: {
    attributes: { exclude: ['token', 'is_verify', 'OTP'] }
  }
})

Counsellor.belongsTo(CenterModel, { foreignKey: 'center_id', as: 'center' })

module.exports = Counsellor
