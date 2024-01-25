'use strict'
const { status } = require('../data')

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('career_profile_details', {
      id: { type: Sequelize.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      custom_id: { type: Sequelize.STRING(), allowNull: true },
      career_profile_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'career_profiles', // 'career_profiles' refers to table name
          key: 'id' // 'id' refers to column name in career_profiles table
        }
      },
      profile_type_det: { type: Sequelize.STRING(), allowNull: false },
      is_active: { type: Sequelize.ENUM(status), defaultValue: 'y' }, // y = Active, n = Inactive
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: Sequelize.DATE,
      created_by: { type: Sequelize.STRING(), allowNull: true },
      updated_by: { type: Sequelize.STRING(), allowNull: true },
      deleted_at: { type: Sequelize.DATE, allowNull: true, defaultValue: null }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('career_profile_details')
  }
}
