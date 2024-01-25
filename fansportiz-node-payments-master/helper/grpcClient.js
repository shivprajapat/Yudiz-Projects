const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const { ADMIN_TARGET_URI, NODEBACKEND_TARGET_URI, USER_INFO_TARGET_URI } = require('../config/config')

const ADMIN_PROTO_PATH = './protos/admin.proto'
const PROMOCODE_PROTO_PATH = './protos/promocode.proto'
const SETTING_PROTO_PATH = './protos/setting.proto'
const USER_PROTO_PATH = './protos/user.proto'
const KYC_PROTO_PATH = './protos/kyc.proto'
const BANKDETAILS_PROTO_PATH = './protos/bankDetails.proto'

const AdminClient = loadProto(ADMIN_PROTO_PATH, 'admin', 'Admin', ADMIN_TARGET_URI)
const PromocodeClient = loadProto(PROMOCODE_PROTO_PATH, 'promocode', 'Promocode', NODEBACKEND_TARGET_URI)
const SettingClient = loadProto(SETTING_PROTO_PATH, 'setting', 'Setting', NODEBACKEND_TARGET_URI)
const UserClient = loadProto(USER_PROTO_PATH, 'user', 'User', NODEBACKEND_TARGET_URI)
const KycClient = loadProto(KYC_PROTO_PATH, 'kyc', 'KYC', USER_INFO_TARGET_URI)
const BankDetailsClient = loadProto(BANKDETAILS_PROTO_PATH, 'bankDetails', 'BankDetails', USER_INFO_TARGET_URI)

function loadProto(path, packages, service, target) {
  const packageDefinition = protoLoader.loadSync(path, { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true })
  const Proto = grpc.loadPackageDefinition(packageDefinition)[packages]
  return new Proto[service](target, grpc.credentials.createInsecure())
}

module.exports = {
  AdminClient,
  PromocodeClient,
  SettingClient,
  UserClient,
  KycClient,
  BankDetailsClient
}
