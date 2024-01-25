const grpc = require('@grpc/grpc-js')
const server = new grpc.Server()
const { gobalWidgetProto, controllers } = require('./global-widget')
const config = require('../../../config')

server.addService(gobalWidgetProto.GlobalWidgetService.service, controllers)
server.bindAsync(
  config.globalWidgetGrpcUrl,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) console.log(error)
    else {
      console.log(`gRPC Server running at ${config.globalWidgetGrpcUrl}`)
      server.start()
    }
  }
)

module.exports = server
