/* eslint-disable camelcase */
'use strict'
const { sequelize, Sequelize } = require('../../../database/sequelize')

class admin_password_resets extends Sequelize.Model {}

admin_password_resets.init({
  email: { type: Sequelize.STRING(), allowNull: false },
  token: { type: Sequelize.STRING(), allowNull: false },
  created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  OTP: { type: Sequelize.STRING(), allowNull: true }
}, {
  sequelize,
  createdAt: 'created_at',
  modelName: 'admin_password_resets',
  tableName: 'admin_password_resets',
  updatedAt: false
})
admin_password_resets.removeAttribute('id')
module.exports = admin_password_resets
