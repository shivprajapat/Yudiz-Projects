const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { status } = require('../../../data')
const TestDetail = require('./test.detail.model')

class InterestSynopsis extends Sequelize.Model {}

InterestSynopsis.init({
  custom_id: { type: DataTypes.STRING(), allowNull: true },
  test_detail_id: { type: DataTypes.INTEGER, references: { model: 'test_details', key: 'id' } },
  sub_title: { type: DataTypes.STRING(), allowNull: true },
  core_values: { type: DataTypes.TEXT(), allowNull: true },
  personality_traits: { type: DataTypes.TEXT(), allowNull: true },
  job_tasks: { type: DataTypes.TEXT(), allowNull: true },
  occupations: { type: DataTypes.TEXT(), allowNull: true },
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
  tableName: 'interest_synopsis'
})
InterestSynopsis.belongsTo(TestDetail, { foreignKey: 'test_detail_id', as: 'test_details' })
module.exports = InterestSynopsis
