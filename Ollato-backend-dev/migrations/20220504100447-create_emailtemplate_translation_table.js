'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('emailtemplate_translations', {
      id: { type: Sequelize.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      emailtemplate_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'emailtemplates', // 'emailtemplates' refers to table name
          key: 'id' // 'id' refers to column name in emailtemplates table
        }
      },
      language_code: {
        type: Sequelize.STRING,
        references: {
          model: 'languages', // 'languages' refers to table name
          key: 'code' // 'id' refers to column name in languages table
        }
      },
      title: { type: Sequelize.STRING(), allowNull: false },
      description: { type: Sequelize.STRING(), allowNull: true },
      subject: { type: Sequelize.STRING(), allowNull: true },
      content: { type: Sequelize.STRING(), allowNull: true },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: Sequelize.DATE
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('emailtemplate_translations')
  }
}
