const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const studentModel = require('../auth/student.model')

class StudentCalcTest extends Sequelize.Model {}

StudentCalcTest.init({
  custom_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  report_path: { type: DataTypes.STRING, allowNull: true },
  student_id: { type: DataTypes.INTEGER, references: { model: 'students', key: 'id' }, allowNull: false },
  grade_id: { type: DataTypes.INTEGER, references: { model: 'grades', key: 'id' }, allowNull: false },
  package_id: { type: DataTypes.INTEGER, references: { model: 'packages', key: 'id' }, allowNull: true, defaultValue: null },
  student_package_id: { type: DataTypes.INTEGER, references: { model: 'student_packages', key: 'id' }, allowNull: true, defaultValue: null },
  start_time: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  is_submitted: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  submission_Time: { type: DataTypes.DATE },
  deleted_at: { type: DataTypes.DATE }
}, {
  sequelize, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'student_calc_tests'

})

StudentCalcTest.belongsTo(studentModel, { foreignKey: 'student_id', as: 'student' })
studentModel.hasOne(StudentCalcTest, { foreignKey: 'student_id', as: 'studentCalcTests' })

module.exports = StudentCalcTest
