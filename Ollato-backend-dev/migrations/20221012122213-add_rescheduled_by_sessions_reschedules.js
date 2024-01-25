'use strict'
const { rescheduledBy } = require('../data')

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.addColumn('sessions_reschedules', 'rescheduled_by', { type: Sequelize.ENUM(rescheduledBy), allowNull: true, after: 'reason', defaultValue: 'student' })
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
      queryInterface.removeColumn('sessions_reschedules', 'rescheduled_by')
    ])
  }
}
