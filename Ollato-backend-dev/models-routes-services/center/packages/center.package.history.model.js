const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const centerModel = require('../Auth/center.model')
const packageModel = require('../../admin/package/package.model')
const { paymentStatus } = require('../../../data')
class CenterPackagesHistory extends Sequelize.Model {}

CenterPackagesHistory.init({

  custom_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  center_id: { type: DataTypes.INTEGER, references: { model: 'centers', key: 'id' }, allowNull: true },
  package_id: { type: DataTypes.INTEGER, references: { model: 'packages', key: 'id' }, allowNull: true },
  transaction_id: { type: DataTypes.STRING, allowNull: false },
  order_id: { type: DataTypes.STRING, allowNull: true },
  order_signature: { type: DataTypes.STRING, allowNull: true },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.ENUM(paymentStatus), allowNull: false }
}, {
  sequelize, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'center_payment_histories'

})

CenterPackagesHistory.belongsTo(centerModel, { foreignKey: 'center_id', as: 'centers' })
CenterPackagesHistory.belongsTo(packageModel, { foreignKey: 'package_id', as: 'packages' })
module.exports = CenterPackagesHistory
