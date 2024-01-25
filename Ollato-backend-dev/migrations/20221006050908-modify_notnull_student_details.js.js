'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn('student_details', 'school_address_1', { type: Sequelize.STRING, allowNull: true }),
      queryInterface.changeColumn('student_details', 'school_country_id', { type: Sequelize.INTEGER(11), allowNull: true }),
      queryInterface.changeColumn('student_details', 'school_state_id', { type: Sequelize.INTEGER(11), allowNull: true }),
      queryInterface.changeColumn('student_details', 'school_city_id', { type: Sequelize.INTEGER(11), allowNull: true }),
      queryInterface.changeColumn('student_details', 'school_pin_code', { type: Sequelize.STRING, allowNull: true })
    ])
  },

  async down (queryInterface, Sequelize) {
  }
}
