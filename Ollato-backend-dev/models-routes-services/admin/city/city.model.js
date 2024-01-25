const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { status } = require('../../../data')
const countryModel = require('../../common/country/country.model')
const stateModel = require('../../admin/state/state.model')

class City extends Sequelize.Model {}

City.init({
  custom_id: { type: DataTypes.STRING(), allowNull: true },
  county_id: { type: DataTypes.INTEGER, references: { model: 'countries', key: 'id' } },
  state_id: { type: DataTypes.INTEGER, references: { model: 'states', key: 'id' } },
  title: { type: DataTypes.STRING(), allowNull: false },
  abbreviation: { type: DataTypes.STRING(), allowNull: true },
  is_active: { type: DataTypes.ENUM(status), defaultValue: 'y' }, // y = Active, n = Inactive
  created_by: { type: DataTypes.STRING(), allowNull: true },
  updated_by: { type: DataTypes.STRING(), allowNull: true },
  deleted_at: { type: Sequelize.DATE, allowNull: true }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'cities'
})

City.belongsTo(countryModel, { foreignKey: 'county_id', as: 'country' })
City.belongsTo(stateModel, { foreignKey: 'state_id', as: 'states' })

module.exports = City
