const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require('@apollo/server/express4')
const { ApolloGateway } = require('@apollo/gateway')
const { execSync } = require('child_process')

const http = require('http')
const ws = require('ws')
const cors = require('cors')
const { json } = require('body-parser')
const config = require('./config')

const {
  execute,
  getOperationAST,
  GraphQLError,
  parse,
  subscribe,
  validate
} = require('graphql')

const { makeSubscriptionSchema, getGatewayApolloConfig } = require('./federation-subscription-tools/schema')

const { useServer } = require('graphql-ws/lib/use/ws')

let schema
const server = {}
const { resolvers, typeDefs } = require('./app/modules')

server.initializeSocket = async () => {
  console.log(config.APOLLO_KEY, config.APOLLO_GRAPH_VARIANT)
  const gateway = new ApolloGateway()
  gateway.onSchemaChange(gatewaySchema => {
    schema = makeSubscriptionSchema({ gatewaySchema, typeDefs, resolvers })
  })

  await gateway.load({
    apollo: getGatewayApolloConfig(config.APOLLO_KEY, config.APOLLO_GRAPH_VARIANT)
  })

  const app = require('express')()

  const httpServer = http.createServer(app)

  const wsServer = new ws.Server({
    server: httpServer,
    path: '/graphql'
  })

  const subscriptions = {
    pathL: '/graphql',
    onConnect: (connectionParams, webSocket, context) => {
      console.log('Client connected')
    },
    onDisconnect: (webSocket, context) => {
      console.log('Client disconnected')
    }
  }

  const apolloServer = new ApolloServer({
    schema,
    Subscription: subscriptions,
    playground: true
  })

  apolloServer.start().then(() => {
    app.use(
      '/graphql',
      cors(),
      json({ limit: '50mb' }),
      expressMiddleware((apolloServer), {
        context: ({ req }) => {
          if (req) {
            return req.headers
          }
        }
      })
    )
  })

  function addGatewayDataSourceToSubscriptionContext (context, gatewayDataSource) {
    gatewayDataSource.initialize({ context, cache: undefined })
    return { dataSources: { gatewayApi: gatewayDataSource } }
  }

  try {
    useServer(
      {
        execute,
        subscribe,
        context: ctx => {
          // If a token was sent for auth purposes, retrieve it here

          // Instantiate and initialize the GatewayDataSource subclass
          // (data source methods will be accessible on the `gatewayApi` key)
          const dataSourceContext = addGatewayDataSourceToSubscriptionContext(
            ctx
          )

          // Return the complete context for the request
          return dataSourceContext
        },
        onSubscribe: (_ctx, msg) => {
          // Construct the execution arguments
          const args = {
            schema, // <-- Use the previously defined `schema` here
            operationName: msg.payload.operationName,
            document: parse(msg.payload.query),
            variableValues: msg.payload.variables
          }

          const operationAST = getOperationAST(
            args.document,
            args.operationName
          )

          // Stops the subscription and sends an error message
          if (!operationAST) {
            return [new GraphQLError('Unable to identify operation')]
          }

          // Handle mutation and query requests
          if (operationAST.operation !== 'subscription') {
            return [
              new GraphQLError('Only subscription operations are supported')
            ]
          }

          // Validate the operation document
          const errors = validate(args.schema, args.document)
          if (errors.length > 0) {
            return errors
          }

          // Ready execution arguments
          return args
        }
      },
      wsServer
    )
  } catch (error) {
    execSync('pm2 reload all')
    console.log('Pm2 reloaded')
  }

  app.use(json({ limit: '5mb' }))

  app.get('/api/ping', (req, res) => {
    return res.send({ sMessage: 'Pong' })
  })

  httpServer.listen(config.PORT, (err) => {
    if (err) {
      execSync('pm2 reload all')
    }
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${config.PORT}`
    )
  })
}

module.exports = server
