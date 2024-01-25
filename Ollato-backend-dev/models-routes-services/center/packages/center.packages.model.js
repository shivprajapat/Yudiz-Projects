const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const packageModel = require('../../admin/package/package.model')
const centerModel = require('../Auth/center.model')
const { paymentStatus, couponType } = require('../../../data')
class CenterPackages extends Sequelize.Model {}

CenterPackages.init({
  custom_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  package_id: { type: DataTypes.INTEGER, references: { model: 'packages', key: 'id' }, allowNull: true },
  center_id: { type: DataTypes.INTEGER, references: { model: 'centers', key: 'id' }, allowNull: true },
  package_type: { type: DataTypes.STRING, unique: true, allowNull: false },
  payment_status: { type: DataTypes.ENUM(paymentStatus), allowNull: true, defaultValue: 'P' },
  transaction_id: { type: DataTypes.STRING, allowNull: true },
  order_id: { type: DataTypes.STRING, allowNull: true },
  invoice_path: { type: DataTypes.STRING, unique: true, allowNull: true },
  purchase_date: { type: DataTypes.DATE },
  total_packages: { type: DataTypes.INTEGER, allowNull: true },
  assigned_packages: { type: DataTypes.INTEGER, allowNull: true },
  remaining_packages: { type: DataTypes.INTEGER, allowNull: true },
  total_amount: { type: DataTypes.INTEGER, allowNull: true },
  final_amount: { type: DataTypes.FLOAT, allowNull: true },
  coupon_code: { type: DataTypes.STRING, allowNull: true },
  coupon_type: { type: DataTypes.ENUM(couponType), allowNull: true },
  amount_percentage: { type: DataTypes.INTEGER, allowNull: true },
  package_amount: { type: DataTypes.INTEGER, allowNull: true },
  gst_amount: { type: DataTypes.INTEGER, allowNull: true },
  onlineTest: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  testReport: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  videoCall: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  f2fCall: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false }
}, {
  sequelize, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'center_packages'

})

CenterPackages.belongsTo(packageModel, { foreignKey: 'package_id', as: 'packages' })
CenterPackages.belongsTo(centerModel, { foreignKey: 'center_id', as: 'centers' })

module.exports = CenterPackages
