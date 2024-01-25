'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('counsellor_details', 'professional_expert_id',
          {
            type: Sequelize.INTEGER,
            references: { model: 'qualifications', key: 'id' },
            allowNull: true,
            defaultValue: null,
            after: 'certificate_university_id'
          }, { transaction: t })
      ])
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('counsellor_details', 'professional_expert_id')
      ])
    })
  }
}
