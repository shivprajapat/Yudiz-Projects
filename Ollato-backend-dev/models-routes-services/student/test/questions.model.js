const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { status } = require('../../../data')
const testDetailModel = require('./test.detail.model')
class Questions extends Sequelize.Model {}

Questions.init({
  custom_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  test_detail_id: { type: DataTypes.INTEGER, references: { model: 'test_details', key: 'id' }, allowNull: false },
  question: { type: DataTypes.STRING, allowNull: true },
  path: { type: DataTypes.STRING, allowNull: true },
  contenttype: { type: DataTypes.STRING, allowNull: true },
  marks: { type: DataTypes.INTEGER, allowNull: false },
  time_Sec: { type: DataTypes.INTEGER, allowNull: false },
  sort_order: { type: DataTypes.INTEGER, allowNull: false },
  is_image: { type: DataTypes.BOOLEAN, allowNull: false },
  is_math: { type: DataTypes.BOOLEAN, allowNull: false },
  math_expression: { type: DataTypes.STRING, allowNull: true },
  is_active: { type: DataTypes.ENUM(status) },
  deleted_at: { type: DataTypes.DATE },
  created_by: { type: DataTypes.STRING, allowNull: true },
  updated_by: { type: DataTypes.STRING, allowNull: true }
}, {
  sequelize, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'questions'

})
Questions.belongsTo(testDetailModel, { foreignKey: 'test_detail_id', as: 'testDetails' })
testDetailModel.hasMany(Questions, { foreignKey: 'test_detail_id', as: 'questions' })
module.exports = Questions
