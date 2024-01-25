'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sessions_cancels', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      sessions_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'sessions',
          as: 'id'
        },
        allowNull: false
      },
      reason: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_by: {
        type: Sequelize.STRING,
        allowNull: true
      },
      updated_by: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sessions_cancels')
  }
}
