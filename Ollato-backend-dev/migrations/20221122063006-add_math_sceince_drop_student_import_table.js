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
      queryInterface.addColumn('student_imports', 'math_dropped', { type: Sequelize.BOOLEAN, defaultValue: true, after: 'school' }),
      queryInterface.addColumn('student_imports', 'science_dropped', { type: Sequelize.BOOLEAN, defaultValue: true, after: 'math_dropped' })
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
      queryInterface.removeColumn('student_imports', 'math_dropped'),
      queryInterface.removeColumn('student_imports', 'science_dropped')
    ])
  }
}
