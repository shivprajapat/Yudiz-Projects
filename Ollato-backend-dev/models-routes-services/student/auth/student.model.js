const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { userGender, status } = require('../../../data')
const counsellorModel = require('../../counsellor/counsellor.model')
const centerModel = require('../../center/Auth/center.model')
class Student extends Sequelize.Model {}

Student.init({

  custom_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  ollato_code: { type: DataTypes.STRING, allowNull: true },
  center_id: { type: DataTypes.INTEGER, references: { model: 'centers', key: 'id' }, allowNull: true },
  counselor_id: { type: DataTypes.INTEGER, references: { model: 'counselors', key: 'id' }, allowNull: true },
  slug: { type: DataTypes.STRING, unique: true, allowNull: true },
  user_name: { type: DataTypes.STRING, unique: true, allowNull: false },
  first_name: { type: DataTypes.STRING, allowNull: false },
  middle_name: { type: DataTypes.STRING, allowNull: true },
  last_name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: true },
  mobile: { type: DataTypes.STRING, allowNull: false },
  OTP: { type: DataTypes.INTEGER, max: 4, min: 4 },
  dob: { type: DataTypes.DATEONLY },
  gender: { type: DataTypes.ENUM(userGender) },
  father_name: { type: DataTypes.STRING, allowNull: true },
  mother_name: { type: DataTypes.STRING, allowNull: true },
  password: { type: DataTypes.STRING, allowNull: false },
  is_active: { type: DataTypes.ENUM(status) },
  is_verify: { type: DataTypes.ENUM(status) },
  verified_at: { type: DataTypes.DATE },
  math_dropped: { type: DataTypes.BOOLEAN, allowNull: true },
  science_dropped: { type: DataTypes.BOOLEAN, allowNull: true },
  created_by: { type: DataTypes.STRING, allowNull: true },
  updated_by: { type: DataTypes.STRING, allowNull: true },
  profile: { type: DataTypes.STRING, allowNull: true },
  token: { type: DataTypes.STRING, allowNull: true },
  deleted_at: { type: DataTypes.DATE }
}, {
  sequelize, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'students'

})

Student.belongsTo(centerModel, { foreignKey: 'center_id', as: 'centers' })
Student.belongsTo(counsellorModel, { foreignKey: 'counselor_id', as: 'counselors' })

module.exports = Student
