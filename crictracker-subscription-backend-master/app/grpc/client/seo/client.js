const grpc = require('@grpc/grpc-js')
const config = require('../../../../config')
const protoLoader = require('@grpc/proto-loader')
const PROTO_PATH = require('path').join(__dirname, '/seo.proto')

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
}

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options)

const { SeoService } = grpc.loadPackageDefinition(packageDefinition)

const client = new SeoService(
  config.seoGrpcUrl,
  grpc.credentials.createInsecure()
)

module.exports = client
