'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('student_password_resets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email_mobile: {
        type: Sequelize.STRING
      },
      otp: {
        type: Sequelize.INTEGER
      },
      token: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('student_password_resets')
  }
}
