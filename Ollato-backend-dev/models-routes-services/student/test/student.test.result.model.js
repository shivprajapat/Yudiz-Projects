const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const careerProfileDetailModel = require('../../admin/career-profile/career-profile-detail.model')
class StudentTestResult extends Sequelize.Model {}

StudentTestResult.init({
  custom_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  student_id: { type: DataTypes.INTEGER, references: { model: 'students', key: 'id' }, allowNull: false },
  student_calc_test_id: { type: DataTypes.INTEGER, references: { model: 'student_calc_tests', key: 'id' }, allowNull: true, defaultValue: null },
  software_matrix_id: { type: DataTypes.INTEGER, references: { model: 'software_matrix', key: 'id' }, allowNull: true, defaultValue: null },
  career_profile_detail_id: { type: DataTypes.INTEGER, references: { model: 'career_profile_details', key: 'id' }, allowNull: true, defaultValue: null },
  deleted_at: { type: DataTypes.DATE }
}, {
  sequelize, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'student_test_results'

})
StudentTestResult.belongsTo(careerProfileDetailModel, { foreignKey: 'career_profile_detail_id', as: 'careerProfileDetail' })
module.exports = StudentTestResult
