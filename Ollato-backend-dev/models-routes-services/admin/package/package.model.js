const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { status } = require('../../../data')

class Package extends Sequelize.Model {}

Package.init({
  custom_id: { type: DataTypes.STRING(), allowNull: true },
  title: { type: DataTypes.STRING(), allowNull: false },
  amount: { type: DataTypes.FLOAT(), allowNull: false, defaultValue: 0.00 },
  gst_percent: { type: DataTypes.FLOAT(), allowNull: true, defaultValue: 18.00 },
  package_number: { type: DataTypes.INTEGER(), allowNull: false },
  package_type: { type: DataTypes.ENUM('subcription', 'addon'), allowNull: false },
  online_test: { type: DataTypes.BOOLEAN(), allowNull: false, defaultValue: false },
  test_report: { type: DataTypes.BOOLEAN(), allowNull: false, defaultValue: false },
  video_call: { type: DataTypes.BOOLEAN(), allowNull: false, defaultValue: false },
  f2f_call: { type: DataTypes.BOOLEAN(), allowNull: false, defaultValue: false },
  description: { type: Sequelize.TEXT(), allowNull: true },
  sort_order: { type: Sequelize.INTEGER(11), defaultValue: '0' },
  is_active: { type: Sequelize.ENUM(status), defaultValue: 'y' }, // y = Active, n = Inactive
  created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  updated_at: Sequelize.DATE,
  created_by: { type: Sequelize.STRING(), allowNull: true },
  updated_by: { type: Sequelize.STRING(), allowNull: true },
  deleted_at: { type: Sequelize.DATE, allowNull: true }
}, {
  sequelize,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  timestamps: true,
  tableName: 'packages'
})

module.exports = Package
