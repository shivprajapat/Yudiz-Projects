const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { status } = require('../../../data')
const gradeModel = require('../grade/grade.model')
const testDetailModel = require('../../student/test/test.detail.model')
class TestTimeNorms extends Sequelize.Model {}
TestTimeNorms.init({
  custom_id: { type: DataTypes.STRING(), allowNull: true },
  test_detail_id: { type: DataTypes.INTEGER(), allowNull: false },
  grade_id: { type: DataTypes.INTEGER(), allowNull: false },
  time_Sec: { type: DataTypes.INTEGER(), allowNull: false },
  is_active: { type: DataTypes.ENUM(status), defaultValue: 'y' },
  created_by: { type: DataTypes.STRING(), allowNull: true },
  updated_by: { type: DataTypes.STRING(), allowNull: true },
  deleted_at: { type: DataTypes.DATE(), allowNull: true }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'test_time_norms'

})

TestTimeNorms.belongsTo(gradeModel, { foreignKey: 'grade_id', as: 'grades' })
TestTimeNorms.belongsTo(testDetailModel, { foreignKey: 'test_detail_id', as: 'test_details' })
module.exports = TestTimeNorms
