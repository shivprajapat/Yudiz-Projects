'use strict'
const { status } = require('../data')

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('emailtemplates', {
      id: { type: Sequelize.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      title: { type: Sequelize.STRING(), allowNull: false },
      description: { type: Sequelize.TEXT(), allowNull: true },
      slug: { type: Sequelize.STRING(), allowNull: false, unique: true },
      subject: { type: Sequelize.STRING(), allowNull: true },
      content: { type: Sequelize.STRING(), allowNull: true },
      is_active: { type: Sequelize.ENUM(status), defaultValue: 'y' }, // Y = Active, N = Inactive
      external_id: { type: Sequelize.STRING(), allowNull: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: Sequelize.DATE,
      created_by: { type: Sequelize.STRING(), allowNull: true },
      updated_by: { type: Sequelize.STRING(), allowNull: true }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('emailtemplates')
  }
}
