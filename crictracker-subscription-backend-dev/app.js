const { ApolloGateway } = require('@apollo/gateway')
const { ApolloServer } = require('apollo-server-express')
const { execSync } = require('child_process')

const http = require('http')
const ws = require('ws')
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
const LiveBlogDataSource = require('./app/utils/lib/datasources')

server.initializeSocket = async () => {
  const gateway = new ApolloGateway()

  gateway.onSchemaChange(gatewaySchema => {
    schema = makeSubscriptionSchema({ gatewaySchema, typeDefs, resolvers })
  })

  await gateway.load({
    apollo: getGatewayApolloConfig(config.APOLLO_KEY, process.env.APOLLO_GRAPH_VARIANT)
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
    playground: true,
    context: ({ req }) => {
      if (req) {
        return req.headers
      }
    }
  })

  apolloServer.applyMiddleware({ app })

  function addGatewayDataSourceToSubscriptionContext(context, gatewayDataSource) {
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
          const liveBlogDataSource = new LiveBlogDataSource(config.APOLLO_GATEWAY_URL)
          const dataSourceContext = addGatewayDataSourceToSubscriptionContext(
            ctx,
            liveBlogDataSource
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

  app.get('/api/ping', (req, res) => {
    res.status(200).send({ sMessage: 'pong' })
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
