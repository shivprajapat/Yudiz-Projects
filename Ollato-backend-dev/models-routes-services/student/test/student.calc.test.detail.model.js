const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const testDetailModel = require('./test.detail.model')
class StudentCalcTestDetail extends Sequelize.Model {}

StudentCalcTestDetail.init({
  custom_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  student_calc_test_id: { type: DataTypes.INTEGER, references: { model: 'student_calc_tests', key: 'id' }, allowNull: false },
  student_test_id: { type: DataTypes.INTEGER, references: { model: 'student_tests', key: 'id' }, allowNull: false },
  test_id: { type: DataTypes.INTEGER, references: { model: 'tests', key: 'id' }, allowNull: false },
  test_detail_id: { type: DataTypes.INTEGER, references: { model: 'test_details', key: 'id' }, allowNull: false },
  marks_obtained: { type: DataTypes.INTEGER, allowNull: true, defaultValue: '0' },
  test_abb: { type: DataTypes.STRING, allowNull: false },
  converted_score: { type: DataTypes.INTEGER, allowNull: true, defaultValue: '0' },
  sten_scores: { type: DataTypes.FLOAT, allowNull: true, defaultValue: '0' },
  score_round: { type: DataTypes.INTEGER, allowNull: true, defaultValue: '0' },
  out_of_score: { type: DataTypes.INTEGER, allowNull: true, defaultValue: '0' },
  rank: { type: DataTypes.INTEGER, allowNull: true, defaultValue: '0' },
  deleted_at: { type: DataTypes.DATE }
}, {
  sequelize, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'student_calc_test_details'

})

module.exports = StudentCalcTestDetail
StudentCalcTestDetail.belongsTo(testDetailModel, { foreignKey: 'test_detail_id', as: 'testDetails' })
