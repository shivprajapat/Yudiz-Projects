const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { status } = require('../../../data')
const softwareMatrixModel = require('./software.matrix.model')
const testDetailModel = require('../../student/test/test.detail.model')

class SoftwareMetrixDetails extends Sequelize.Model {}

SoftwareMetrixDetails.init({
  custom_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  software_matrix_id: { type: DataTypes.INTEGER, references: { model: 'software_matrix', as: 'id' } },
  test_detail_id: { type: DataTypes.INTEGER, references: { model: 'test_details', as: 'id' } },
  norm_values: { type: DataTypes.STRING, allowNull: false },
  is_active: { type: DataTypes.ENUM(status), allowNull: false, defaultValue: 'y' },
  deleted_at: { type: DataTypes.DATE, allowNull: true },
  created_by: { type: DataTypes.STRING, allowNull: true },
  updated_by: { type: DataTypes.STRING, allowNull: true }
}, {
  sequelize,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'software_matrix_details'
})

SoftwareMetrixDetails.belongsTo(softwareMatrixModel, { foreignKey: 'software_matrix_id', as: 'softwareMatrix' })
softwareMatrixModel.hasMany(SoftwareMetrixDetails, { foreignKey: 'software_matrix_id', as: 'softwareAllMatrix' })
SoftwareMetrixDetails.belongsTo(testDetailModel, { foreignKey: 'test_detail_id', as: 'testDetailsSoftware' })

module.exports = SoftwareMetrixDetails
