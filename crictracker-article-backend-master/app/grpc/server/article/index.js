const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const PROTO_PATH = require('path').join(__dirname, '/article.proto')
const controllers = require('./controllers')

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
}

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options)
const articleProto = grpc.loadPackageDefinition(packageDefinition)

module.exports = { articleProto, controllers }
