const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const testDetailModel = require('./test.detail.model')
class StudentCalcTestNorm extends Sequelize.Model {}

StudentCalcTestNorm.init({
  custom_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  student_calc_test_id: { type: DataTypes.INTEGER, references: { model: 'student_calc_tests', key: 'id' }, allowNull: false },
  student_test_id: { type: DataTypes.INTEGER, references: { model: 'student_tests', key: 'id' }, allowNull: false },
  test_id: { type: DataTypes.INTEGER, references: { model: 'tests', key: 'id' }, allowNull: false },
  test_detail_id: { type: DataTypes.INTEGER, references: { model: 'test_details', key: 'id' }, allowNull: false },
  grade_id: { type: DataTypes.INTEGER, references: { model: 'grades', key: 'id' }, allowNull: false },
  min_marks: { type: DataTypes.INTEGER, allowNull: true, defaultValue: '0' },
  max_marks: { type: DataTypes.INTEGER, allowNull: true, defaultValue: '0' },
  marks_obtained: { type: DataTypes.INTEGER, allowNull: true, defaultValue: '0' },
  norm_id: { type: DataTypes.INTEGER, references: { model: 'norms', key: 'id' }, allowNull: false },
  norms_code: { type: DataTypes.STRING, allowNull: false },
  adjusted_score: { type: DataTypes.FLOAT, allowNull: true, defaultValue: '0' },
  sten_scores: { type: DataTypes.FLOAT, allowNull: true, defaultValue: '0' },
  score_round: { type: DataTypes.INTEGER, allowNull: true, defaultValue: '0' },
  out_of_score: { type: DataTypes.INTEGER, allowNull: true, defaultValue: '0' },
  deleted_at: { type: DataTypes.DATE }
}, {
  sequelize, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'student_calc_test_norms'

})
StudentCalcTestNorm.belongsTo(testDetailModel, { foreignKey: 'test_detail_id', as: 'testDetails' })
module.exports = StudentCalcTestNorm
