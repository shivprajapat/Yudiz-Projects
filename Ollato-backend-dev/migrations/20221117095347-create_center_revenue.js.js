'use strict'
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('center_revenue', {
      id: { type: Sequelize.INTEGER(11), allowNull: false, autoIncrement: true, primaryKey: true },
      custom_id: { type: Sequelize.STRING, allowNull: true },
      center_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'centers', // 'centers' refers to table name
          key: 'id' // 'id' refers to column name in countries table
        }
      },
      student_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'students', // 'students' refers to table name
          key: 'id' // 'id' refers to column name in countries table
        }
      },
      package_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'packages', // 'packages' refers to table name
          key: 'id' // 'id' refers to column name in countries table
        }
      },
      amount: {
        type: Sequelize.FLOAT,
        defaultValue: false
      },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      updated_at: Sequelize.DATE
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('center_revenue')
  }
}
