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
      await queryInterface.addColumn('student_imports', 'package_id', { type: Sequelize.INTEGER(11), after: 'science_dropped', allowNull: false })
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
      await queryInterface.removeColumn('student_imports', 'package_id')
    ])
  }
}

// ALTER TABLE student_imports ADD COLUMN package_id INTEGER DEFAULT 0 AFTER science_dropped;
// DONE dev-prod
