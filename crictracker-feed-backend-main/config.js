require('dotenv').config()
if (!process.env.NODE_ENV) process.env.NODE_ENV = 'dev'
const ENV = process.env.NODE_ENV
console.log(ENV)

const dev = {
  PORT: process.env.PORT || 4002,
  FEED_DB_URL: process.env.FEED_DB_URL || 'mongodb://localhost:27017/crictracker-feed-dev',
  ARTICLE_DB_URL: process.env.ARTICLE_DB_URL || 'mongodb://localhost:27017/crictracker-article-dev',
  CONNECTION: parseInt(process.env.CONNECTION) || 50,
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  JWT_SECRET: process.env.JWT_SECRET || 'Crictracker-feed',
  JWT_VALIDITY: process.env.JWT_VALIDITY || '1d',
  seoGrpcUrl: process.env.SEO_GRPC_URL || 'localhost:3003',
  authGrpcUrl: process.env.AUTH_GRPC_URL || 'localhost:2001',
  FEED_TITLE: 'CricTracker',
  FEED_DESCRIPTION: 'Latest Cricket News, Updates, Articles, Stats, Records, Etc',
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://cricweb-dev.crictracker.ml',
  S3_CDN_URL: process.env.S3_CDN_URL || 'https://media.crictracker.com/',
  INSTANT_ARTICLE_FEED_TITLE: process.env.INSTANT_ARTICLE_FEED_TITLE || 'INSTANT_ARTICLE_FEED_TITLE',
  LOGIN_HARD_LIMIT_CLIENT: 5,
  JWT_LOGIN_VALIDITY: '30d',
  JWT_VERIFICATION_VALIDITY: '600s',
  POSTMARK_SERVER_CLIENT: process.env.POSTMARK_SERVER_CLIENT || '',
  SMTP_FROM: process.env.SMTP_FROM || '',
  SMTP_PRODUCT_URL: process.env.SMTP_PRODUCT_URL || '',
  SMTP_PRODUCT_NAME: process.env.SMTP_PRODUCT_NAME || '',
  SMTP_SUPPORT_EMAIL: process.env.SMTP_SUPPORT_EMAIL || '',
  FEED_BASE_URL: process.env.FEED_BASE_URL || 'https://feed.crictracker.com',
  MAX_ALLOW_CLAPS: 5,
  CACHE_2: 60, // 1 minute
  CACHE_3: 3600, // 1 hour
  CACHE_7: 300, // 5 minute
  CACHE_2H: 7200 // 2 hours
}

const stag = {
  PORT: process.env.PORT || 4002,
  FEED_DB_URL: process.env.FEED_DB_URL || 'mongodb://localhost:27017/crictracker-feed-dev',
  ARTICLE_DB_URL: process.env.ARTICLE_DB_URL || 'mongodb://localhost:27017/crictracker-article-dev',
  CONNECTION: parseInt(process.env.CONNECTION) || 50,
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  JWT_SECRET: process.env.JWT_SECRET || 'Crictracker-feed',
  JWT_VALIDITY: process.env.JWT_VALIDITY || '1d',
  seoGrpcUrl: process.env.SEO_GRPC_URL || 'localhost:3003',
  authGrpcUrl: process.env.AUTH_GRPC_URL || 'localhost:2001',
  FEED_TITLE: 'CricTracker',
  FEED_DESCRIPTION: 'Latest Cricket News, Updates, Articles, Stats, Records, Etc',
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://cricweb-dev.crictracker.ml',
  S3_CDN_URL: process.env.S3_CDN_URL || 'https://media.crictracker.com/',
  INSTANT_ARTICLE_FEED_TITLE: process.env.INSTANT_ARTICLE_FEED_TITLE || 'INSTANT_ARTICLE_FEED_TITLE',
  LOGIN_HARD_LIMIT_CLIENT: 5,
  JWT_LOGIN_VALIDITY: '30d',
  JWT_VERIFICATION_VALIDITY: '600s',
  POSTMARK_SERVER_CLIENT: process.env.POSTMARK_SERVER_CLIENT || '',
  SMTP_FROM: process.env.SMTP_FROM || '',
  SMTP_PRODUCT_URL: process.env.SMTP_PRODUCT_URL || '',
  SMTP_PRODUCT_NAME: process.env.SMTP_PRODUCT_NAME || '',
  SMTP_SUPPORT_EMAIL: process.env.SMTP_SUPPORT_EMAIL || '',
  FEED_BASE_URL: process.env.FEED_BASE_URL || 'https://feed.crictracker.com',
  MAX_ALLOW_CLAPS: 5,
  CACHE_2: 60, // 1 minute
  CACHE_3: 3600, // 1 hour
  CACHE_7: 300, // 5 minute
  CACHE_2H: 7200 // 2 hours
}

const prod = {
  PORT: process.env.PORT || 4002,
  FEED_DB_URL: process.env.FEED_DB_URL || 'mongodb://localhost:27017/crictracker-feed-dev',
  ARTICLE_DB_URL: process.env.ARTICLE_DB_URL || 'mongodb://localhost:27017/crictracker-article-dev',
  CONNECTION: parseInt(process.env.CONNECTION) || 50,
  REDIS_HOST: process.env.REDIS_HOST || 'localhost',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  JWT_SECRET: process.env.JWT_SECRET || 'Crictracker-feed',
  JWT_VALIDITY: process.env.JWT_VALIDITY || '1d',
  seoGrpcUrl: process.env.SEO_GRPC_URL || 'localhost:3003',
  authGrpcUrl: process.env.AUTH_GRPC_URL || 'localhost:3001',
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://cricweb-dev.crictracker.ml',
  FEED_TITLE: 'CricTracker',
  FEED_DESCRIPTION: 'Latest Cricket News, Updates, Articles, Stats, Records, Etc',
  S3_CDN_URL: process.env.S3_CDN_URL || 'https://media.crictracker.com/',
  INSTANT_ARTICLE_FEED_TITLE: process.env.INSTANT_ARTICLE_FEED_TITLE || 'INSTANT_ARTICLE_FEED_TITLE',
  LOGIN_HARD_LIMIT_CLIENT: 5,
  JWT_LOGIN_VALIDITY: '30d',
  JWT_VERIFICATION_VALIDITY: '600s',
  POSTMARK_SERVER_CLIENT: process.env.POSTMARK_SERVER_CLIENT || '',
  SMTP_FROM: process.env.SMTP_FROM || '',
  SMTP_PRODUCT_URL: process.env.SMTP_PRODUCT_URL || '',
  SMTP_PRODUCT_NAME: process.env.SMTP_PRODUCT_NAME || '',
  SMTP_SUPPORT_EMAIL: process.env.SMTP_SUPPORT_EMAIL || '',
  FEED_BASE_URL: process.env.FEED_BASE_URL || 'https://feed.crictracker.com',
  MAX_ALLOW_CLAPS: 5,
  CACHE_2: 60, // 1 minute
  CACHE_3: 3600, // 1 hour
  CACHE_7: 300, // 5 minute
  CACHE_2H: 7200 // 2 hours
}

if (ENV === 'prod') {
  console.log(`DB URL of ${ENV} MODE IS ${prod.DB_URL}`)
  module.exports = prod
} else if (ENV === 'stag') {
  console.log(`DB URL of ${ENV} MODE IS ${stag.DB_URL}`)
  module.exports = stag
} else {
  console.log(`DB URL of ${ENV} MODE IS ${dev.DB_URL}`)
  module.exports = dev
}
