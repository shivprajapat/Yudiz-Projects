'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.renameColumn('students', 'createdAt', 'created_at'),
      queryInterface.renameColumn('students', 'updatedAt', 'updated_at')
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.renameColumn('students', 'createdAt', 'created_at'),
      queryInterface.renameColumn('students', 'updatedAt', 'updated_at')
    ])
  }
}
