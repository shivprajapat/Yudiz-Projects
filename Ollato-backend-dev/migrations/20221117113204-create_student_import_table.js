'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('student_imports', {
      id: { type: Sequelize.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      first_name: { type: Sequelize.STRING(), allowNull: false },
      last_name: { type: Sequelize.STRING(), allowNull: false },
      email: { type: Sequelize.STRING(), allowNull: false },
      mobile: { type: Sequelize.STRING(), allowNull: false },
      country: { type: Sequelize.STRING(), allowNull: false },
      state: { type: Sequelize.STRING(), allowNull: false },
      city: { type: Sequelize.STRING(), allowNull: false },
      grade: { type: Sequelize.STRING(), allowNull: false },
      board: { type: Sequelize.STRING(), allowNull: false },
      school: { type: Sequelize.STRING(), allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: Sequelize.DATE
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('student_imports')
  }
}
