const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { status, couponType } = require('../../../data')

class CouponCode extends Sequelize.Model {}

CouponCode.init({
  custom_id: { type: DataTypes.STRING(), allowNull: true },
  title: { type: DataTypes.STRING(), allowNull: false },
  description: { type: DataTypes.STRING(), allowNull: true },
  code: { type: DataTypes.STRING(), allowNull: false },
  coupon_type: { type: DataTypes.ENUM(couponType), allowNull: true },
  amount_percentage: { type: DataTypes.INTEGER, allowNull: true },
  from_date: { type: DataTypes.DATEONLY, allowNull: false },
  to_date: { type: DataTypes.DATEONLY, allowNull: false },
  number_time_use: { type: DataTypes.INTEGER(11), allowNull: false },
  remaining_time_use: { type: DataTypes.INTEGER(11), allowNull: false },
  is_active: { type: DataTypes.ENUM(status), defaultValue: 'y' }, // y = Active, n = Inactive
  deleted_at: { type: Sequelize.DATE, allowNull: true }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'coupon_code'
})

module.exports = CouponCode
