const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')

class StudentTestAns extends Sequelize.Model {}

StudentTestAns.init({
  custom_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  student_id: { type: DataTypes.INTEGER, references: { model: 'students', key: 'id' }, allowNull: false },
  student_test_id: { type: DataTypes.INTEGER, references: { model: 'student_tests', key: 'id' }, allowNull: false },
  question_id: { type: DataTypes.INTEGER, references: { model: 'questions', key: 'id' }, allowNull: false },
  question_ans_id: { type: DataTypes.INTEGER, references: { model: 'question_ans', key: 'id' }, allowNull: false },
  is_correct_ans: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  marks_obtained: { type: DataTypes.INTEGER, allowNull: true, defaultValue: '0' },
  deleted_at: { type: DataTypes.DATE }
}, {
  sequelize, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'student_test_ans'

})

module.exports = StudentTestAns
