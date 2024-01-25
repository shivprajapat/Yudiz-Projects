'use strict'
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('students', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      custom_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
      },
      user_name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      middle_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      mobile: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      OTP: {
        type: Sequelize.INTEGER,
        max: 6,
        min: 6,
        allowNull: true
      },
      dob: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      gender: {
        type: Sequelize.ENUM,
        values: ['male', 'female', 'other'],
        allowNull: true
      },
      father_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      mother_name: {
        type: Sequelize.STRING,
        allowNull: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      is_active: {
        type: Sequelize.ENUM,
        defaultValue: 'y',
        values: ['y', 'n']
      },
      is_verify: {
        type: Sequelize.ENUM,
        defaultValue: 'y',
        values: ['y', 'n']
      },
      verified_at: {
        type: Sequelize.DATE
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
    await queryInterface.dropTable('students')
  }
}
