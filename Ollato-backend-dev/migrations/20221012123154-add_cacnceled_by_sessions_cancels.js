'use strict'
const { canceleddBy } = require('../data')

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.addColumn('sessions_cancels', 'canceled_by', { type: Sequelize.ENUM(canceleddBy), allowNull: true, after: 'reason', defaultValue: 'student' })
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.removeColumn('sessions_cancels', 'canceled_by')
    ])
  }
}
