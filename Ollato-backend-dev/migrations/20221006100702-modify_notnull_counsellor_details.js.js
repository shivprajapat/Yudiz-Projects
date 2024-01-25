'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('counsellor_details', 'high_qualification_id', { type: Sequelize.INTEGER(11), allowNull: true }),
      queryInterface.changeColumn('counsellor_details', 'high_university_id', { type: Sequelize.INTEGER(11), allowNull: true }),
      queryInterface.changeColumn('counsellor_details', 'last_qualification_id', { type: Sequelize.INTEGER(11), allowNull: true }),
      queryInterface.changeColumn('counsellor_details', 'last_university_id', { type: Sequelize.INTEGER(11), allowNull: true }),
      queryInterface.changeColumn('counsellor_details', 'certificate_qualification_id', { type: Sequelize.INTEGER(11), allowNull: true }),
      queryInterface.changeColumn('counsellor_details', 'certificate_university_id', { type: Sequelize.INTEGER(11), allowNull: true })
    ])
  },

  async down (queryInterface, Sequelize) {
  }
}
