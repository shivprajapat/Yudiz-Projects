const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const express = require('express')
const http = require('http')
const cors = require('cors')
const { json } = require('body-parser')
const { typeDefs, resolvers, permissions } = require('./app/modules')

const { buildSubgraphSchema } = require('@apollo/subgraph')
const { applyMiddleware } = require('graphql-middleware')
const _ = require('./global')
const config = require('./config')
const { addResolversToSchema } = require('apollo-graphql')
const { Sentry } = require('./app/utils')
const routes = require('./app/routes_services')

const server = {}

const schema = applyMiddleware(buildSubgraphSchema([{ typeDefs, resolvers }]), permissions)
addResolversToSchema(schema, { subAdmin: resolvers.subAdmin, user: resolvers.user, Date: resolvers.Date })

server.initialize = () => {
  const app = express()

  const httpServer = http.createServer(app)

  const apolloServer = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer })
    ],
    formatError: (error) => {
      if (!_.parse(error.message).message && config.NODE_ENV === 'prod') Sentry.captureException(error)
      if (_.parse(error.message).message) {
        return { message: error.message, path: error.path, extensions: error.extensions }
      }
      return { message: error.message, path: error.path, extensions: error.extensions }
    }
  })

  apolloServer.start().then(() => {
    app.use(
      '/graphql',
      cors(),
      json({ limit: '50mb' }),
      expressMiddleware((apolloServer), {
        context: ({ req }) => {
          if (req) {
            const { headers: { userip }, headers } = req
            const userLanguage = headers.language || 'english'
            const { authorization, platform } = headers
            const decodedToken = _.decodeToken(headers.authorization)
            return { ip: userip, headers, userLanguage, decodedToken, authorization, platform: platform || 'O' }
          }
        }
      })
    )
  })

  app.use(json({ limit: '5mb' }))

  app.use(cors())

  app.use('/api', routes)

  const exServer = app.listen({ port: config.PORT }, () => console.log(`Authentication service ready at http://localhost:${config.PORT}/graphql Enjoy!!`))
  exServer.keepAliveTimeout = +config.KEEP_ALIVE_TIMEOUT
}

module.exports = server
