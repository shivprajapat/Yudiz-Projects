const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const TestsModel = require('../../student/test/test.model')
const TestDetailModel = require('../../student/test/test.detail.model')
const NormModel = require('../../admin/norms/norms.model')
const { status } = require('../../../data')

class TestNormDescription extends Sequelize.Model {}

TestNormDescription.init({
  custom_id: { type: DataTypes.STRING(), allowNull: true },
  test_id: { type: DataTypes.INTEGER, references: { model: 'tests', key: 'id' } },
  test_detail_id: { type: DataTypes.INTEGER, references: { model: 'test_details', key: 'id' } },
  norm_id: { type: DataTypes.INTEGER, references: { model: 'norms', key: 'id' } },
  norm: { type: DataTypes.STRING(), allowNull: true },
  description: { type: DataTypes.TEXT(), allowNull: true },
  plan_of_action: { type: DataTypes.TEXT(), allowNull: true },
  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  created_by: { type: DataTypes.STRING(), allowNull: true },
  updated_by: { type: DataTypes.STRING(), allowNull: true },
  deleted_at: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
  is_active: { type: DataTypes.ENUM(status), defaultValue: 'y' } // y = Active, n = Inactive
}, {
  sequelize,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'test_norm_descriptions'
})

TestNormDescription.belongsTo(TestsModel, { foreignKey: 'test_id', as: 'tests' })
TestNormDescription.belongsTo(TestDetailModel, { foreignKey: 'test_detail_id', as: 'test_details' })
TestNormDescription.belongsTo(NormModel, { foreignKey: 'norm_id', as: 'norms' })

module.exports = TestNormDescription
