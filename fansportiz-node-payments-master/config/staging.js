const staging = {
  DEPLOY_HOST_URL: process.env.DEPLOY_HOST_URL || 'https://nodebackstag.fantasywl.in',
  PORT: process.env.PORT || 1338,

  STATISTICS_DB_URL: process.env.STATISTICS_DB_URL || 'mongodb://localhost:27017/fantasy_statistics',

  DB_SQL_NAME: process.env.DB_SQL_NAME || 'fantasy_development',
  DB_SQL_USER: process.env.DB_SQL_USER || 'root',
  DB_SQL_PASSWORD: process.env.DB_SQL_PASSWORD || 'root',
  DB_SQL_PORT: process.env.DB_SQL_PORT || 3306,
  DB_SQL_HOST: process.env.DB_SQL_HOST || '127.0.0.1',
  DB_SQL_HOST_REPLICA: process.env.DB_SQL_HOST_REPLICA || process.env.DB_SQL_HOST || '127.0.0.1',
  DB_SQL_DIALECT: process.env.DB_SQL_DIALECT || 'mysql',

  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,

  JWT_SECRET: process.env.JWT_SECRET || 'aAbBcC@test_123',

  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY || 'your aws access key',
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY || 'your aws secretAccessKey',
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'yudiz-fantasy-media',
  S3_BUCKET_URL: process.env.S3_BUCKET_URL || 'https://yudiz-fantasy-media.s3.ap-south-1.amazonaws.com/',
  s3PaymentOption: process.env.S3_PAYMENT_OPTIONS_PATH || 'payment-option/',
  s3PayoutOption: process.env.S3_PAYOUT_OPTIONS_PATH || 'payout-option/',

  CASHFREE_URL: process.env.CASHFREE_URL,
  CASHFREE_APPID: process.env.CASHFREE_APPID,
  CASHFREE_SECRETKEY: process.env.CASHFREE_SECRETKEY,
  CASHFREE_RETURN_URL: process.env.CASHFREE_RETURN_URL || 'https://www.google.com/',
  CASHFREE_STABLE_URL: process.env.CASHFREE_STABLE_URL || 'https://sandbox.cashfree.com/pg',

  CASHFREE_BASEURL: process.env.CASHFREE_BASEURL,
  CASHFREE_CLIENTID: process.env.CASHFREE_CLIENTID,
  CASHFREE_CLIENTSECRET: process.env.CASHFREE_CLIENTSECRET,
  CASHFREE_AUTHORIZE_PATH: 'payout/v1/authorize',
  CASHFREE_VERIFY_PATH: 'payout/v1/verifyToken',
  CASHFREE_ADDBENEFICIARY_PATH: 'payout/v1/addBeneficiary',
  CASHFREE_GETBALANCE_PATH: 'payout/v1/getBalance',
  CASHFREE_GETBENEFICIARY_PATH: 'payout/v1/getBeneficiary',
  CASHFREE_TRANSFER_PATH: 'payout/v1.2/requestTransfer', // changed
  CASHFREE_TRANSFER_STATUS_PATH: 'payout/v1.2/getTransferStatus', // changed
  CASHFREE_REMOVEBENEFICIARY_PATH: 'payout/v1/removeBeneficiary',
  CASHFREE_GETBENEFICIARYID_PATH: 'payout/v1/getBeneId',

  AMAZONPAY_MERCHANT_ID: process.env.AMAZONPAY_MERCHANT_ID || 'your amazon pay merchant key',
  AMAZONPAY_ACCESS_KEY: process.env.AMAZONPAY_ACCESS_KEY || 'your amazon pay access key',
  AMAZONPAY_SECRET_KEY: process.env.AMAZONPAY_SECRET_KEY || 'your amazon pay secret key',

  PRIVATE_KEY: `-----BEGIN RSA PRIVATE KEY-----
  MIICXQIBAAKBgQDUH3YJ9lSOPsof/8qyHKPG1kuAQXNLEWE4bd+VLBgbEitOwm9+
  TLpzcnzweaiVfr9NIoaEydxP4ZlJF/h/7fhOuazSQRld429/k+ZzyfmpDkGIPbgK
  OndPdy0AuWZoiEMXKQvSbtmbCN0isWlquW1vU7FnSJi4Dm1LbgpnL6FLgwIDAQAB
  AoGBAIbHaq/PxVAQU0tbssXS7rkDJjva2k/DPjuljF9zAeoJdFz5q+/a/skl4H7H
  PjemrhRrsH8k54gV9th7k5htcswhjs+beqAAS2gbkfM2gyE1py3eMW+9o7B+iurd
  anml/SQburJEOqHnavIH33IfqDL21ikNo++3CIfMobKcGbhRAkEA/MrF8V4JEhWH
  RYp5dl4Ykeu6+yP71Yg1ZWAqRRBzU+Mvei4I2zO/wjYiBmSY/1R++bBRLV+uybfO
  eAXzq49xSQJBANbQkaSTcQfMxXB/YmADBWSxzNuxeUqhkKvUlmrC9r6tMcPDjgkw
  I02bPsrkZVWtb1JUvwF2sK9j1ZFsmwXXYmsCQC3BLe6wDIg/aUqG89Ee2ueeeSt3
  qd9OVgvRShVSEu2+ExvUNTonta+bSLFLh/2+93SOG0NRLDvKjw5eVWpZ/jECQQC1
  bWxEun5RXyI2NHAqtQJ+HCjwOAFABhrA9Yig3M83FeIc+/HfUrfOWNr800++v/9w
  YsD7hHoPd9sturNniJTHAkAY27gpCsXkQ4mBYNMmyW7SvP0u7D4J39CpM1vLBInM
  SSMOg2rBkjg7SFp1Y+xtRNv6V/fYLQq2ohILPu1KkHIf
  -----END RSA PRIVATE KEY-----`,
  PUBLIC_KEY: `-----BEGIN PUBLIC KEY-----
  MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDUH3YJ9lSOPsof/8qyHKPG1kuA
  QXNLEWE4bd+VLBgbEitOwm9+TLpzcnzweaiVfr9NIoaEydxP4ZlJF/h/7fhOuazS
  QRld429/k+ZzyfmpDkGIPbgKOndPdy0AuWZoiEMXKQvSbtmbCN0isWlquW1vU7Fn
  SJi4Dm1LbgpnL6FLgwIDAQAB
  -----END PUBLIC KEY-----`,

  CASHFREE_MAIL_DEFAULT_ACCOUNT: process.env.CASHFREE_MAIL_DEFAULT_ACCOUNT || 'test@cashfree.com',

  STATISTICS_DB_POOLSIZE: process.env.STATISTICS_DB_POOLSIZE || 10,

  DB_SQL_MIN_POOLSIZE: process.env.DB_SQL_MIN_POOLSIZE || 10,
  DB_SQL_MAX_POOLSIZE: process.env.DB_SQL_MAX_POOLSIZE || 50,

  SENTRY_DSN: process.env.SENTRY_DSN || 'https://public@sentry.example.com/',

  CRON_AUTH_TOKEN: process.env.CRON_AUTH_TOKEN || 'test-secret',
  CRON_AUTH_ENABLED: process.env.CRON_AUTH_ENABLED || false,

  GRPC_SERVER_URI: process.env.GRPC_SERVER_URI || '0.0.0.0:50051',
  ADMIN_TARGET_URI: process.env.ADMIN_TARGET_URI || '0.0.0.0:50051',
  NODEBACKEND_TARGET_URI: process.env.NODEBACKEND_TARGET_URI || '0.0.0.0:50051',
  USER_INFO_TARGET_URI: process.env.USER_INFO_TARGET_URI || '0.0.0.0:50051'

}

module.exports = staging
