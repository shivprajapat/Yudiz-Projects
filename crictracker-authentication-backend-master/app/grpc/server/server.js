const grpc = require('@grpc/grpc-js')
const server = new grpc.Server()
const { authProto, controllers } = require('./auth')
const config = require('../../../config')

server.addService(authProto.AuthService.service, controllers)

server.bindAsync(
  config.authGrpcUrl,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) console.log(error)
    else {
      console.log(`gRPC Server running at ${config.authGrpcUrl}`)
      server.start()
    }
  }
)

module.exports = server
