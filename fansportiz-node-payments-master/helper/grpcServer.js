const PAYMENT_PROTO_PATH = './protos/payment.proto'
const WITHDRAW_PROTO_PATH = './protos/withdraw.proto'
const DEPOSIT_PROTO_PATH = './protos/deposit.proto'

const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const { GRPC_SERVER_URI } = require('../config/config')
const server = new grpc.Server()

loadProto(PAYMENT_PROTO_PATH, 'payment', 'Payment', require('../models-routes-services/payment/grpc/serverServices'))
loadProto(WITHDRAW_PROTO_PATH, 'withdraw', 'Withdraw', require('../models-routes-services/userWithdraw/grpc/serverServices'))
loadProto(DEPOSIT_PROTO_PATH, 'deposit', 'Deposit', require('../models-routes-services/userDeposit/grpc/serverServices'))

function loadProto(path, packages, service, oServices) {
  const packageDefinition = protoLoader.loadSync(path, { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true })
  const Proto = grpc.loadPackageDefinition(packageDefinition)[packages]
  server.addService(Proto[service].service, oServices)
}

server.bindAsync(GRPC_SERVER_URI, grpc.ServerCredentials.createInsecure(), () => {
  server.start()
})
