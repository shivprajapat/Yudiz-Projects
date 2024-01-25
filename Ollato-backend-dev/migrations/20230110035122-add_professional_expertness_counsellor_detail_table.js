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
      await queryInterface.addColumn('counsellor_details', 'professional_expertness', { type: Sequelize.STRING, after: 'certificate_university_id', allowNull: true })
      // await queryInterface.removeIndex('counsellor_details', 'professional_expert_id'),
      // await queryInterface.removeColumn('counsellor_details', 'professional_expert_id'),
      // await queryInterface.removeIndex('counsellor_details', 'professional_expertness_id'),
      // await queryInterface.removeColumn('counsellor_details', 'professional_expertness_id')
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
      await queryInterface.removeColumn('counsellor_details', 'professional_expertness')
    ])
  }
}
