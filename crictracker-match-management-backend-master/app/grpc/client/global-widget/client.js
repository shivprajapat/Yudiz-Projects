const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const PROTO_PATH = require('path').join(__dirname, '/global-widget.proto')
const config = require('../../../../config')

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
  config.globalWidgetGrpc,
  grpc.credentials.createInsecure()
)

module.exports = client
