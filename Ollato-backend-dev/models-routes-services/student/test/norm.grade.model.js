const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')

class NormGrade extends Sequelize.Model {}

NormGrade.init({
  custom_id: { type: DataTypes.STRING(), allowNull: true },
  grade_id: { type: DataTypes.INTEGER, references: { model: 'grades', key: 'id' }, allowNull: false },
  test_id: { type: DataTypes.INTEGER, references: { model: 'tests', key: 'id' }, allowNull: false },
  test_detail_id: { type: DataTypes.INTEGER, references: { model: 'test_details', key: 'id' }, allowNull: false },
  norm_id: { type: DataTypes.INTEGER, references: { model: 'normGrade', key: 'id' }, allowNull: false },
  min_marks: { type: DataTypes.INTEGER, allowNull: true, defaultValue: '0' },
  max_marks: { type: DataTypes.INTEGER, allowNull: true, defaultValue: '0' },
  created_by: { type: DataTypes.STRING(), allowNull: true },
  updated_by: { type: DataTypes.STRING(), allowNull: true },
  deleted_at: { type: DataTypes.DATE(), allowNull: true }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'norm_grades'
})

module.exports = NormGrade
