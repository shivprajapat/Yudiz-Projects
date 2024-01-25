'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.addColumn(
        'test_details', // table name
        'no_options', // new field name
        {
          type: Sequelize.INTEGER(11),
          after: 'no_of_questions',
          allowNull: true,
          defaultValue: '0'
        }
      )
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.removeColumn('test_details', 'no_options')
    ])
  }
}
