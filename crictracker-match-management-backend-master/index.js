// require('./tracer')
require('./global')
require('./app/utils/lib/redis')
require('./app/grpc/client')
require('./app/grpc/server')
const server = require('./app')
const { db } = require('./app/utils')
db.initialize()
server.initialize()

process.on('unhandledRejection', (reason, p) => {
  console.error(reason, 'Unhandled Rejection at Promise', p)
}).on('uncaughtException', err => {
  console.error(err, 'Uncaught Exception thrown')
  process.exit(1)
})
