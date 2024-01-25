const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { redeemStatus } = require('../../../data')
const CenterModel = require('../Auth/center.model')

class CenterRevenue extends Sequelize.Model {}

CenterRevenue.init({
  center_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'centers', // 'centers' refers to table name
      key: 'id', // 'id' refers to column name in centers table
      allowNull: true
    }
  },
  amount: {
    type: DataTypes.FLOAT,
    defaultValue: false
  },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  receipt: { type: DataTypes.STRING() },
  status: { type: DataTypes.ENUM(redeemStatus), defaultValue: 'pending' } // pending, paid, rejected
}, {
  sequelize,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'center_redemption'
})

CenterRevenue.belongsTo(CenterModel, { foreignKey: 'center_id', as: 'centers' })

module.exports = CenterRevenue
