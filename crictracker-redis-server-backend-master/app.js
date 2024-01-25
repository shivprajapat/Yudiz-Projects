const express = require('express')
const { ApolloServer } = require('apollo-server-express')
const { buildSubgraphSchema } = require('@apollo/federation')
const { applyMiddleware } = require('graphql-middleware')
const { PORT } = require('./config')
const _ = require('./global')
const { Sentry } = require('./app/utils')
const server = {}
const route = require('./app/routes')

const { typeDefs, resolvers } = require('./app/modules')

const schema = applyMiddleware(buildSubgraphSchema([{ typeDefs, resolvers }]))

server.initialize = () => {
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => {
      if (req) {
        const { headers: { userip }, headers } = req
        const userLanguage = headers.language || 'english'
        const decodedToken = _.decodeToken(headers.authorization)
        return { ip: userip, headers, userLanguage, decodedToken }
      }
    },
    formatError: (error) => {
      console.log('error', error)
      if (_.parse(error.message)) {
        return { message: _.parse(error.message).message, path: error.path }
      }
      if (process.env.NODE_ENV !== 'test') Sentry.captureException(error)
      return { message: error.message, path: error.path }
    }
  })

  const app = express()

  app.use(express.json())

  apolloServer.applyMiddleware({ app })

  app.use('/api', route)
  app.listen({ port: PORT }, () => {
    console.log(`Cricktracker redis service ready at http://localhost:${PORT}${apolloServer.graphqlPath} Enjoy`)
  })
}

module.exports = server
