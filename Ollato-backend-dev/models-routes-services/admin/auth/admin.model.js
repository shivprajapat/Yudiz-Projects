const { sequelize, Sequelize } = require('../../../database/sequelize')
const { status, adminType } = require('../../../data')
const RoleModel = require('../roles/roles.model')

class admin extends Sequelize.Model {}

admin.init({
  id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
  custom_id: { type: Sequelize.STRING, allowNull: true },
  ollato_code: { type: Sequelize.STRING, unique: true, allowNull: false },
  slug: { type: Sequelize.STRING, unique: true, allowNull: true },
  user_name: { type: Sequelize.STRING, unique: true, allowNull: false },
  first_name: { type: Sequelize.STRING, allowNull: false },
  last_name: { type: Sequelize.STRING, allowNull: false },
  token: { type: Sequelize.STRING, allowNull: true },
  email: { type: Sequelize.STRING, allowNull: false },
  mobile: { type: Sequelize.STRING, allowNull: false },
  password: { type: Sequelize.STRING, allowNull: false },
  admin_type: { type: Sequelize.ENUM(adminType), defaultValue: 'sub' }, // 'super', 'sub'
  role_id: {
    type: Sequelize.INTEGER,
    references: {
      model: 'roles', // 'roles' refers to table name
      key: 'id' // 'id' refers to column name in roles table
    }
  },
  profile_pic: { type: Sequelize.STRING, allowNull: true },
  is_active: { type: Sequelize.ENUM(status), defaultValue: 'y' }, // y = Active, n = Inactive
  created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  updated_at: Sequelize.DATE,
  deleted_at: { type: Sequelize.DATE, allowNull: true },
  created_by: { type: Sequelize.STRING(), allowNull: true },
  updated_by: { type: Sequelize.STRING(), allowNull: true }
}, {
  sequelize,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'admins',
  defaultScope: {
    attributes: { exclude: ['token'] }
  }
})

admin.belongsTo(RoleModel, { foreignKey: 'role_id', as: 'admin_role' })

module.exports = admin
