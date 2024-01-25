const prod = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  DB_POOLSIZE: 10,
  JWT_SECRET: process.env.JWT_SECRET,
  PRIVATE_KEY: process.env.PRIVATE_KEY,
  JWT_EXPIRY: process.env.JWT_EXPIRY,
  LOGIN_LIMIT: process.env.LOGIN_LIMIT,
  THRESHOLD_RATE_LIMIT: process.env.THRESHOLD_RATE_LIMIT || 0,
  MAIL_TRANSPORTER: {
    // service: process.env.SMTP_SERVICES || 'gmail',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_USERNAME || 'example@gmail.com',
      pass: process.env.SMTP_PASSWORD || 'example@123'
    },
    secure: false
  },
  SMTP_FROM: process.env.SMTP_FROM || 'fwl47576@gmail.com',
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  QUEUE_CONFIG: {
    EMAIL_QUEUE: 'SendMail',
    DEAD_EMAIL_QUEUE: 'dead:SendMail'
  },
  AWS_REGION: process.env.AWS_REGION || 'ap-south-1',
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'gym-management',
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY || 'your aws access key',
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY || 'your aws secretAccessKey',
  S3_TRANSACTION_REPORT_PATH: process.env.S3_TRANSACTION_REPORT_PATH || 'report/transaction/'
}

module.exports = prod
