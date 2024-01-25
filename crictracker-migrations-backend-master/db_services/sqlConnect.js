// const Sequelize = require('sequelize')
// const config = require('../config')

// console.log(config.SQL_DATABASE, config.SQL_USER, config.SQL_PASSWORD, config.SQL_HOST, config.SQL_PORT)

// const sequelize = new Sequelize(config.SQL_DATABASE, config.SQL_USER, config.SQL_PASSWORD, {
//   host: config.SQL_HOST,
//   port: config.SQL_PORT,
//   dialect: 'mysql',
//   operatorsAliases: false,
//   logging: false,
//   dialectOptions: { multipleStatements: true },
//   pool: {
//     max: 70,
//     min: 0,
//     handleDisconnects: true
//   }
// })

// sequelize
//   .authenticate()
//   .then((res) => {
//     console.log('Connection has been established successfully.')
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err)
//   })

// module.exports = sequelize
