const MATCH_PROTO_PATH = './protos/match.proto'
const USER_PROTO_PATH = './protos/user.proto'
const SETTINGS_PROTO_PATH = './protos/setting.proto'
const PROMOCODE_PROTO_PATH = './protos/promocode.proto'

const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const { GRPC_SERVER_URI } = require('../config/config')
const server = new grpc.Server()

loadProto(MATCH_PROTO_PATH, 'match', 'Match', require('../models-routes-services/match/grpc/serverServices'))
loadProto(USER_PROTO_PATH, 'user', 'User', require('../models-routes-services/user/grpc/serverServices'))
loadProto(SETTINGS_PROTO_PATH, 'setting', 'Setting', require('../models-routes-services/setting/grpc/serverServices'))
loadProto(PROMOCODE_PROTO_PATH, 'promocode', 'Promocode', require('../models-routes-services/promocode/grpc/serverServices'))

function loadProto(path, packages, service, oServices) {
  const packageDefinition = protoLoader.loadSync(path, { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true })
  const Proto = grpc.loadPackageDefinition(packageDefinition)[packages]
  server.addService(Proto[service].service, oServices)
}

server.bindAsync(GRPC_SERVER_URI, grpc.ServerCredentials.createInsecure(), () => {
  server.start()
})
