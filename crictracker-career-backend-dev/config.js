require('dotenv').config()
const ENV = process.env.NODE_ENV

const dev = {
  PORT: process.env.PORT || 4007,
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/crictracker-career-dev',
  CONNECTION: parseInt(process.env.CONNECTION) || 10,
  AUTH_SUBGRAPH_URL: process.env.AUTH_SUBGRAPH_URL || 'http://localhost:4001/graphql',
  SENTRY_DSN: process.env.SENTRY_DSN || 'https://50e01ac405fa457dbb1aa01219a2c3b2@o992135.ingest.sentry.io/6725470',
  NODE_ENV: process.env.NODE_ENV || 'dev',
  JWT_SECRET: process.env.JWT_SECRET || 'crictracker',
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'yudizmean@gmail.com',
  AWS_ACCESSKEYID: process.env.AWS_ACCESSKEYID || 'AKIAVEG4UMFNJUU4K6N5',
  AWS_SECRETKEY: process.env.AWS_SECRETKEY || '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',
  AWS_REGION: process.env.AWS_REGION || 'ap-south-1',
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'crictracker-admin-panel',
  S3_BUCKET_JOB_APPLY_CV_PATH: process.env.S3_BUCKET_JOB_APPLY_CV_PATH || 'job/cv/',
  S3_BUCKET_WORK_SAMPLE_PATH: process.env.S3_BUCKET_WORK_SAMPLE_PATH || 'enquiry/work-sample/',

  CACHE_5M: 300, // 5 minute
  KEEP_ALIVE_TIMEOUT: process.env.KEEP_ALIVE_TIMEOUT || 65000
}

const stag = {
  PORT: process.env.PORT || 4007,
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/crictracker-career-dev',
  CONNECTION: parseInt(process.env.CONNECTION) || 10,
  AUTH_SUBGRAPH_URL: process.env.AUTH_SUBGRAPH_URL || 'http://localhost:4001/graphql',
  SENTRY_DSN: process.env.SENTRY_DSN || 'https://50e01ac405fa457dbb1aa01219a2c3b2@o992135.ingest.sentry.io/6725470',
  NODE_ENV: process.env.NODE_ENV || 'dev',
  JWT_SECRET: process.env.JWT_SECRET || 'crictracker',
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'yudizmean@gmail.com',
  AWS_ACCESSKEYID: process.env.AWS_ACCESSKEYID || 'AKIAVEG4UMFNJUU4K6N5',
  AWS_SECRETKEY: process.env.AWS_SECRETKEY || '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',
  AWS_REGION: process.env.AWS_REGION || 'ap-south-1',
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'crictracker-admin-panel',
  S3_BUCKET_JOB_APPLY_CV_PATH: process.env.S3_BUCKET_JOB_APPLY_CV_PATH || 'job/cv/',
  S3_BUCKET_WORK_SAMPLE_PATH: process.env.S3_BUCKET_WORK_SAMPLE_PATH || 'enquiry/work-sample/',

  CACHE_5M: 300, // 5 minute
  KEEP_ALIVE_TIMEOUT: process.env.KEEP_ALIVE_TIMEOUT || 65000
}
const prod = {
  PORT: process.env.PORT || 4007,
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/crictracker-career-stag',
  CONNECTION: parseInt(process.env.CONNECTION) || 10,
  AUTH_SUBGRAPH_URL: process.env.AUTH_SUBGRAPH_URL || 'http://localhost:4001/',
  SENTRY_DSN: process.env.SENTRY_DSN || 'https://93606d8f480243b9a0337c50b689f102@o992135.ingest.sentry.io/6725507',
  NODE_ENV: process.env.NODE_ENV || 'prod',
  JWT_SECRET: process.env.JWT_SECRET || 'crictracker',
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'yudizmean@gmail.com',
  AWS_ACCESSKEYID: process.env.AWS_ACCESSKEYID || 'AKIAVEG4UMFNJUU4K6N5',
  AWS_SECRETKEY: process.env.AWS_SECRETKEY || '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',
  AWS_REGION: process.env.AWS_REGION || 'ap-south-1',
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'crictracker-admin-panel',
  S3_BUCKET_JOB_APPLY_CV_PATH: process.env.S3_BUCKET_JOB_APPLY_CV_PATH || 'job/cv/',
  S3_BUCKET_WORK_SAMPLE_PATH: process.env.S3_BUCKET_WORK_SAMPLE_PATH || 'enquiry/work-sample/',

  CACHE_5M: 300, // 5 minute
  KEEP_ALIVE_TIMEOUT: process.env.KEEP_ALIVE_TIMEOUT || 65000
}

const test = {
  PORT: process.env.PORT || 4007,
  DB_URL: process.env.TEST_DB_URL || 'mongodb://localhost:27017/crictracker-career-test',
  CONNECTION: parseInt(process.env.CONNECTION) || 10,
  AUTH_SUBGRAPH_URL: process.env.AUTH_SUBGRAPH_URL || 'http://localhost:4001/',
  SENTRY_DSN: process.env.SENTRY_DSN || 'https://50e01ac405fa457dbb1aa01219a2c3b2@o992135.ingest.sentry.io/6725470',
  NODE_ENV: process.env.NODE_ENV || 'test',
  JWT_SECRET: process.env.JWT_SECRET || 'crictracker',
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'yudizmean@gmail.com',
  AWS_ACCESSKEYID: process.env.AWS_ACCESSKEYID || 'AKIAVEG4UMFNJUU4K6N5',
  AWS_SECRETKEY: process.env.AWS_SECRETKEY || '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',
  AWS_REGION: process.env.AWS_REGION || 'ap-south-1',
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'crictracker-admin-panel',
  S3_BUCKET_JOB_APPLY_CV_PATH: process.env.S3_BUCKET_JOB_APPLY_CV_PATH || 'job/cv/',
  S3_BUCKET_WORK_SAMPLE_PATH: process.env.S3_BUCKET_WORK_SAMPLE_PATH || 'enquiry/work-sample/',

  CACHE_5M: 300, // 5 minute,
  KEEP_ALIVE_TIMEOUT: process.env.KEEP_ALIVE_TIMEOUT || 65000
}

if (ENV === 'prod') {
  module.exports = prod
} else if (ENV === 'test') {
  module.exports = test
} else if (ENV === 'stag') {
  module.exports = stag
} else {
  module.exports = dev
}

console.log(`Server Env is ${ENV}`)
