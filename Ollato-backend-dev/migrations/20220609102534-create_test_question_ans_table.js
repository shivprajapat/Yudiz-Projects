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
    await queryInterface.createTable('question_ans', {
      id: { type: Sequelize.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      custom_id: { type: Sequelize.STRING(), allowNull: true },
      question_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'questions', // 'questions' refers to table name
          key: 'id' // 'id' refers to column name in questions table
        }
      },
      ans_desc: { type: Sequelize.STRING(), allowNull: false },
      is_correct_ans: { type: Sequelize.BOOLEAN, defaultValue: false },
      is_image: { type: Sequelize.BOOLEAN, defaultValue: false },
      filename: { type: Sequelize.STRING(), allowNull: true },
      path: { type: Sequelize.STRING(), allowNull: true },
      contenttype: { type: Sequelize.STRING(), allowNull: true },
      is_math: { type: Sequelize.BOOLEAN, defaultValue: false },
      math_expression: { type: Sequelize.STRING(), allowNull: true },
      sort_order: { type: Sequelize.INTEGER(11), defaultValue: '0' },
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
    await queryInterface.dropTable('question_ans')
  }
}
