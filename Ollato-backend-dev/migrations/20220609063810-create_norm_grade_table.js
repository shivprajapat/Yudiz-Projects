'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('norm_grades', {
      id: { type: Sequelize.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      custom_id: { type: Sequelize.STRING(), allowNull: true },
      grade_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'grades', // 'grades' refers to table name
          key: 'id' // 'id' refers to column name in grades table
        }
      },
      test_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'tests', // 'tests' refers to table name
          key: 'id' // 'id' refers to column name in tests table
        }
      },
      test_detail_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'test_details', // 'test_details' refers to table name
          key: 'id' // 'id' refers to column name in test_details table
        }
      },
      norm_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'norms', // 'norms' refers to table name
          key: 'id' // 'id' refers to column name in norms table
        }
      },
      min_marks: { type: Sequelize.INTEGER(11), defaultValue: '0' },
      max_marks: { type: Sequelize.INTEGER(11), defaultValue: '0' },
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
    await queryInterface.dropTable('norm_grades')
  }
}
