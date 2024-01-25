const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const PROTO_PATH = require('path').join(__dirname, '/match-management.proto')
const config = require('../../../../config')

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
}

const packageDefinition = protoLoader.loadSync(PROTO_PATH, options)

const { MatchManagementService } = grpc.loadPackageDefinition(packageDefinition)

const client = new MatchManagementService(
  config.matchManagementGrpcUrl,
  grpc.credentials.createInsecure()
)

module.exports = client
