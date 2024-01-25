const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { status } = require('../../../data')
const testDetailModel = require('./test.detail.model')
class TestTimeNorms extends Sequelize.Model {}

TestTimeNorms.init({
  custom_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  test_detail_id: { type: DataTypes.INTEGER, references: { model: 'test_details', key: 'id' }, allowNull: false },
  grade_id: { type: DataTypes.INTEGER, references: { model: 'grades', key: 'id' }, allowNull: false },
  time_Sec: { type: DataTypes.INTEGER, allowNull: false },
  is_active: { type: DataTypes.ENUM(status) },
  deleted_at: { type: DataTypes.DATE },
  created_by: { type: DataTypes.STRING, allowNull: true },
  updated_by: { type: DataTypes.STRING, allowNull: true }
}, {
  sequelize, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'test_time_norms'

})
testDetailModel.hasOne(TestTimeNorms, { foreignKey: 'test_detail_id', as: 'test_time' })
TestTimeNorms.belongsTo(testDetailModel, { foreignKey: 'test_detail_id', as: 'testDetails' })
module.exports = TestTimeNorms
