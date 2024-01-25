'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.addColumn('students', 'math_dropped', { type: Sequelize.BOOLEAN, defaultValue: true, after: 'verified_at' }),
      queryInterface.addColumn('students', 'science_dropped', { type: Sequelize.BOOLEAN, defaultValue: true, after: 'math_dropped' })
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
      queryInterface.removeColumn('students', 'math_dropped'),
      queryInterface.removeColumn('students', 'science_dropped')
    ])
  }
}
