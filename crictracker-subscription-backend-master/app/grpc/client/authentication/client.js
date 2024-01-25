const grpc = require('@grpc/grpc-js')
const config = require('../../../../config')
const protoLoader = require('@grpc/proto-loader')
const PROTO_PATH = require('path').join(__dirname, '/authentication.proto')

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
}

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options)

const { AuthService } = grpc.loadPackageDefinition(packageDefinition)

const client = new AuthService(
  config.authGrpcUrl,
  grpc.credentials.createInsecure()
)

module.exports = client
