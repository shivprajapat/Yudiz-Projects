'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.renameColumn('student_details', 'createdAt', 'created_at'),
      queryInterface.renameColumn('student_details', 'updatedAt', 'updated_at')
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.renameColumn('student_details', 'createdAt', 'created_at'),
      queryInterface.renameColumn('student_details', 'updatedAt', 'updated_at')
    ])
  }
}
