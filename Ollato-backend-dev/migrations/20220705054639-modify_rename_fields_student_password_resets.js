'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.renameColumn('student_password_resets', 'createdAt', 'created_at'),
      queryInterface.renameColumn('student_password_resets', 'updatedAt', 'updated_at')
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.renameColumn('student_password_resets', 'createdAt', 'created_at'),
      queryInterface.renameColumn('student_password_resets', 'updatedAt', 'updated_at')
    ])
  }
}
