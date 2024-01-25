const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const express = require('express')
const http = require('http')
const cors = require('cors')
const { json, urlencoded } = require('body-parser')
const { typeDefs, resolvers, permissions } = require('./app/modules')

const { buildSubgraphSchema } = require('@apollo/subgraph')
const { applyMiddleware } = require('graphql-middleware')

const compression = require('compression')
const morgan = require('morgan')
const Sentry = require('@sentry/node')

const _ = require('./global')
// const { addResolversToSchema } = require('apollo-graphql')
const config = require('./config')
const router = express.Router()

Sentry.init({
  dsn: config.SENTRY_DSN,
  attachStacktrace: true
})

const server = {}

const schema = applyMiddleware(buildSubgraphSchema([{ typeDefs, resolvers }]), permissions)
// addResolversToSchema(schema)

server.initialize = () => {
  const app = express()

  const httpServer = http.createServer(app)

  const apolloServer = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer })
    ],
    formatError: (error) => {
      if (process.env.NODE_ENV !== 'dev') Sentry.captureException(error)
      if (_.parse(error.message).message) {
        return { message: error.message, path: error.path, extensions: error.extensions }
      }
      return { message: error.message, path: error.path, extensions: error.extensions }
    }
  })

  morgan.token('req-headers', function (req, res) {
    return JSON.stringify(req.headers['device-token'])
  })

  apolloServer.start().then(() => {
    app.use(
      '/graphql',
      cors({ exposedHeaders: 'Authorization' }),
      // helmet(),
      compression(),
      json({ limit: '50mb' }),
      expressMiddleware((apolloServer), {
        context: ({ req }) => {
          if (req) {
            const { headers: { userip }, headers } = req
            const userLanguage = headers.language || 'english'
            const decodedToken = _.decodeToken(headers.authorization)
            return { ip: userip, headers, userLanguage, decodedToken }
          }
        }
      })
    )
  })

  app.use(cors({ exposedHeaders: 'Authorization' }))

  app.use(compression())
  app.use(json())
  app.use(urlencoded({ extended: true }))

  app.use(cors())
  app.use('/api', router)
  require('./models-routes-services/tags/routes')(router)
  require('./models-routes-services/article/routes')(router)
  require('./models-routes-services/migration/routes')(router)
  require('./models-routes-services/author/routes')(router)
  require('./models-routes-services/category/routes')(router)

  const PORT = config.PORT || 5000
  const exServer = app.listen({ port: PORT }, () =>
    console.log(`🚀 Migrations service ready at http://localhost:${process.env.PORT}/graphql !!!!!!!!!!!!!!!!!!!`)
  )

  exServer.keepAliveTimeout = +config.KEEP_ALIVE_TIMEOUT
}

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p)
    Sentry.captureException({ reason, p })
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown')
    Sentry.captureException({ err })
    process.exit(1)
  })

module.exports = server
