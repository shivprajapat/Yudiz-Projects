/* eslint-disable camelcase */
'use strict'
const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')

class register_email_verifies extends Sequelize.Model {}

register_email_verifies.init({
  email_mobile: { type: DataTypes.STRING, unique: true },
  otp: DataTypes.INTEGER
}, {
  sequelize,
  modelName: 'register_email_verifies',
  tableName: 'register_email_verifies',
  createdAt: 'created_at',
  updatedAt: 'updated_at'
})

module.exports = register_email_verifies
