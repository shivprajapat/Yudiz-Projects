const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const express = require('express')
const http = require('http')
const cors = require('cors')
const { json, urlencoded } = require('body-parser')
const { typeDefs, resolvers, permissions } = require('./app/modules')

const { buildSubgraphSchema } = require('@apollo/subgraph')
const { addResolversToSchema } = require('apollo-graphql')
const { applyMiddleware } = require('graphql-middleware')

const _ = require('./global/lib/helpers')
const { Sentry } = require('./app/utils')
const scorecardRoutes = require('./app/routes_services/index')

const mongoose = require('mongoose')
const cachegoose = require('cachegoose')
const config = require('./config')
const server = {}

const schema = applyMiddleware(buildSubgraphSchema([{ typeDefs, resolvers }]), permissions)
addResolversToSchema(schema, { oFetchSeries: resolvers.oFetchSeries, oMatchDetailsFront: resolvers.oMatchDetailsFront, oAllFixtures: resolvers.oAllFixtures, oFixuresData: resolvers.oFixuresData, MiniScorecard: resolvers.MiniScorecard, oPlayerFront: resolvers.oPlayerFront, oTeamFront: resolvers.oTeamFront, oFantasyArticleFront: resolvers.oFantasyArticleFront, oFantasyMatchOverview: resolvers.oFantasyMatchOverview, oListMatchFantasyTips: resolvers.oListMatchFantasyTips, oShortFantasyTips: resolvers.oShortFantasyTips, oCricPrediction: resolvers.oCricPrediction, oGetFantasyTipsFrontResponse: resolvers.oGetFantasyTipsFrontResponse, oFrontPlayer: resolvers.oFrontPlayer, oShortTeam: resolvers.oShortTeam, oShortPlayer: resolvers.oShortPlayer, oShortVenue: resolvers.oShortVenue, oShortMatch: resolvers.oShortMatch, frontFantasyComment: resolvers.frontFantasyComment, frontFantasyArticle: resolvers.frontFantasyArticle, oShortSeries: resolvers.oShortSeries, oFixtureSeriesType: resolvers.oFixtureSeriesType, oFantasyComment: resolvers.oFantasyComment, oPlayerDetails: resolvers.oPlayerDetails, oFetchSeriesFront: resolvers.oFetchSeriesFront, oPlayer: resolvers.oPlayer, oTeams: resolvers.oTeams, LiveInningTeam: resolvers.LiveInningTeam, LiveInningPlayer: resolvers.LiveInningPlayer })

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
            let decodedToken = null
            if (headers.authorization !== 'undefined') decodedToken = _.decodeToken(headers.authorization)
            return { ip: userip, headers, userLanguage, decodedToken }
          }
        }
      })
    )
  })

  app.use(json())
  app.use(urlencoded({ extended: true }))
  app.use(cors())
  app.use('/api', scorecardRoutes)

  // This is a comment
  const exServer = app.listen({ port: config.PORT }, () =>
    console.log(`🚀 Match management service ready at http://localhost:${config.PORT}/graphql`)
  )

  exServer.keepAliveTimeout = +config.KEEP_ALIVE_TIMEOUT
}

module.exports = server
