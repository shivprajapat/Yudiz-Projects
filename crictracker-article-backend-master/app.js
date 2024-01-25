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
const { PORT } = require('./config')
const playlistRoutes = require('./app/routes_services/index')

const mongoose = require('mongoose')
const cachegoose = require('cachegoose')
const config = require('./config')
const server = {}

const schema = applyMiddleware(buildSubgraphSchema([{ typeDefs, resolvers }]), permissions)
addResolversToSchema(schema, { tagData: resolvers.tagData, oSimpleCategory: resolvers.oSimpleCategory, oSeriesCategory: resolvers.oSeriesCategory, oTournamentCategory: resolvers.oTournamentCategory, oCategoryFront: resolvers.oCategoryFront, oParentCategoryFront: resolvers.oParentCategoryFront, oTagDataFront: resolvers.oTagDataFront, oFavourite: resolvers.oFavourite, oSeriesMiniScorecard: resolvers.oSeriesMiniScorecard, oEditTagData: resolvers.oEditTagData, bookmark: resolvers.bookmark, oImageData: resolvers.oImageData })

server.initialize = () => {
  const app = express()

  const httpServer = http.createServer(app)

  const apolloServer = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer })
    ],
    formatError: (error) => {
      if (!_.parse(error.message).message && (config.NODE_ENV === 'dev' || config.NODE_ENV === 'local-dev' || config.NODE_ENV === 'dev-prod')) Sentry.captureException(error)
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
            const { headers } = req
            const userLanguage = headers.language || 'english'
            const decodedToken = _.decodeToken(headers.authorization)
            return { ip: headers.userip, headers, userLanguage, decodedToken }
          }
        }
      })
    )
  })

  app.use(cors())

  app.use(json({ limit: '5mb' }))

  app.use('/api', playlistRoutes)
  // https://article-dev.crictracker.ml/
  // APIs & Services - YouTube Data API v3 (Google Cloud Platform)
  // configure Authorized JavaScript origins to -> http://localhost:4002
  // configure Authorized redirect URIs to -> http://localhost:4002/api/oauth2callback
  // need to set secret.json file from Google API Console.

  const exServer = app.listen({ port: PORT }, () => console.log(`Article service ready at http://localhost:${PORT}/graphql Enjoy`))
  exServer.keepAliveTimeout = 65000
}

module.exports = server
