'use strict'
const { nationality } = require('../data')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('student_details', {
      id: { type: Sequelize.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      custom_id: { type: Sequelize.STRING, unique: true, allowNull: false },
      student_id: { type: Sequelize.INTEGER, references: { model: 'students', key: 'id' }, allowNull: false },
      country_id: { type: Sequelize.INTEGER, references: { model: 'countries', key: 'id' }, allowNull: false },
      state_id: { type: Sequelize.INTEGER, references: { model: 'states', key: 'id' }, allowNull: false },
      city_id: { type: Sequelize.INTEGER, references: { model: 'cities', key: 'id' }, allowNull: false },
      pin_code: { type: Sequelize.STRING, allowNull: true },
      grade_id: { type: Sequelize.INTEGER, references: { model: 'grades', key: 'id' }, allowNull: false },
      board_id: { type: Sequelize.INTEGER, references: { model: 'boards', key: 'id' }, allowNull: false },
      school_id: { type: Sequelize.INTEGER, references: { model: 'schools', key: 'id' }, allowNull: false },
      nationality: { type: Sequelize.ENUM(nationality) },
      school_address_1: { type: Sequelize.STRING, allowNull: false },
      school_address_2: { type: Sequelize.STRING, allowNull: true },
      school_country_id: { type: Sequelize.INTEGER, references: { model: 'countries', key: 'id' }, allowNull: false },
      school_state_id: { type: Sequelize.INTEGER, references: { model: 'states', key: 'id' }, allowNull: false },
      school_city_id: { type: Sequelize.INTEGER, references: { model: 'cities', key: 'id' }, allowNull: false },
      school_pin_code: { type: Sequelize.STRING, allowNull: false },
      created_by: { type: Sequelize.STRING, allowNull: true },
      updated_by: { type: Sequelize.STRING, allowNull: true }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('student_details')
  }
}
