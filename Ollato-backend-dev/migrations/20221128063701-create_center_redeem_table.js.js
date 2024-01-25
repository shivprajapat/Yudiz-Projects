'use strict'
const { redeemStatus } = require('../data')
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('center_redemption', {
      id: { type: Sequelize.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      center_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'centers', // 'centers' refers to table name
          key: 'id' // 'id' refers to column name in centers table
        }
      },
      amount: { type: Sequelize.FLOAT, defaultValue: false, allowNull: false },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      receipt: { type: Sequelize.STRING() },
      status: { type: Sequelize.ENUM(redeemStatus), defaultValue: 'pending' }, // pending, paid, rejected
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: Sequelize.DATE
    })
  },

  async down (queryInterface) {
    await queryInterface.dropTable('center_redemption')
  }
}
