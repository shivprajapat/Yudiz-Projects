const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')

class StudentTestArchive extends Sequelize.Model {}

StudentTestArchive.init({
  student_id: { type: DataTypes.INTEGER, references: { model: 'students', key: 'id' } },
  student_package_id: { type: DataTypes.INTEGER, references: { model: 'student_packages', key: 'id' } },
  student_calc_test_id: { type: DataTypes.INTEGER, references: { model: 'student_calc_tests', key: 'id' } },
  student_test_id: { type: DataTypes.INTEGER, allowNull: true },
  student_test: { type: DataTypes.TEXT(), allowNull: true },
  student_test_ans: { type: DataTypes.TEXT(), allowNull: true },
  student_test_norm: { type: DataTypes.TEXT(), allowNull: true }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'student_test_archives'
})

module.exports = StudentTestArchive
