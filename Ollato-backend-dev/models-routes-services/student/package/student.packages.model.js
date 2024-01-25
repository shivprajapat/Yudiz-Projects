const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const packageModel = require('../../../models-routes-services/admin/package/package.model')
const studentModel = require('../../../models-routes-services/student/auth/student.model')
const { paymentStatus, couponType } = require('../../../data')
class StudentPackages extends Sequelize.Model {}

StudentPackages.init({

  custom_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  center_id: { type: DataTypes.INTEGER, references: { model: 'centers', key: 'id' }, allowNull: true },
  package_id: { type: DataTypes.INTEGER, references: { model: 'packages', key: 'id' }, allowNull: true },
  student_id: { type: DataTypes.INTEGER, references: { model: 'students', key: 'id' }, allowNull: true },
  package_type: { type: DataTypes.STRING, unique: true, allowNull: false },
  payment_status: { type: DataTypes.ENUM(paymentStatus), allowNull: true, defaultValue: 'P' },
  invoice_path: { type: DataTypes.STRING, unique: true, allowNull: true },
  transaction_id: { type: DataTypes.STRING, allowNull: true },
  order_id: { type: DataTypes.STRING, allowNull: true },
  amount: { type: DataTypes.FLOAT, allowNull: true },
  final_amount: { type: DataTypes.FLOAT, allowNull: true },
  coupon_code: { type: DataTypes.STRING, allowNull: true },
  coupon_type: { type: DataTypes.ENUM(couponType), allowNull: true },
  amount_percentage: { type: DataTypes.INTEGER, allowNull: true },
  purchase_date: { type: DataTypes.DATE },
  expireDate: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
  isExpired: { type: DataTypes.BOOLEAN, allowNull: true },
  onlineTest: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  testReport: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  videoCall: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  f2fCall: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false }
}, {
  sequelize, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'student_packages'

})

StudentPackages.belongsTo(packageModel, { foreignKey: 'package_id', as: 'packages' })
StudentPackages.belongsTo(studentModel, { foreignKey: 'student_id', as: 'students' })

module.exports = StudentPackages
