const { DataTypes } = require('sequelize')
const { sequelize, Sequelize } = require('../../../database/sequelize')
const { status } = require('../../../data')
const StateModel = require('../../admin/state/state.model')
const CityModel = require('../../admin/city/city.model')
const CountryModel = require('../../common/country/country.model')

class Center extends Sequelize.Model {}

Center.init({
  custom_id: { type: DataTypes.STRING, unique: true, allowNull: false },
  ollato_code: { type: DataTypes.STRING, allowNull: true },
  slug: { type: DataTypes.STRING, unique: true, allowNull: true },
  user_name: { type: DataTypes.STRING, unique: true, allowNull: false },
  state_id: { type: DataTypes.INTEGER, references: { model: 'states', key: 'id' }, allowNull: true },
  city_id: { type: DataTypes.INTEGER, references: { model: 'city', key: 'id' }, allowNull: true },
  country_id: { type: DataTypes.INTEGER, references: { model: 'country', key: 'id' }, allowNull: true },
  title: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  mobile: { type: DataTypes.STRING, allowNull: false },
  token: { type: DataTypes.STRING, unique: true, allowNull: true },
  OTP: { type: DataTypes.STRING, unique: true, allowNull: true },
  profile: { type: DataTypes.STRING, unique: true, allowNull: true },
  password: { type: DataTypes.STRING, allowNull: false },
  total_amount: { type: DataTypes.FLOAT, allowNull: true, defaultValue: '0.00' },
  redeem_amount: { type: DataTypes.FLOAT, allowNull: true, defaultValue: '0.00' },
  remaining_amount: { type: DataTypes.FLOAT, allowNull: true, defaultValue: '0.00' },
  commission: { type: DataTypes.FLOAT, allowNull: true, defaultValue: '0.00' },
  is_active: { type: DataTypes.ENUM(status), defaultValue: 'y' }, // y = Active, n = Inactive
  created_by: { type: DataTypes.STRING(), allowNull: true },
  updated_by: { type: DataTypes.STRING(), allowNull: true },
  deleted_at: { type: DataTypes.DATE(), allowNull: true }
}, {
  sequelize,
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'centers'
})

Center.belongsTo(StateModel, { foreignKey: 'state_id', as: 'states' })
Center.belongsTo(CityModel, { foreignKey: 'city_id', as: 'city' })
Center.belongsTo(CountryModel, { foreignKey: 'country_id', as: 'country' })

module.exports = Center
