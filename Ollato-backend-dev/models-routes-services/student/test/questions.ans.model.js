const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { status } = require('../../../data')
const QusModel = require('./questions.model')

class QusAns extends Sequelize.Model {}

QusAns.init({
  custom_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  question_id: { type: DataTypes.INTEGER, references: { model: 'questions', key: 'id' }, allowNull: false },
  ans_desc: { type: DataTypes.STRING, allowNull: false },
  filename: { type: DataTypes.STRING, allowNull: true },
  is_correct_ans: { type: DataTypes.BOOLEAN, allowNull: false },
  path: { type: DataTypes.STRING, allowNull: true },
  contenttype: { type: DataTypes.STRING, allowNull: true },
  sort_order: { type: DataTypes.INTEGER, allowNull: true },
  is_image: { type: DataTypes.BOOLEAN, allowNull: false },
  is_math: { type: DataTypes.BOOLEAN, allowNull: false },
  math_expression: { type: DataTypes.STRING, allowNull: true },
  is_active: { type: DataTypes.ENUM(status) },
  deleted_at: { type: DataTypes.DATE },
  created_by: { type: DataTypes.STRING, allowNull: true },
  updated_by: { type: DataTypes.STRING, allowNull: true }
}, {
  sequelize, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'question_ans'
})

QusAns.belongsTo(QusModel, { foreignKey: 'question_id', as: 'questions' })
QusModel.hasMany(QusAns, { foreignKey: 'question_id', as: 'options' })
module.exports = QusAns
