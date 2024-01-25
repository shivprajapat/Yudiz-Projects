const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { redeemStatus } = require('../../../data')
const CounsellorModel = require('../counsellor.model')

class CounsellorRevenue extends Sequelize.Model {}

CounsellorRevenue.init({
  counsellor_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'counsellors', // 'counsellors' refers to table name
      key: 'id', // 'id' refers to column name in counsellors table
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
  tableName: 'counsellor_redemption'
})

CounsellorRevenue.belongsTo(CounsellorModel, { foreignKey: 'counsellor_id', as: 'counsellors' })

module.exports = CounsellorRevenue
