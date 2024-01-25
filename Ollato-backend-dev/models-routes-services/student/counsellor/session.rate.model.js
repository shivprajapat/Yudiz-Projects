const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { status } = require('../../../data')
class StudentReviews extends Sequelize.Model {}

StudentReviews.init({
  id: { type: DataTypes.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
  custom_id: { type: DataTypes.STRING(), allowNull: true },
  counsellor_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'counsellors', // 'counsellors' refers to table name
      key: 'id' // 'id' refers to column name in counsellors table
    },
    allowNull: false
  },
  student_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'students', // 'students' refers to table name
      key: 'id' // 'id' refers to column name in students table
    },
    allowNull: false
  },
  session_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'sessions', // 'sessions' refers to table name
      key: 'id' // 'id' refers to column name in sessions table
    },
    allowNull: false
  },
  message: { type: DataTypes.STRING, allowNull: true },
  ratings: { type: DataTypes.INTEGER(), allowNull: true },
  is_active: { type: DataTypes.ENUM(status), defaultValue: 'y' }, // y = Active, n = Inactive
  created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
  updated_at: DataTypes.DATE,
  created_by: { type: DataTypes.STRING(), allowNull: true },
  updated_by: { type: DataTypes.STRING(), allowNull: true },
  deleted_at: { type: DataTypes.DATE, allowNull: true, defaultValue: null }
}, {
  sequelize, timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at', tableName: 'student_reviews'

})

module.exports = StudentReviews
