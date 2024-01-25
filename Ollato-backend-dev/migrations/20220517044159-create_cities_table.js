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
    await queryInterface.createTable('cities', {
      id: { type: Sequelize.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      custom_id: { type: Sequelize.STRING(), allowNull: true },
      county_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'countries', // 'countries' refers to table name
          key: 'id' // 'id' refers to column name in countries table
        }
      },
      state_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'states', // 'states' refers to table name
          key: 'id' // 'id' refers to column name in states table
        }
      },
      title: { type: Sequelize.STRING(), allowNull: false },
      abbreviation: { type: Sequelize.STRING(), allowNull: true },
      is_active: { type: Sequelize.ENUM(status), defaultValue: 'y' }, // y = Active, n = Inactive
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: Sequelize.DATE,
      created_by: { type: Sequelize.STRING(), allowNull: true },
      updated_by: { type: Sequelize.STRING(), allowNull: true }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('cities')
  }
}
