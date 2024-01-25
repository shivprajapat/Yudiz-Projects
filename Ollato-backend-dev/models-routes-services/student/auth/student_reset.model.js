/* eslint-disable camelcase */
'use strict'
const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')

class student_password_resets extends Sequelize.Model {}

student_password_resets.init({
  email_mobile: DataTypes.STRING,
  otp: DataTypes.INTEGER,
  token: DataTypes.STRING
}, {
  sequelize,
  modelName: 'student_password_resets',
  tableName: 'student_password_resets',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

module.exports = student_password_resets
