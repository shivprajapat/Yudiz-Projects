const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const studentModel = require('../auth/student.model')
class StudentPackagesDetail extends Sequelize.Model {}

StudentPackagesDetail.init({

  custom_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  student_id: { type: DataTypes.INTEGER, references: { model: 'packages', key: 'id' }, allowNull: true },
  online_test: { type: DataTypes.INTEGER(), allowNull: false, defaultValue: 0 },
  test_report: { type: DataTypes.INTEGER(), allowNull: false, defaultValue: 0 },
  video_call: { type: DataTypes.INTEGER(), allowNull: false, defaultValue: 0 },
  f2f_call: { type: DataTypes.INTEGER(), allowNull: false, defaultValue: 0 }
}, {
  sequelize, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'student_package_detail'

})

StudentPackagesDetail.belongsTo(studentModel, { foreignKey: 'student_id', as: 'students' })

module.exports = StudentPackagesDetail
