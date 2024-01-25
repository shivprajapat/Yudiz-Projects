const grpc = require('@grpc/grpc-js')
const config = require('../../../config')
const { articleProto, controllers } = require('./match-management')
const server = new grpc.Server()

server.addService(articleProto.MatchManagementService.service, controllers)

server.bindAsync(
  config.matchManagementGrpcUrl,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) console.log(error)
    else {
      console.log(`gRPC Server running at ${config.matchManagementGrpcUrl}`)
      server.start()
    }
  }
)

module.exports = server
