const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { status } = require('../../../data')
const GradesModel = require('../../admin/grade/grade.model')
const TestsModel = require('../../student/test/test.model')
const TestDetaliModel = require('../../student/test/test.detail.model')
const NormModel = require('../../admin/norms/norms.model')

class NormGrades extends Sequelize.Model {}

NormGrades.init({
  custom_id: { type: DataTypes.STRING(), allowNull: true },
  grade_id: { type: DataTypes.INTEGER, references: { model: 'grades', key: 'id' } },
  test_id: { type: DataTypes.INTEGER, references: { model: 'tests', key: 'id' } },
  test_detail_id: { type: DataTypes.INTEGER, references: { model: 'test_details', key: 'id' } },
  norm_id: { type: DataTypes.INTEGER, references: { model: 'norms', key: 'id' } },
  min_marks: { type: DataTypes.INTEGER(11), defaultValue: '0' },
  max_marks: { type: DataTypes.INTEGER(11), defaultValue: '0' },
  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  created_by: { type: DataTypes.STRING(), allowNull: true },
  updated_by: { type: DataTypes.STRING(), allowNull: true },
  deleted_at: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
  is_active: { type: DataTypes.ENUM(status), defaultValue: 'y' } // y = Active, n = Inactive
}, {
  sequelize,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'norm_grades'
})

NormGrades.belongsTo(GradesModel, { foreignKey: 'grade_id', as: 'grades' })
NormGrades.belongsTo(TestsModel, { foreignKey: 'test_id', as: 'tests' })
NormGrades.belongsTo(TestDetaliModel, { foreignKey: 'test_detail_id', as: 'test_details' })
NormGrades.belongsTo(NormModel, { foreignKey: 'norm_id', as: 'norms' })

module.exports = NormGrades
