const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { nationality } = require('../../../data')
const countryModel = require('../../../models-routes-services/common/country/country.model')
const stateModel = require('../../admin/state/state.model')
const cityModel = require('../../admin/city/city.model')
const studentModel = require('../auth/student.model')
const gradesModel = require('../../admin/grade/grade.model')
const boardsModel = require('../../admin/board/board.model')
const schoolModel = require('../../../models-routes-services/admin/school/schools.model')

class StudentDetails extends Sequelize.Model {}

StudentDetails.init({
  custom_id: { type: DataTypes.STRING, unique: true, allowNull: true },
  student_id: { type: DataTypes.INTEGER, references: { model: 'students', key: 'id' }, allowNull: false },
  country_id: { type: DataTypes.INTEGER, references: { model: 'countries', key: 'id' }, allowNull: false },
  state_id: { type: DataTypes.INTEGER, references: { model: 'states', key: 'id' }, allowNull: false },
  city_id: { type: DataTypes.INTEGER, references: { model: 'cities', key: 'id' }, allowNull: false },
  pin_code: { type: DataTypes.STRING, allowNull: true },
  grade_id: { type: DataTypes.INTEGER, references: { model: 'grades', key: 'id' }, allowNull: false },
  board_id: { type: DataTypes.INTEGER, references: { model: 'boards', key: 'id' }, allowNull: false },
  school_id: { type: DataTypes.INTEGER, references: { model: 'schools', key: 'id' }, allowNull: true },
  school_name: { type: DataTypes.STRING, allowNull: true },
  nationality: { type: DataTypes.ENUM(nationality) },
  school_address_1: { type: DataTypes.STRING, allowNull: true },
  school_address_2: { type: DataTypes.STRING, allowNull: true },
  school_country_id: { type: DataTypes.INTEGER, references: { model: 'countries', key: 'id' }, allowNull: true },
  school_state_id: { type: DataTypes.INTEGER, references: { model: 'states', key: 'id' }, allowNull: true },
  school_city_id: { type: DataTypes.INTEGER, references: { model: 'cities', key: 'id' }, allowNull: true },
  school_pin_code: { type: DataTypes.STRING, allowNull: true },
  created_by: { type: DataTypes.STRING, allowNull: true },
  updated_by: { type: DataTypes.STRING, allowNull: true },
  deleted_at: { type: DataTypes.DATE }
}, { sequelize, timestamps: false, createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'student_details' })

StudentDetails.belongsTo(countryModel, { foreignKey: 'country_id', as: 'countries' })
StudentDetails.belongsTo(stateModel, { foreignKey: 'state_id', as: 'states' })
StudentDetails.belongsTo(cityModel, { foreignKey: 'city_id', as: 'cities' })
StudentDetails.belongsTo(studentModel, { foreignKey: 'student_id', as: 'students' })
studentModel.hasOne(StudentDetails, { foreignKey: 'student_id', as: 'studentDetails' })
StudentDetails.belongsTo(gradesModel, { foreignKey: 'grade_id', as: 'grades' })
StudentDetails.belongsTo(boardsModel, { foreignKey: 'board_id', as: 'boards' })
StudentDetails.belongsTo(schoolModel, { foreignKey: 'school_id', as: 'schools' })
StudentDetails.belongsTo(countryModel, { foreignKey: 'school_country_id', as: 'school_country' })
StudentDetails.belongsTo(stateModel, { foreignKey: 'school_state_id', as: 'school_state' })
StudentDetails.belongsTo(cityModel, { foreignKey: 'school_city_id', as: 'school_city' })

module.exports = StudentDetails
