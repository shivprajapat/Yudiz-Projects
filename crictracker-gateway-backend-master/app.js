const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const express = require('express')
const { ApolloGateway, RemoteGraphQLDataSource } = require('@apollo/gateway')
const { execSync } = require('child_process')
const http = require('http')
const cors = require('cors')
const { json } = require('body-parser')
const compression = require('compression')

require('dotenv').config()

const setHttpPlugin = {
  async requestDidStart() {
    return {
      async willSendResponse({ response }) {
        try {
          if (response?.errors?.[0]?.message?.includes('{')) {
            response.http.status = JSON.parse(response?.errors?.[0]?.message)?.status
            response.errors[0].message = JSON.parse(response?.errors?.[0]?.message)?.message
          } else response.http.status = 200
        } catch (error) {
          response.http.status = 500
        }
      }
    }
  }
}

const schema = {
  buildService({ name, url }) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
        request.http.headers.set('authorization', context.authorization)
        request.http.headers.set('userip', context.userip)
        request.http.headers.set('language', context.language)
        request.http.headers.set('platform', context.platform)
      }
    })
  }
}

const gateway = new ApolloGateway(schema)

const app = express()

const httpServer = http.createServer(app)

const server = new ApolloServer({
  gateway,
  plugins: [setHttpPlugin, ApolloServerPluginDrainHttpServer({ httpServer })],
  formatError: (error) => {
    return { message: error.message, path: error.path, extensions: error.extensions }
  },
  introspection: process.env.INTROSPECTION !== 'false' || process.env.NODE_ENV !== 'prod'
})

app.use(compression())

app.get('/api/ping', (req, res) => {
  return res.status(200).jsonp({ sStatus: 200, sMessage: 'ping' })
})

server.start().then(() => {
  app.use(
    '/graphql',
    cors(),
    json({ limit: '50mb' }),
    compression(),
    expressMiddleware((server), {
      context: ({ req }) => {
        if (req) {
          // if (req?.body?.operationName !== 'IntrospectionQuery') console.log({ req: req?.body?.operationName })
          return { authorization: req.headers.authorization, userip: req.headers['x-forwarded-for'] || req.connection.remoteAddress, language: req.headers.language ? req.headers.language : 'english', platform: req.headers.platform }
        }
      },
      onHealthCheck: async () => {
        const out = await server.executeOperation({
          query: 'query IntrospectionQuery { __schema { queryType { name } } }',
          operationName: 'IntrospectionQuery'
        })

        if (out.errors) {
          console.log('unhealthy service')
        }

        return null
      }
    })
  )
})

app.get('/api/ping', (req, res) => {
  return res.status(200).send({ sMessage: 'pong' })
})

const exServer = app.listen({ port: 4000 }, (err) => {
  if (err) {
    execSync('pm2 reload all')
    console.error(err)
  } else console.log('🚀 Gateway ready at http://localhost:4000/graphql')
})

exServer.keepAliveTimeout = process.env.KEEP_ALIVE_TIMEOUT || 65000

module.exports = server
