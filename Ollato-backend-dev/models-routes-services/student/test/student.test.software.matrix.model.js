const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
class StudentTestSoftwareMatrix extends Sequelize.Model {}

StudentTestSoftwareMatrix.init({
  custom_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  student_id: { type: DataTypes.INTEGER, references: { model: 'students', key: 'id' }, allowNull: false },
  student_calc_test_id: { type: DataTypes.INTEGER, references: { model: 'student_calc_tests', key: 'id' }, allowNull: true, defaultValue: null },
  student_codes: { type: Sequelize.TEXT(), allowNull: true },
  deleted_at: { type: DataTypes.DATE }
}, {
  sequelize, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'student_test_software_matrix'

})

module.exports = StudentTestSoftwareMatrix
