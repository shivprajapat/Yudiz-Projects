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
    await queryInterface.createTable('software_matrix', {
      id: { type: Sequelize.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      custom_id: { type: Sequelize.STRING(), allowNull: true },
      test_abb_1: { type: Sequelize.STRING(), allowNull: false },
      test_abb_2: { type: Sequelize.STRING(), allowNull: false },
      test_abb_3: { type: Sequelize.STRING(), allowNull: false },
      career_profile_detail_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'career_profile_details', // 'career_profile_details' refers to table name
          key: 'id' // 'id' refers to column name in career_profile_details table
        }
      },
      sort_order: { type: Sequelize.INTEGER(11), defaultValue: '0' },
      math_dropped: { type: Sequelize.BOOLEAN, defaultValue: true },
      science_dropped: { type: Sequelize.BOOLEAN, defaultValue: true },
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
    await queryInterface.dropTable('software_matrix')
  }
}
