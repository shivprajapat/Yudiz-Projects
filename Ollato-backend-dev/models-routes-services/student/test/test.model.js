const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { status } = require('../../../data')

class Test extends Sequelize.Model {}

Test.init({
  custom_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  sort_order: { type: DataTypes.INTEGER, allowNull: true },
  is_active: { type: DataTypes.ENUM(status) },
  deleted_at: { type: DataTypes.DATE },
  created_by: { type: DataTypes.STRING, allowNull: true },
  updated_by: { type: DataTypes.STRING, allowNull: true }
}, {
  sequelize, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'tests'

})

module.exports = Test
