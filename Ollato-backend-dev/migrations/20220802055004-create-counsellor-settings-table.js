'use strict'
const { status } = require('../data')

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('counsellor_support', {
      id: { type: Sequelize.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      custom_id: { type: Sequelize.STRING(), allowNull: true },
      counsellor_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'counsellors', // 'counsellors' refers to table name
          key: 'id' // 'id' refers to column name in counsellors table
        }
      },
      issue_category_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'counsellor_issue_category', // 'counsellor_issue_category' refers to table name
          key: 'id' // 'id' refers to column name in counsellor_issue_category table
        }
      },
      query_desc: { type: Sequelize.STRING(), allowNull: false },
      is_active: { type: Sequelize.ENUM(status), defaultValue: 'y' }, // y = Active, n = Inactive
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: Sequelize.DATE,
      created_by: { type: Sequelize.STRING(), allowNull: true },
      updated_by: { type: Sequelize.STRING(), allowNull: true },
      deleted_at: { type: Sequelize.DATE, allowNull: true, defaultValue: null }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('counsellor_support')
  }
}
