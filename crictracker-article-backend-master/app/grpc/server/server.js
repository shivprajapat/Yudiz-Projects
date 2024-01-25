const grpc = require('@grpc/grpc-js')
const server = new grpc.Server()
const { articleProto, controllers } = require('./article')
const config = require('../../../config')

server.addService(articleProto.ArticleService.service, controllers)

server.bindAsync(
  config.articleGrpc,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) console.log(error)
    else {
      console.log(`gRPC Server running at ${config.articleGrpc}`)
      server.start()
    }
  }
)

module.exports = server
