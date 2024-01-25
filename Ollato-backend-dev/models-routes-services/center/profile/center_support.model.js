const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { status } = require('../../../data')
const CenterModel = require('../Auth/center.model')
const IssueCategoryModel = require('../../admin/issue-category/counsellor_issue_category.model')

class CenterSupport extends Sequelize.Model {}

CenterSupport.init({
  custom_id: { type: DataTypes.STRING(), allowNull: true },
  center_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'centers', // 'counsellors' refers to table name
      key: 'id' // 'id' refers to column name in counsellors table
    }
  },
  issue_category_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'counsellor_issue_category', // 'counsellor_issue_category' refers to table name
      key: 'id' // 'id' refers to column name in counsellor_issue_category table
    }
  },
  query_desc: { type: DataTypes.STRING(), allowNull: false },
  is_active: { type: DataTypes.ENUM(status), defaultValue: 'y' }, // y = Active, n = Inactive
  created_by: { type: DataTypes.STRING(), allowNull: true },
  updated_by: { type: DataTypes.STRING(), allowNull: true },
  deleted_at: { type: DataTypes.DATE(), allowNull: true }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'center_support'
})

CenterSupport.belongsTo(CenterModel, { foreignKey: 'center_id', as: 'center' })
CenterSupport.belongsTo(IssueCategoryModel, { foreignKey: 'issue_category_id', as: 'issue_category' })

module.exports = CenterSupport
