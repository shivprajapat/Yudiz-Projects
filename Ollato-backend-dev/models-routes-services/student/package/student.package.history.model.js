const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const studentModel = require('../auth/student.model')
const packageModel = require('../../../models-routes-services/admin/package/package.model')
const { paymentStatus } = require('../../../data')
class StudentPackagesHistory extends Sequelize.Model {}

StudentPackagesHistory.init({

  custom_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  student_id: { type: DataTypes.INTEGER, references: { model: 'students', key: 'id' }, allowNull: true },
  package_id: { type: DataTypes.INTEGER, references: { model: 'packages', key: 'id' }, allowNull: true },
  transaction_id: { type: DataTypes.STRING, allowNull: false },
  order_id: { type: DataTypes.STRING, allowNull: true },
  order_signature: { type: DataTypes.STRING, allowNull: true },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.ENUM(paymentStatus), allowNull: false }
}, {
  sequelize, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'student_payment_histories'

})

StudentPackagesHistory.belongsTo(studentModel, { foreignKey: 'student_id', as: 'students' })
StudentPackagesHistory.belongsTo(packageModel, { foreignKey: 'package_id', as: 'packages' })
module.exports = StudentPackagesHistory
