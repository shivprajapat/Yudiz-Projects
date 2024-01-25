require('dotenv').config()
const ENV = process.env.NODE_ENV

const dev = {
  PORT: process.env.PORT || 4004,
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/crictracker-match-dev',
  CONNECTION: parseInt(process.env.CONNECTION) || 50,
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  DOMAIN_NAME: process.env.DOMAIN_NAME || 'crictracker.com',
  AUTH_SUBGRAPH_URL: process.env.AUTH_SUBGRAPH_URL || 'http://localhost:4004/graphql',
  ARTICLE_SUBGRAPH_URL: process.env.ARTICLE_SUBGRAPH_URL || 'http://localhost:4002',
  SENTRY_DSN: process.env.SENTRY_DSN || 'https://66ecc6572c134e1d9ec724c991dea023@o992135.ingest.sentry.io/6073525',
  ENTITY_SPORT_BASE_URL: process.env.ENTITY_SPORT_BASE_URL || 'https://rest.entitysport.com/v2',
  ENTITY_SPORT_TOKEN: process.env.ENTITY_SPORT_TOKEN || 'a89fc2986ba377420cd25292d0a694be',
  SEO_SUBGRAPH_URL: process.env.SEO_SUBGRAPH_URL || 'http://localhost:4003/graphql',
  JWT_SECRET: process.env.JWT_SECRET || 'crictracker',
  IP_EXPIRE_SEC: process.env.IP_EXPIRE_SEC || 300,
  AWS_ACCESSKEYID: process.env.AWS_ACCESSKEYID || 'AKIAVEG4UMFNJUU4K6N5',
  AWS_SECRETKEY: process.env.AWS_SECRETKEY || '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',
  AWS_REGION: process.env.AWS_REGION || 'ap-south-1',
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'cricktracker-admin-panel',
  S3_BUCKET_URL: process.env.S3_BUCKET_URL || 'https://crictracker-admin-panel.s3.ap-south-1.amazonaws.com/',
  CREATE_SEO_GROUP: process.env.CREATE_SEO_GROUP || 'create-seo-group',
  CREATE_SEO_CONSUMER_0: process.env.CREATE_SEO_CONSUMER_0 || 'create-seo-consumer-0',
  CREATE_SEO_EVENT: process.env.CREATE_SEO_EVENT || 'create-seo-event',
  AUTHOR_COUNT_UPDATE_EVENT: process.env.AUTHOR_COUNT_UPDATE_EVENT || 'author-count-update-event',
  AUTHOR_COUNT_UPDATE_CONSUMER: process.env.AUTHOR_COUNT_UPDATE_CONSUMER || 'author-count-update-consumer',
  SERIES_CATEGORY_EVENT: process.env.SERIES_CATEGORY_EVENT || 'series-category-event',
  SERIES_CATEGORY_GROUP: process.env.SERIES_CATEGORY_GROUP || 'series-category-group',
  SERIES_CATEGORY_CONSUMER: process.env.SERIES_CATEGORY_CONSUMER_0 || 'series-category-consumer-0',
  AUTHOR_COUNT_UPDATE_GROUP: process.env.AUTHOR_COUNT_UPDATE_GROUP || 'author-count-update-group',

  TAG_SERVICE_EVENT: process.env.TAG_SERVICE_EVENT || 'tag-service-event',
  TAG_SERVICE_GROUP: process.env.TAG_SERVICE_GROUP || 'tag-service-group',
  TAG_SERVICE_CONSUMER_0: process.env.TAG_SERVICE_CONSUMER_0 || 'tag-service-consumer-0',

  CREATE_TAG_EVENT: process.env.CREATE_TAG_EVENT || 'create-tag-event',
  CREATE_TAG_GROUP: process.env.CREATE_TAG_GROUP || 'create-tag-group',
  CREATE_TAG_CONSUMER_0: process.env.CREATE_TAG_CONSUMER_0 || 'create-tag-consumer-0',

  S3_BUCKET_TEAM_LOGO_PATH: process.env.S3_BUCKET_TEAM_LOGO_PATH || 'team/logo/',
  S3_BUCKET_TEAM_THUMB_URL_PATH: process.env.S3_BUCKET_TEAM_THUMB_URL_PATH || 'team/thumbUrl/',
  S3_BUCKET_PLAYER_LOGO_PATH: process.env.S3_BUCKET_PLAYER_LOGO_PATH || 'player/logo/',
  S3_BUCKET_PLAYER_THUMB_URL_PATH: process.env.S3_BUCKET_PLAYER_THUMB_URL_PATH || 'player/thumbUrl/',
  S3_PLAYER_HEAD_PATH: process.env.S3_PLAYER_HEAD_PATH || 'player/head/',
  S3_TEAM_JERSEY_PATH: process.env.S3_TEAM_JERSEY_PATH || 'team/jersey/',
  S3_TEAM_FLAG_PATH: process.env.S3_TEAM_FLAG_PATH || 'team/thumbUrl/',

  CREATE_BOOKMARK_FANTASY_ARTICLE_EVENT: process.env.CREATE_BOOKMARK_FANTASY_ARTICLE_EVENT || 'create-bookmark-fantasy-article-event',
  CREATE_BOOKMARK_FANTASY_ARTICLE_GROUP: process.env.CREATE_BOOKMARK_FANTASY_ARTICLE_GROUP || 'create-bookmark-fantasy-article-group',
  CREATE_BOOKMARK_FANTASY_ARTICLE_CONSUMER_0: process.env.CREATE_BOOKMARK_FANTASY_ARTICLE_CONSUMER_0 || 'create-bookmark-fantasy-article-consumer',

  UPDATE_BOOKMARK_GROUP: process.env.UPDATE_BOOKMARK_GROUP || 'update-bookmark-group',
  UPDATE_BOOKMARK_EVENT: process.env.UPDATE_BOOKMARK_EVENT || 'update-bookmark-event',
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://www.crictracker.com',

  CACHE_10S: 10, // 10 seconds
  CACHE_1M: 60, // 1 minute
  CACHE_2M: 120, // 2 minute
  CACHE_1H: 3600, // 1 hour
  CACHE_1D: 86400, // 1 day
  CACHE_10D: 864000, // 10 days
  CACHE_6H: 21600, // 6 Hours
  CACHE_5M: 300, // 5 minute
  CACHE_10M: 600, // 10 minute
  CACHE_5S: 5, // 5 seconds,
  CACHE_30M: 1800, // 30 minute
  ALLOW_DISK_USE: (process.env.ALLOW_DISK_USE === 'true') ? true : false || false,
  ew: process.env.EW || '11wickets-fantasy-tips',
  de: process.env.DE || 'dream11-fantasy-tips',

  MAX_ALLOW_CLAPS: process.env.MAX_ALLOW_CLAPS || 5,
  seoGrpcUrl: process.env.SEO_GRPC_URL || 'localhost:3003',
  matchManagementGrpcUrl: process.env.MATCHMANAGEMENT_GRPC_URL || 'localhost:3004',
  articleGrpc: process.env.ARTICLE_GRPC_URL || 'localhost:3002',
  globalWidgetGrpc: process.env.GLOBAL_WIDGET_GRPC_URL || 'localhost:3006',
  KEEP_ALIVE_TIMEOUT: process.env.KEEP_ALIVE_TIMEOUT || 65000,
  SEO_REST_URL: process.env.SEO_REST_URL || 'http://localhost:4003/',
  OPEN_WEATHER_API_KEY: process.env.OPEN_WEATHER_API_KEY || '6d982f4b1026d77d16a213fdbbfce666'
}
const stag = {
  PORT: process.env.PORT || 4004,
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/crictracker-match-dev',
  CONNECTION: parseInt(process.env.CONNECTION) || 50,
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  ARTICLE_DB_URL: process.env.ARTICLE_DB_URL || 'mongodb://localhost:27017/crictracker-article-dev',
  SEO_DB_URL: process.env.SEO_DB_URL || 'mongodb://localhost:27017/crictracker-seo-dev',
  DOMAIN_NAME: process.env.DOMAIN_NAME || 'crictracker.com',
  AUTH_SUBGRAPH_URL: process.env.AUTH_SUBGRAPH_URL || 'http://localhost:4004/graphql',
  ARTICLE_SUBGRAPH_URL: process.env.ARTICLE_SUBGRAPH_URL || 'http://localhost:4002',
  SENTRY_DSN: process.env.SENTRY_DSN || 'https://66ecc6572c134e1d9ec724c991dea023@o992135.ingest.sentry.io/6073525',
  ENTITY_SPORT_BASE_URL: process.env.ENTITY_SPORT_BASE_URL || 'https://rest.entitysport.com/v2',
  ENTITY_SPORT_TOKEN: process.env.ENTITY_SPORT_TOKEN || 'a89fc2986ba377420cd25292d0a694be',
  SEO_SUBGRAPH_URL: process.env.SEO_SUBGRAPH_URL || 'http://localhost:4003',
  JWT_SECRET: process.env.JWT_SECRET || 'crictracker',
  IP_EXPIRE_SEC: process.env.IP_EXPIRE_SEC || 300,
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'cricktracker-admin-panel',
  CREATE_SEO_GROUP: process.env.CREATE_SEO_GROUP || 'create-seo-group',
  CREATE_SEO_CONSUMER_0: process.env.CREATE_SEO_CONSUMER_0 || 'create-seo-consumer-0',
  CREATE_SEO_EVENT: process.env.CREATE_SEO_EVENT || 'create-seo-event',
  AUTHOR_COUNT_UPDATE_EVENT: process.env.AUTHOR_COUNT_UPDATE_EVENT || 'author-count-update-event',
  AUTHOR_COUNT_UPDATE_CONSUMER: process.env.AUTHOR_COUNT_UPDATE_CONSUMER || 'author-count-update-consumer',
  AUTHOR_COUNT_UPDATE_GROUP: process.env.AUTHOR_COUNT_UPDATE_GROUP || 'author-count-update-group',

  TAG_SERVICE_EVENT: process.env.TAG_SERVICE_EVENT || 'tag-service-event',
  TAG_SERVICE_GROUP: process.env.TAG_SERVICE_GROUP || 'tag-service-group',
  TAG_SERVICE_CONSUMER_0: process.env.TAG_SERVICE_CONSUMER_0 || 'tag-service-consumer-0',

  CREATE_TAG_EVENT: process.env.CREATE_TAG_EVENT || 'create-tag-event',
  CREATE_TAG_GROUP: process.env.CREATE_TAG_GROUP || 'create-tag-group',
  CREATE_TAG_CONSUMER_0: process.env.CREATE_TAG_CONSUMER_0 || 'create-tag-consumer-0',

  SERIES_CATEGORY_EVENT: process.env.SERIES_CATEGORY_EVENT || 'series-category-event',
  SERIES_CATEGORY_GROUP: process.env.SERIES_CATEGORY_GROUP || 'series-category-group',
  SERIES_CATEGORY_CONSUMER: process.env.SERIES_CATEGORY_CONSUMER_0 || 'series-category-consumer-0',

  S3_BUCKET_TEAM_LOGO_PATH: process.env.S3_BUCKET_TEAM_LOGO_PATH || 'team/logo/',
  S3_BUCKET_TEAM_THUMB_URL_PATH: process.env.S3_BUCKET_TEAM_THUMB_URL_PATH || 'team/thumbUrl/',
  S3_BUCKET_PLAYER_LOGO_PATH: process.env.S3_BUCKET_PLAYER_LOGO_PATH || 'player/logo/',
  S3_BUCKET_PLAYER_THUMB_URL_PATH: process.env.S3_BUCKET_PLAYER_THUMB_URL_PATH || 'player/thumbUrl/',
  S3_PLAYER_HEAD_PATH: process.env.S3_PLAYER_HEAD_PATH || 'player/head/',
  S3_TEAM_JERSEY_PATH: process.env.S3_TEAM_JERSEY_PATH || 'team/jersey/',
  S3_TEAM_FLAG_PATH: process.env.S3_TEAM_FLAG_PATH || 'team/thumbUrl/',

  CREATE_BOOKMARK_FANTASY_ARTICLE_EVENT: process.env.CREATE_BOOKMARK_FANTASY_ARTICLE_EVENT || 'create-bookmark-fantasy-article-event',
  CREATE_BOOKMARK_FANTASY_ARTICLE_GROUP: process.env.CREATE_BOOKMARK_FANTASY_ARTICLE_GROUP || 'create-bookmark-fantasy-article-group',
  CREATE_BOOKMARK_FANTASY_ARTICLE_CONSUMER_0: process.env.CREATE_BOOKMARK_FANTASY_ARTICLE_CONSUMER_0 || 'create-bookmark-fantasy-article-consumer',

  UPDATE_BOOKMARK_GROUP: process.env.UPDATE_BOOKMARK_GROUP || 'update-bookmark-group',
  UPDATE_BOOKMARK_EVENT: process.env.UPDATE_BOOKMARK_EVENT || 'update-bookmark-event',

  CACHE_10S: 10, // 10 seconds
  CACHE_1M: 60, // 1 minute
  CACHE_2M: 120, // 2 minute
  CACHE_1H: 3600, // 1 hour
  CACHE_1D: 86400, // 1 day
  CACHE_10D: 864000, // 10 days
  CACHE_6H: 21600, // 6 Hours
  CACHE_5M: 300, // 5 minute
  CACHE_10M: 600, // 10 minute
  CACHE_5S: 5, // 5 seconds,
  CACHE_30M: 1800, // 30 minute
  ALLOW_DISK_USE: (process.env.ALLOW_DISK_USE === 'true') ? true : false || false,

  MAX_ALLOW_CLAPS: process.env.MAX_ALLOW_CLAPS || 5,
  seoGrpcUrl: process.env.SEO_GRPC_URL || 'localhost:3003',
  matchManagementGrpcUrl: process.env.MATCHMANAGEMENT_GRPC_URL || 'localhost:3004',
  articleGrpc: process.env.ARTICLE_GRPC_URL || 'localhost:3002',
  globalWidgetGrpc: process.env.GLOBAL_WIDGET_GRPC_URL || 'localhost:3006',
  KEEP_ALIVE_TIMEOUT: process.env.KEEP_ALIVE_TIMEOUT || 65000,
  SEO_REST_URL: process.env.SEO_REST_URL || 'https://seo-dev.beta.crictracker.com/',
  OPEN_WEATHER_API_KEY: process.env.OPEN_WEATHER_API_KEY || '6d982f4b1026d77d16a213fdbbfce666'

}
const prod = {
  PORT: process.env.PORT || 4004,
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/crictracker-match-stag',
  CONNECTION: parseInt(process.env.CONNECTION) || 15,
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  DOMAIN_NAME: process.env.DOMAIN_NAME || 'crictracker.com',
  AUTH_SUBGRAPH_URL: process.env.AUTH_SUBGRAPH_URL || 'http://localhost:4004/',
  ARTICLE_SUBGRAPH_URL: process.env.ARTICLE_SUBGRAPH_URL || 'http://localhost:4002',
  SENTRY_DSN: process.env.SENTRY_DSN || 'https://c89624bf1d4c4165b614fca80365a857@o992135.ingest.sentry.io/6725511',
  ENTITY_SPORT_BASE_URL: process.env.ENTITY_SPORT_BASE_URL || 'https://rest.entitysport.com/v2',
  JWT_SECRET: process.env.JWT_SECRET || 'crictracker',
  ENTITY_SPORT_TOKEN: process.env.ENTITY_SPORT_TOKEN || 'a89fc2986ba377420cd25292d0a694be',
  IP_EXPIRE_SEC: process.env.IP_EXPIRE_SEC || 300,
  AWS_ACCESSKEYID: process.env.AWS_ACCESSKEYID || 'AKIAVEG4UMFNJUU4K6N5',
  AWS_SECRETKEY: process.env.AWS_SECRETKEY || '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',
  AWS_REGION: process.env.AWS_REGION || 'ap-south-1',
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'cricktracker-admin-panel',
  S3_BUCKET_URL: process.env.S3_BUCKET_URL || 'https://crictracker-admin-panel.s3.ap-south-1.amazonaws.com/',
  CREATE_SEO_GROUP: process.env.CREATE_SEO_GROUP || 'create-seo-group',
  CREATE_SEO_CONSUMER_0: process.env.CREATE_SEO_CONSUMER_0 || 'create-seo-consumer-0',
  CREATE_SEO_EVENT: process.env.CREATE_SEO_EVENT || 'create-seo-event',
  AUTHOR_COUNT_UPDATE_EVENT: process.env.AUTHOR_COUNT_UPDATE_EVENT || 'author-count-update-event',
  AUTHOR_COUNT_UPDATE_CONSUMER: process.env.AUTHOR_COUNT_UPDATE_CONSUMER || 'author-count-update-consumer',
  AUTHOR_COUNT_UPDATE_GROUP: process.env.AUTHOR_COUNT_UPDATE_GROUP || 'author-count-update-group',

  TAG_SERVICE_EVENT: process.env.TAG_SERVICE_EVENT || 'tag-service-event',
  TAG_SERVICE_GROUP: process.env.TAG_SERVICE_GROUP || 'tag-service-group',
  TAG_SERVICE_CONSUMER_0: process.env.TAG_SERVICE_CONSUMER_0 || 'tag-service-consumer-0',

  CREATE_TAG_EVENT: process.env.CREATE_TAG_EVENT || 'create-tag-event',
  CREATE_TAG_GROUP: process.env.CREATE_TAG_GROUP || 'create-tag-group',
  CREATE_TAG_CONSUMER_0: process.env.CREATE_TAG_CONSUMER_0 || 'create-tag-consumer-0',

  SERIES_CATEGORY_EVENT: process.env.SERIES_CATEGORY_EVENT || 'series-category-event',
  SERIES_CATEGORY_GROUP: process.env.SERIES_CATEGORY_GROUP || 'series-category-group',
  SERIES_CATEGORY_CONSUMER: process.env.SERIES_CATEGORY_CONSUMER_0 || 'series-category-consumer-0',

  S3_BUCKET_TEAM_LOGO_PATH: process.env.S3_BUCKET_TEAM_LOGO_PATH || 'team/logo/',
  S3_BUCKET_TEAM_THUMB_URL_PATH: process.env.S3_BUCKET_TEAM_THUMB_URL_PATH || 'team/thumbUrl/',
  S3_BUCKET_PLAYER_LOGO_PATH: process.env.S3_BUCKET_PLAYER_LOGO_PATH || 'player/logo/',
  S3_BUCKET_PLAYER_THUMB_URL_PATH: process.env.S3_BUCKET_PLAYER_THUMB_URL_PATH || 'player/thumbUrl/',
  S3_PLAYER_HEAD_PATH: process.env.S3_PLAYER_HEAD_PATH || 'player/head/',
  S3_TEAM_JERSEY_PATH: process.env.S3_TEAM_JERSEY_PATH || 'team/jersey/',
  S3_TEAM_FLAG_PATH: process.env.S3_TEAM_FLAG_PATH || 'team/thumbUrl/',

  CREATE_BOOKMARK_FANTASY_ARTICLE_EVENT: process.env.CREATE_BOOKMARK_FANTASY_ARTICLE_EVENT || 'create-bookmark-fantasy-article-event',
  CREATE_BOOKMARK_FANTASY_ARTICLE_GROUP: process.env.CREATE_BOOKMARK_FANTASY_ARTICLE_GROUP || 'create-bookmark-fantasy-article-group',
  CREATE_BOOKMARK_FANTASY_ARTICLE_CONSUMER_0: process.env.CREATE_BOOKMARK_FANTASY_ARTICLE_CONSUMER_0 || 'create-bookmark-fantasy-article-consumer',

  UPDATE_BOOKMARK_GROUP: process.env.UPDATE_BOOKMARK_GROUP || 'update-bookmark-group',
  UPDATE_BOOKMARK_EVENT: process.env.UPDATE_BOOKMARK_EVENT || 'update-bookmark-event',
  SEO_SUBGRAPH_URL: process.env.SEO_SUBGRAPH_URL || 'https://gateway.crictracker.com/graphql',
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://www.crictracker.com',

  CACHE_10S: 10, // 10 seconds
  CACHE_1M: 60, // 1 minute
  CACHE_2M: 120, // 2 minute
  CACHE_1H: 3600, // 1 hour
  CACHE_1D: 86400, // 1 day
  CACHE_10D: 864000, // 10 days
  CACHE_6H: 21600, // 6 Hours
  CACHE_5M: 300, // 5 minute
  CACHE_10M: 600, // 10 minute
  CACHE_5S: 5, // 5 seconds,
  CACHE_30M: 1800, // 30 minute
  ew: process.env.EW || '11wickets-fantasy-tips',
  de: process.env.DE || 'dream11-fantasy-tips',
  ALLOW_DISK_USE: (process.env.ALLOW_DISK_USE === 'true') ? true : false || false,

  MAX_ALLOW_CLAPS: process.env.MAX_ALLOW_CLAPS || 5,
  seoGrpcUrl: process.env.SEO_GRPC_URL || 'localhost:3003',
  matchManagementGrpcUrl: process.env.MATCHMANAGEMENT_GRPC_URL || 'localhost:3004',
  articleGrpc: process.env.ARTICLE_GRPC_URL || 'localhost:3002',
  globalWidgetGrpc: process.env.GLOBAL_WIDGET_GRPC_URL || 'localhost:3006',
  KEEP_ALIVE_TIMEOUT: process.env.KEEP_ALIVE_TIMEOUT || 65000,
  SEO_REST_URL: process.env.SEO_REST_URL || 'https://seo.crictracker.com/',
  OPEN_WEATHER_API_KEY: process.env.OPEN_WEATHER_API_KEY || '6d982f4b1026d77d16a213fdbbfce666'
}

if (ENV === 'prod') {
  module.exports = prod
} else if (ENV === 'stag') {
  module.exports = stag
} else {
  module.exports = dev
}

console.log(`Server Env is ${ENV}`)
