const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { status } = require('../../../data')
const countryModel = require('../../common/country/country.model')
const stateModel = require('../state/state.model')
const cityModel = require('../city/city.model')
const centerModel = require('../../center/Auth/center.model')
const boardModel = require('../board/board.model')

class School extends Sequelize.Model {}

School.init({
  custom_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  center_id: { type: DataTypes.INTEGER, references: { model: 'centers', key: 'id' }, allowNull: true },
  title: { type: DataTypes.STRING, allowNull: false, unique: true },
  abbreviation: { type: DataTypes.STRING, allowNull: true },
  address_1: { type: DataTypes.STRING, allowNull: false },
  address_2: { type: DataTypes.STRING, allowNull: false },
  area: { type: DataTypes.STRING, allowNull: true },
  county_id: { type: DataTypes.INTEGER, references: { model: 'countries', key: 'id' }, allowNull: true },
  state_id: { type: DataTypes.INTEGER, references: { model: 'states', key: 'id' }, allowNull: true },
  city_id: { type: DataTypes.INTEGER, references: { model: 'city', key: 'id' }, allowNull: true },
  board_id: { type: DataTypes.INTEGER, references: { model: 'boards', key: 'id' }, allowNull: true },
  pin_code: { type: DataTypes.STRING, allowNull: true },
  contact_name: { type: DataTypes.STRING, allowNull: true },
  contact_email: { type: DataTypes.STRING, allowNull: true },
  contact_mobile: { type: DataTypes.STRING, allowNull: true },
  is_active: { type: DataTypes.ENUM(status), defaultValue: 'y' },
  created_by: { type: DataTypes.STRING, allowNull: true },
  updated_by: { type: DataTypes.STRING, allowNull: true },
  deleted_at: { type: DataTypes.DATE, allowNull: true }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'schools'
})

School.belongsTo(centerModel, { foreignKey: 'center_id', as: 'centers' })
School.belongsTo(countryModel, { foreignKey: 'county_id', as: 'countries' })
School.belongsTo(stateModel, { foreignKey: 'state_id', as: 'states' })
School.belongsTo(cityModel, { foreignKey: 'city_id', as: 'city' })
School.belongsTo(boardModel, { foreignKey: 'board_id', as: 'boards' })

module.exports = School
