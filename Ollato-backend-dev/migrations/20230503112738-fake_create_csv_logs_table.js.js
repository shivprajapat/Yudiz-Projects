'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
}

// CREATE TABLE csv_logs(
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   mobile VARCHAR(255) DEFAULT NULL,
//   email VARCHAR(255) DEFAULT NULL,
//   description TEXT DEFAULT NULL,
//   action_by INT,
//   created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   updated_at TIMESTAMP NULL DEFAULT NULL,
//   deleted_at TIMESTAMP NULL DEFAULT NULL
// );

// DONE-dev-prod

// ALTER TABLE csv_logs ADD COLUMN student_name VARCHAR(255) DEFAULT NULL
// DONE-dev-prod

// ALTER TABLE csv_logs CHANGE COLUMN student_name student_name VARCHAR(255);
// DONE-dev-prod
