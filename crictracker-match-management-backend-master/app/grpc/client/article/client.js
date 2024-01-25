const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const PROTO_PATH = require('path').join(__dirname, '/article.proto')
const config = require('../../../../config')

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
}

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options)

const { ArticleService } = grpc.loadPackageDefinition(packageDefinition)

const client = new ArticleService(
  config.articleGrpc,
  grpc.credentials.createInsecure()
)

module.exports = client
