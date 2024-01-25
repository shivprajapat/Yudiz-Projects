'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('sessions', 'student_package_id', { type: Sequelize.INTEGER, references: { model: 'student_packages', key: 'id' }, allowNull: true, defaultValue: null, after: 'student_id' })
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('sessions', 'student_package_id')
    ])
  }
}
