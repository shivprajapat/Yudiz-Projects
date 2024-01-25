const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { status } = require('../../../data')
const testModel = require('./test.model')

class TestDetail extends Sequelize.Model {}

TestDetail.init({
  custom_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  title: { type: DataTypes.STRING, allowNull: false },
  test_id: { type: DataTypes.INTEGER, references: { model: 'tests', key: 'id' }, allowNull: true },
  sub_test_abb: { type: DataTypes.STRING, allowNull: false },
  no_of_questions: { type: DataTypes.INTEGER, allowNull: true },
  no_options: { type: DataTypes.INTEGER, allowNull: true },
  meaning: { type: DataTypes.TEXT, allowNull: true },
  synopsis: { type: DataTypes.TEXT, allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  sort_order: { type: DataTypes.INTEGER, allowNull: true },
  is_active: { type: DataTypes.ENUM(status) },
  deleted_at: { type: DataTypes.DATE },
  created_by: { type: DataTypes.STRING, allowNull: true },
  updated_by: { type: DataTypes.STRING, allowNull: true }
}, {
  sequelize, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'test_details'

})
TestDetail.belongsTo(testModel, { foreignKey: 'test_id', as: 'tests' })
testModel.hasMany(TestDetail, { foreignKey: 'test_id', as: 'test_details' })
module.exports = TestDetail
