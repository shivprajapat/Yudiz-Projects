const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const { NOTIFICATIONS_TARGET_URI, USER_INFO_TARGET_URI, STATICS_TARGET_URI, ADMIN_TARGET_URI, PAYMENT_TARGET_URI } = require('../config/config')

const KYC_PROTO_PATH = './protos/kyc.proto'
const BANKDETAILS_PROTO_PATH = './protos/bankDetails.proto'
const NOTIFICATIONS_PROTO_PATH = './protos/notifications.proto'
const ADMIN_PROTO_PATH = './protos/admin.proto'
const CMS_PROTO_PATH = './protos/cms.proto'
const WITHDRAW_PROTO_PATH = './protos/withdraw.proto'
const DEPOSIT_PROTO_PATH = './protos/deposit.proto'
const EMAILTEMPLATES_PROTO_PATH = './protos/emailTemplates.proto'

const NotificationsClient = loadProto(NOTIFICATIONS_PROTO_PATH, 'notifications', 'Notifications', NOTIFICATIONS_TARGET_URI)
const KycClient = loadProto(KYC_PROTO_PATH, 'kyc', 'KYC', USER_INFO_TARGET_URI)
const BankDetailsClient = loadProto(BANKDETAILS_PROTO_PATH, 'bankDetails', 'BankDetails', USER_INFO_TARGET_URI)
const AdminClient = loadProto(ADMIN_PROTO_PATH, 'admin', 'Admin', ADMIN_TARGET_URI)
const CMSClient = loadProto(CMS_PROTO_PATH, 'cms', 'CMS', STATICS_TARGET_URI)
const WithdrawClient = loadProto(WITHDRAW_PROTO_PATH, 'withdraw', 'Withdraw', PAYMENT_TARGET_URI)
const DepositClient = loadProto(DEPOSIT_PROTO_PATH, 'deposit', 'Deposit', PAYMENT_TARGET_URI)
const EmailTemplateClient = loadProto(EMAILTEMPLATES_PROTO_PATH, 'emailTemplates', 'EmailTemplates', STATICS_TARGET_URI)

function loadProto(path, packages, service, target) {
  const packageDefinition = protoLoader.loadSync(path, { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true })
  const Proto = grpc.loadPackageDefinition(packageDefinition)[packages]
  return new Proto[service](target, grpc.credentials.createInsecure())
}

module.exports = {
  KycClient,
  BankDetailsClient,
  NotificationsClient,
  AdminClient,
  WithdrawClient,
  DepositClient,
  CMSClient,
  EmailTemplateClient
}
