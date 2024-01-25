'use strict'

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('counsellor_details', 'professional_expertness', { transaction: t }),
        queryInterface.addColumn('counsellor_details', 'professional_expertness_id',
          {
            type: Sequelize.INTEGER,
            references: { model: 'professional_expertnesses', key: 'id' },
            allowNull: true,
            defaultValue: null
          }, { transaction: t })
      ])
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('counsellor_details', 'professional_expertness_id', { transaction: t })
      ])
    })
  }
}
