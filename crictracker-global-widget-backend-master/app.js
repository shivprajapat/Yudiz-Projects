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
const { addResolversToSchema } = require('apollo-graphql')

const _ = require('./global')
const { Sentry } = require('./app/utils')
const widgetRoutes = require('./app/routes_services/index')

const mongoose = require('mongoose')
const cachegoose = require('cachegoose')
const config = require('./config')
const server = {}

const schema = applyMiddleware(buildSubgraphSchema([{ typeDefs, resolvers }]), permissions)
addResolversToSchema(schema, { Cricspecial: resolvers.Cricspecial, TrendingNews: resolvers.TrendingNews, oCurrentSeriesData: resolvers.oCurrentSeriesData, aResultType: resolvers.aResultType, poll: resolvers.poll })

server.initialize = () => {
  const app = express()

  const httpServer = http.createServer(app)

  const apolloServer = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer })
    ],
    formatError: (error) => {
      if (!_.parse(error.message).message && process.env.NODE_ENV === 'prod') Sentry.captureException(error)
      if (_.parse(error.message).message) {
        return { message: error.message, path: error.path, extensions: error.extensions }
      }
      return { message: error.message, path: error.path, extensions: error.extensions }
    }
  })

  cachegoose(mongoose, {
    engine: 'redis',
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
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
            const userLanguage = !headers.language ? 'english' : headers.language
            return { ip: userip, headers, userLanguage }
          }
        }
      })
    )
  })

  app.use(json({ limit: '5mb' }))
  app.use(cors())
  app.use('/api', widgetRoutes)

  const exServer = app.listen({ port: config.PORT }, () => console.log(`GlobalWidget service ready at http://localhost:${config.PORT}/graphql Enjoy!!`))
  exServer.keepAliveTimeout = +config.KEEP_ALIVE_TIMEOUT
}

module.exports = server
