const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')

class StudentImport extends Sequelize.Model {}
StudentImport.init({
  first_name: { type: DataTypes.STRING(), allowNull: false },
  last_name: { type: DataTypes.STRING(), allowNull: false },
  email: { type: DataTypes.STRING(), allowNull: true },
  mobile: { type: DataTypes.STRING(), allowNull: false },
  country: { type: DataTypes.STRING(), allowNull: false },
  state: { type: DataTypes.STRING(), allowNull: false },
  city: { type: DataTypes.STRING(), allowNull: false },
  grade: { type: DataTypes.STRING(), allowNull: false },
  board: { type: DataTypes.STRING(), allowNull: false },
  school: { type: DataTypes.STRING(), allowNull: false },
  math_dropped: { type: DataTypes.BOOLEAN, allowNull: true },
  science_dropped: { type: DataTypes.BOOLEAN, allowNull: true },
  package_id: { type: DataTypes.INTEGER, allowNull: false },
  center_id: { type: DataTypes.INTEGER, allowNull: true },
  center_email: { type: DataTypes.STRING(), allowNull: true }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'student_imports'

})

module.exports = StudentImport
