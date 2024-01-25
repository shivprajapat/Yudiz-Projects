'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('counsellor_details', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      custom_id: { type: Sequelize.STRING(), allowNull: false, unique: true },
      counsellor_id: { type: Sequelize.INTEGER, references: { model: 'counsellors', key: 'id' }, allowNull: false },
      resume: { type: Sequelize.STRING(), allowNull: true },
      professional_expertness: { type: Sequelize.STRING(), allowNull: true },
      country_id: { type: Sequelize.INTEGER, references: { model: 'countries', key: 'id' }, allowNull: false },
      state_id: { type: Sequelize.INTEGER, references: { model: 'states', key: 'id' }, allowNull: false },
      city_id: { type: Sequelize.INTEGER, references: { model: 'cities', key: 'id' }, allowNull: false },
      pin_code: { type: Sequelize.STRING, allowNull: true },
      high_qualification_id: { type: Sequelize.INTEGER, references: { model: 'qualifications', key: 'id' }, allowNull: false },
      high_university_id: { type: Sequelize.INTEGER, references: { model: 'universities', key: 'id' }, allowNull: false },
      last_qualification_id: { type: Sequelize.INTEGER, references: { model: 'qualifications', key: 'id' }, allowNull: false },
      last_university_id: { type: Sequelize.INTEGER, references: { model: 'universities', key: 'id' }, allowNull: false },
      certificate_qualification_id: { type: Sequelize.INTEGER, references: { model: 'qualifications', key: 'id' }, allowNull: false },
      certificate_university_id: { type: Sequelize.INTEGER, references: { model: 'universities', key: 'id' }, allowNull: false },
      experience_year: { type: Sequelize.INTEGER, allowNull: true },
      experience_month: { type: Sequelize.INTEGER, allowNull: true },
      pan_number: { type: Sequelize.STRING, allowNull: true },
      pan_file: { type: Sequelize.STRING, allowNull: true },
      adhar_card_number: { type: Sequelize.STRING, allowNull: true },
      adhar_card_number_front: { type: Sequelize.STRING, allowNull: true },
      adhar_card_number_back: { type: Sequelize.STRING, allowNull: true },
      gst_no: { type: Sequelize.STRING, allowNull: true },
      signature: { type: Sequelize.STRING, allowNull: true },
      created_by: { type: Sequelize.STRING(), allowNull: true },
      updated_by: { type: Sequelize.STRING(), allowNull: true },
      created_at: { allowNull: false, type: Sequelize.DATE },
      updated_at: { allowNull: false, type: Sequelize.DATE }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('counsellor_details')
  }
}
