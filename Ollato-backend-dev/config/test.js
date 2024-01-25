const test = {
  DEPLOY_HOST_URL: process.env.DEPLOY_HOST_URL,
  PORT: process.env.PORT || 1340,

  FRONTEND_HOST_URL: process.env.FRONTEND_HOST_URL || 'https://student.ollato.com',
  ADMIN_HOST_URL: process.env.ADMIN_HOST_URL || 'https://access.ollato.com',
  DB_SQL_NAME: process.env.TEST_DB_SQL_NAME || 'ollato_development',
  DB_SQL_USER: process.env.TEST_DB_SQL_USER || 'root',
  DB_SQL_PASSWORD: process.env.TEST_DB_SQL_PASSWORD || 'root',
  DB_SQL_HOST: process.env.TEST_DB_SQL_HOST || '127.0.0.1',
  DB_SQL_HOST_REPLICA: process.env.TEST_DB_SQL_HOST_REPLICA || process.env.TEST_DB_SQL_HOST || '127.0.0.1',
  DB_SQL_DIALECT: process.env.TEST_DB_SQL_DIALECT || 'mysql',
  // Use a different storage. Default: none
  seederStorage: 'sequelize',
  // Use a different file name. Default: sequelize-data.json
  seederStoragePath: 'sequelizeData.json',
  // Use a different table name. Default: SequelizeData
  seederStorageTableName: 'sequelize_data',
  JWT_VALIDITY: process.env.JWT_VALIDITY || '5d',
  JWT_SECRET: process.env.JWT_SECRET || 'aAbBcC@test_123',
  MAIL_TRANSPORTER: {
    service: process.env.SMTP_SERVICES || 'gmail',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USERNAME || 'example@gmail.com',
      pass: process.env.SMTP_PASSWORD || 'example@123'
    },
    secure: false
  },
  SMTP_FROM: process.env.SMTP_FROM || 'no-reply@ollato.com',
  LOGIN_HARD_LIMIT: 5, // 0 = unlimited
  LOGIN_HARD_LIMIT_ADMIN: 5, // 0 = unlimited
  EMAIL_TEMPLATE_PATH: 'views/email_templates/',
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY || 'your aws access key',
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY || 'your aws secretAccessKey',
  AWS_KYC_ACCESS_KEY: process.env.AWS_KYC_ACCESS_KEY || 'your aws kyc access key',
  AWS_KYC_SECRET_KEY: process.env.AWS_KYC_SECRET_KEY || 'your aws kyc secretAccessKey',
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'ollato-backend-uploads',
  S3_BUCKET_URL: process.env.S3_BUCKET_URL || 'https://ollato-backend-uploads.s3.ap-south-1.amazonaws.com/',
  S3_PUBLIC_BUCKET_NAME: process.env.S3_PUBLIC_BUCKET_NAME || 'ollato-public-upload',
  S3_PUBLIC_BUCKET_URL: process.env.S3_PUBLIC_BUCKET_URL || 'https://ollato-public-upload.s3.ap-south-1.amazonaws.com/',
  S3_BUCKET_KYC_URL: process.env.S3_BUCKET_KYC_URL || 'https://fantasy-kyc.s3.ap-south-1.amazonaws.com/',
  S3_KYC_BUCKET_NAME: process.env.S3_KYC_BUCKET_NAME || 'ollato-kyc',
  FIREBASE_WEB_API_KEY: process.env.FIREBASE_WEB_API_KEY || 'your firebase key',
  FUNCTIONALITY: {
    USER_KYC_VISIBLE: true
  },
  GOOGLE_CLIENT_ID_W: process.env.GOOGLE_CLIENT_ID_W || '218538323308-p1bf5od94pbdfna1rstq3s1kea8gpgfr.apps.googleusercontent.com',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  CONTACT_EMAIL: '',
  CACHE_1: 10, // 10 seconds
  CACHE_2: 60, // 1 minute
  CACHE_3: 3600, // 1 hour
  CACHE_4: 86400, // 1 day
  CACHE_5: 864000, // 10 days
  CACHE_6: 21600, // 6 Hours
  CACHE_7: 300, // 5 minute
  CACHE_8: 600, // 10 minute
  CACHE_9: 5, // 5 seconds,
  CACHE_10: 1800, // 30 minute
  PUBLIC_EMAIL_BLOCK: true,

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
  MSG91_TEMPLATE_ID: process.env.MSG91_TEMPLATE_ID,
  MSG91_AUTH_KEY: process.env.MSG91_AUTH_KEY,
  OTP_PROVIDER: process.env.OTP_PROVIDER,
  payumoney: {
    key: process.env.PAYUMONEY_KEY || 'JPM7Fg',
    salt: process.env.PAYUMONEY_SALT || 'SPH4lamCAE'
  }
}

module.exports = test
