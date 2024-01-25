'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      return Promise.all([
        await queryInterface.addColumn(
          'student_details', // table name
          'school_name', // new field name
          {
            type: Sequelize.STRING,
            allowNull: true,
            after: 'board_id'
          },
          { transaction: t }
        ),
        await queryInterface.removeColumn('student_details', 'school_id', { transaction: t }),
        await queryInterface.addColumn('student_details', 'school_id',
          {
            type: Sequelize.INTEGER,
            references: { model: 'schools', key: 'id' },
            allowNull: true,
            defaultValue: null,
            after: 'board_id'
          }, { transaction: t })
      ])
    })
  },

  async down (queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('student_details', 'school_name')
    ])
  }
}
