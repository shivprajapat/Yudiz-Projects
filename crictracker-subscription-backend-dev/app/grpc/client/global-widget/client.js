const grpc = require('@grpc/grpc-js')
const config = require('../../../../config')
const protoLoader = require('@grpc/proto-loader')
const PROTO_PATH = require('path').join(__dirname, '/global-widget.proto')

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
}

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options)

const { GlobalWidgetService } = grpc.loadPackageDefinition(packageDefinition)

const client = new GlobalWidgetService(
  config.globalWidgetGrpcUrl,
  grpc.credentials.createInsecure()
)

module.exports = client
