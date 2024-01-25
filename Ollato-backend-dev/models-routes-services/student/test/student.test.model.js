const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const studentModel = require('../auth/student.model')
const testModel = require('./test.model')
const testDetailModel = require('./test.detail.model')
const StudentCalcTest = require('./student.calc.test.model')
class StudentTest extends Sequelize.Model {}

StudentTest.init({
  custom_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  student_calc_test_id: { type: DataTypes.INTEGER, references: { model: 'student_calc_tests', key: 'id' }, allowNull: true, defaultValue: null },
  student_id: { type: DataTypes.INTEGER, references: { model: 'students', key: 'id' }, allowNull: false },
  grade_id: { type: DataTypes.INTEGER, references: { model: 'grades', key: 'id' }, allowNull: false },
  test_id: { type: DataTypes.INTEGER, references: { model: 'tests', key: 'id' }, allowNull: false },
  test_detail_id: { type: DataTypes.INTEGER, references: { model: 'test_details', key: 'id' }, allowNull: false },
  package_id: { type: DataTypes.INTEGER, references: { model: 'packages', key: 'id' }, allowNull: true, defaultValue: null },
  student_package_id: { type: DataTypes.INTEGER, references: { model: 'student_packages', key: 'id' }, allowNull: true, defaultValue: null },
  student_interest_test_id: { type: DataTypes.INTEGER, references: { model: 'student_interest_tests', key: 'id' }, allowNull: true, defaultValue: null },
  start_time: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  is_submitted: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  submission_Time: { type: DataTypes.DATE },
  marks_obtained: { type: DataTypes.INTEGER, allowNull: true, defaultValue: '0' },
  marks_wrong: { type: DataTypes.INTEGER, allowNull: true, defaultValue: '0' },
  not_attempted: { type: DataTypes.INTEGER, allowNull: true, defaultValue: '0' },
  questions: {
    type: DataTypes.STRING,
    allowNull: true,
    set: function(value) {
      return this.setDataValue('questions', JSON.stringify(value))
    }
  },
  deleted_at: { type: DataTypes.DATE }
}, {
  sequelize, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'student_tests'

})

StudentTest.belongsTo(studentModel, { foreignKey: 'student_id', as: 'students' })
StudentTest.belongsTo(testModel, { foreignKey: 'test_id', as: 'tests' })
StudentTest.belongsTo(testDetailModel, { foreignKey: 'test_detail_id', as: 'testDetails' })
testDetailModel.hasMany(StudentTest, { foreignKey: 'test_detail_id', as: 'studentTests' })

StudentTest.belongsTo(StudentCalcTest, { foreignKey: 'student_calc_test_id', as: 'studentCalcTest' })
StudentCalcTest.hasMany(StudentTest, { foreignKey: 'student_calc_test_id', as: 'studentTest' })

module.exports = StudentTest
