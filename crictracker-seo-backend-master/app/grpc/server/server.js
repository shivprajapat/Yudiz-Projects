const grpc = require('@grpc/grpc-js')
const server = new grpc.Server()
const { seoProto, controllers } = require('./seo')
const config = require('../../../config')

server.addService(seoProto.SeoService.service, controllers)
server.bindAsync(
  config.seoGrpcUrl,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) console.log(error)
    else {
      console.log(`gRPC Server running at ${config.seoGrpcUrl}`)
      server.start()
    }
  }
)

module.exports = server
