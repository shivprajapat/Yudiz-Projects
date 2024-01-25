
'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn(
        'student_imports', // table name
        'email', // new field name
        {
          type: Sequelize.STRING,
          allowNull: true
        }
      )
    ])
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.changeColumn(
        'student_imports', // table name
        'email', // new field name
        {
          allowNull: false
        }
      )
    ])
  }
}

// ALTER TABLE `student_imports` MODIFY email varchar(100) NULL;
// Dev-Prod -DONE
