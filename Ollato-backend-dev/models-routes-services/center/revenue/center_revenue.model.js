const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const CenterModel = require('../Auth/center.model')
const StudentModel = require('../../student/auth/student.model')
const PackageModel = require('../../admin/package/package.model')

class CenterRevenue extends Sequelize.Model {}

CenterRevenue.init({
  custom_id: { type: DataTypes.STRING, allowNull: true },
  center_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'centers', // 'centers' refers to table name
      key: 'id', // 'id' refers to column name in centers table
      allowNull: true
    }
  },
  student_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'students', // 'students' refers to table name
      key: 'id', // 'id' refers to column name in countries table
      allowNull: true
    }
  },
  package_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'packages', // 'packages' refers to table name
      key: 'id', // 'id' refers to column name in countries table
      allowNull: true
    }
  },
  amount: {
    type: DataTypes.FLOAT,
    defaultValue: false
  }
}, {
  sequelize,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'center_revenue'
})

CenterRevenue.belongsTo(CenterModel, { foreignKey: 'center_id', as: 'centers' })
CenterRevenue.belongsTo(StudentModel, { foreignKey: 'student_id', as: 'students' })
CenterRevenue.belongsTo(PackageModel, { foreignKey: 'package_id', as: 'packages' })

module.exports = CenterRevenue
