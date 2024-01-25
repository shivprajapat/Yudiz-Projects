'use strict'

const Sequelize = require('sequelize')
const config = require('../config/config-file')

const db = {}

let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    host: config.DB_SQL_HOST,
    port: config.DB_SQL_PORT,
    dialect: 'mysql',
    // Use a different storage. Default: none
    seederStorage: 'json',
    // Use a different file name. Default: sequelize-data.json
    seederStoragePath: 'sequelizeData.json',
    // Use a different table name. Default: SequelizeData
    seederStorageTableName: 'sequelize_data'
  })
} else {
  sequelize = new Sequelize(config.DB_SQL_NAME, config.DB_SQL_USER, config.DB_SQL_PASSWORD, {
    host: config.DB_SQL_HOST,
    port: config.DB_SQL_PORT,
    dialect: config.DB_SQL_DIALECT,
    logging: false,
    dialectOptions: { multipleStatements: true },
    pool: {
      max: 25,
      min: 0,
      acquire: 1000,
      idle: 10000,
      handleDisconnects: true,
      // Use a different storage. Default: none
      seederStorage: 'json',
      // Use a different file name. Default: sequelize-data.json
      seederStoragePath: 'sequelizeData.json',
      // Use a different table name. Default: SequelizeData
      seederStorageTableName: 'sequelize_data'
    }
  })
  sequelize.authenticate()
    .then(() => {
      console.log('Successfully connected to the SQL database:', config.DB_SQL_NAME)
    }).catch((err) => {
      console.error('Unable to connect to the database:', err)
    })
}

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
