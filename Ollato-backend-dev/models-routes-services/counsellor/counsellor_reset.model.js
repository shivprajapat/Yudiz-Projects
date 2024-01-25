/* eslint-disable camelcase */
'use strict'
const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../database/sequelize')

class counsellor_password_resets extends Sequelize.Model {}

counsellor_password_resets.init({
  email_mobile: DataTypes.STRING,
  OTP: DataTypes.STRING,
  token: DataTypes.STRING
}, {
  sequelize,
  createdAt: 'created_at',
  modelName: 'counsellor_password_resets',
  tableName: 'counsellor_password_resets',
  updatedAt: false
})
counsellor_password_resets.removeAttribute('id')
module.exports = counsellor_password_resets
