const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const express = require('express')
const http = require('http')
const cors = require('cors')
const { json } = require('body-parser')
const { typeDefs, resolvers, permissions } = require('./app/modules')
const { createSeoDataLoader } = require('./app/modules/Seo/dataloader')

const { buildSubgraphSchema } = require('@apollo/subgraph')
const { applyMiddleware } = require('graphql-middleware')
const { addResolversToSchema } = require('apollo-graphql')

const _ = require('./global')
const { Sentry } = require('./app/utils')
const seoRoute = require('./app/routes_services')

const mongoose = require('mongoose')
const cachegoose = require('cachegoose')
const config = require('./config')

const server = {}

const schema = applyMiddleware(buildSubgraphSchema([{ typeDefs, resolvers }]), permissions)
addResolversToSchema(schema, { Seo: resolvers.Seo, oCustomSeo: resolvers.oCustomSeo, Seos: resolvers.Seos })

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
    host: config.REDIS_HOST,
    port: config.REDIS_PORT
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
            const { authorization } = headers
            const decodedToken = _.decodeToken(headers.authorization)
            return { ip: userip, headers, userLanguage, decodedToken, authorization, dataLoaders: { seoDataLoader: createSeoDataLoader() } }
          }
        }
      })
    )
  }).catch((err) => {
    console.log('some issue in starting the server', err)
  })

  app.use(json({ limit: '5mb' }))
  app.use(cors())
  app.use('/api', seoRoute)

  const exServer = app.listen({ port: config.PORT }, () =>
    console.log(`🚀 Seo service ready at http://localhost:${config.PORT}/graphql`)
  )

  exServer.keepAliveTimeout = +config.KEEP_ALIVE_TIMEOUT
}

// update

module.exports = server
