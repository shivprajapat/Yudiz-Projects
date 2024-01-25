const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const CounsellorModel = require('../../counsellor/counsellor.model')
const StudentModel = require('../../student/auth/student.model')
const PackageModel = require('../../admin/package/package.model')
const CenterPackageModel = require('../../center/packages/center.packages.model')

class CounsellorRevenue extends Sequelize.Model {}

CounsellorRevenue.init({
  custom_id: { type: DataTypes.STRING, allowNull: true },
  counsellor_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'centers', // 'centers' refers to table name
      key: 'id', // 'id' refers to column name in countries table
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
  center_package_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'center_packages', // 'center_packages' refers to table name
      key: 'id' // 'id' refers to column name in countries table
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
  tableName: 'counsellor_revenue'
})

CounsellorRevenue.belongsTo(CounsellorModel, { foreignKey: 'counsellor_id', as: 'counsellors' })
CounsellorRevenue.belongsTo(StudentModel, { foreignKey: 'student_id', as: 'students' })
CounsellorRevenue.belongsTo(PackageModel, { foreignKey: 'package_id', as: 'packages' })
CounsellorRevenue.belongsTo(CenterPackageModel, { foreignKey: 'center_package_id', as: 'center_packages' })

module.exports = CounsellorRevenue
