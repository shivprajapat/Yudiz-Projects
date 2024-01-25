const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const testModel = require('./test.model')
class StudentInterestTest extends Sequelize.Model {}

StudentInterestTest.init({
  custom_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  test_id: { type: DataTypes.INTEGER, references: { model: 'tests', key: 'id' }, allowNull: true },
  student_calc_test_id: { type: DataTypes.INTEGER, references: { model: 'student_calc_tests', key: 'id' }, allowNull: true, defaultValue: null },
  student_id: { type: DataTypes.INTEGER, references: { model: 'students', key: 'id' }, allowNull: false },
  grade_id: { type: DataTypes.INTEGER, references: { model: 'grades', key: 'id' }, allowNull: false },
  package_id: { type: DataTypes.INTEGER, references: { model: 'packages', key: 'id' }, allowNull: true, defaultValue: null },
  student_package_id: { type: DataTypes.INTEGER, references: { model: 'student_packages', key: 'id' }, allowNull: true, defaultValue: null },
  is_submitted: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  submission_Time: { type: DataTypes.DATE, allowNull: true },
  questions: {
    type: DataTypes.STRING,
    allowNull: true,
    set: function(value) {
      return this.setDataValue('questions', JSON.stringify(value))
    }
  },
  deleted_at: { type: DataTypes.DATE }
}, {
  sequelize, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'student_interest_tests'

})

StudentInterestTest.belongsTo(testModel, { foreignKey: 'test_id', as: 'tests' })
testModel.hasOne(StudentInterestTest, { foreignKey: 'test_id', as: 'studentInterestTest' })

module.exports = StudentInterestTest
