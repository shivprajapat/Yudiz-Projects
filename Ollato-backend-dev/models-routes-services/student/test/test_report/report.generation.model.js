const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../../database/sequelize')

class ReportGeneration extends Sequelize.Model {}

ReportGeneration.init({
  test_custom_id: { type: DataTypes.STRING, allowNull: false },
  student_id: { type: DataTypes.INTEGER, references: { model: 'students', key: 'id' }, allowNull: false },
  is_generated: { type: DataTypes.BOOLEAN, default: false },
  deleted_at: { type: DataTypes.DATE }
}, {
  sequelize, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'report_generation'
})

module.exports = ReportGeneration
