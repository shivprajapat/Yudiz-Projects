require('dotenv').config()
const ENV = process.env.NODE_ENV

const dev = {
  PORT: process.env.PORT || 4003,
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/crictracker-seo-dev',
  CONNECTION: parseInt(process.env.CONNECTION) || 20,
  DOMAIN_NAME: process.env.DOMAIN_NAME || 'crictracker.com',
  AUTH_SUBGRAPH_URL: process.env.AUTH_SUBGRAPH_URL || 'http://localhost:4001/graphql',
  SENTRY_DSN: process.env.SENTRY_DSN || 'https://f96732983f404051a44f501297f1d395@o992135.ingest.sentry.io/6073522',
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  JWT_SECRET: process.env.JWT_SECRET || 'crictracker',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  HOME_PAGE_ID_EVENT: process.env.HOME_PAGE_ID_EVENT || 'homepage-id-event',
  HOME_PAGE_SLUG_EVENT: process.env.HOME_PAGE_SLUG_EVENT || 'homepage-slug-event',
  HOME_PAGE_SLUG_CONSUMER: process.env.HOME_PAGE_SLUG_CONSUMER || 'homepage-slug-consumer',
  HOME_PAGE_ID_CONSUMER: process.env.HOME_PAGE_ID_CONSUMER || 'homepage-id-consumer',
  HOME_PAGE_SLUG_GROUP: process.env.HOME_PAGE_SLUG_GROUP || 'homepage-slug-group',
  HOME_PAGE_ID_GROUP: process.env.HOME_PAGE_ID_GROUP || 'homepage-id-group',
  SEO_STATUS_CHANGE_EVENT: process.env.SEO_STATUS_CHANGE_EVENT || 'seo-status-change-event',
  SEO_STATUS_CHANGE_CONSUMER: process.env.SEO_STATUS_CHANGE_CONSUMER || 'seo-status-change-consumer',
  SEO_STATUS_CHANGE_GROUP: process.env.SEO_STATUS_CHANGE_GROUP || 'seo-status-change-group',
  CREATE_SEO_GROUP: process.env.CREATE_SEO_GROUP || 'create-seo-group',
  CREATE_SEO_CONSUMER_0: process.env.CREATE_SEO_CONSUMER_0 || 'create-seo-consumer-0',
  SITEMAP_SLUG_EVENT: process.env.SITEMAP_SLUG_EVENT || 'sitemap-slug-event',
  SITEMAP_SLUG_CONSUMER: process.env.SITEMAP_SLUG_CONSUMER || 'sitemap-slug-consumer',
  SITEMAP_SLUG_GROUP: process.env.SITEMAP_SLUG_GROUP || 'sitemap-slug-group',
  SITEMAP_ID_EVENT: process.env.SITEMAP_ID_EVENT || 'sitemap-id-event',
  SITEMAP_ID_CONSUMER: process.env.SITEMAP_ID_CONSUMER || 'sitemap-id-consumer',
  SITEMAP_ID_GROUP: process.env.SITEMAP_ID_GROUP || 'sitemap-id-group',
  CREATE_SEO_EVENT: process.env.CREATE_SEO_EVENT || 'create-seo-event',

  CREATE_SEO_SLUG_GROUP: process.env.CREATE_SEO_SLUG_GROUP || 'create-seo-slug-group',
  CREATE_SEO_SLUG_CONSUMER_0: process.env.CREATE_SEO_SLUG_CONSUMER_0 || 'create-seo-slug-consumer-0',
  CREATE_SEO_SLUG_EVENT: process.env.CREATE_SEO_SLUG_EVENT || 'create-seo-slug-event',

  CREATE_SERIES_SEO_SLUG_GROUP: process.env.CREATE_SERIES_SEO_SLUG_GROUP || 'create-series-seo-slug-group',
  CREATE_SERIES_SEO_SLUG_CONSUMER_0: process.env.CREATE_SERIES_SEO_SLUG_CONSUMER_0 || 'create-series-seo-slug-consumer-0',
  CREATE_SERIES_SEO_SLUG_EVENT: process.env.CREATE_SERIES_SEO_SLUG_EVENT || 'create-series-seo-slug-event',

  CREATE_FILTER_CATEGORY_EVENT: process.env.CREATE_FILTER_CATEGORY_EVENT || 'create-filter-category-event',
  CREATE_FILTER_CATEGORY_GROUP: process.env.CREATE_FILTER_CATEGORY_GROUP || 'create-filter-category-group',
  CREATE_FILTER_CATEGORY_CONSUMER: process.env.CREATE_FILTER_CATEGORY_CONSUMER || 'create-filter-category-consumer',
  seoGrpcUrl: process.env.SEO_GRPC_URL || '0.0.0.0:3003',
  KEEP_ALIVE_TIMEOUT: process.env.KEEP_ALIVE_TIMEOUT || 65000
}
const stag = {
  PORT: process.env.PORT || 4003,
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/crictracker-seo-dev',
  DOMAIN_NAME: process.env.DOMAIN_NAME || 'crictracker.com',
  CONNECTION: parseInt(process.env.CONNECTION) || 20,
  AUTH_SUBGRAPH_URL: process.env.AUTH_SUBGRAPH_URL || 'http://localhost:4001/graphql',
  SENTRY_DSN: process.env.SENTRY_DSN || 'https://f96732983f404051a44f501297f1d395@o992135.ingest.sentry.io/6073522',
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  JWT_SECRET: process.env.JWT_SECRET || 'crictracker',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  HOME_PAGE_ID_EVENT: process.env.HOME_PAGE_ID_EVENT || 'homepage-id-event',
  HOME_PAGE_SLUG_EVENT: process.env.HOME_PAGE_SLUG_EVENT || 'homepage-slug-event',
  HOME_PAGE_SLUG_CONSUMER: process.env.HOME_PAGE_SLUG_CONSUMER || 'homepage-slug-consumer',
  HOME_PAGE_ID_CONSUMER: process.env.HOME_PAGE_ID_CONSUMER || 'homepage-id-consumer',
  HOME_PAGE_SLUG_GROUP: process.env.HOME_PAGE_SLUG_GROUP || 'homepage-slug-group',
  HOME_PAGE_ID_GROUP: process.env.HOME_PAGE_ID_GROUP || 'homepage-id-group',
  SEO_STATUS_CHANGE_EVENT: process.env.SEO_STATUS_CHANGE_EVENT || 'seo-status-change-event',
  SEO_STATUS_CHANGE_CONSUMER: process.env.SEO_STATUS_CHANGE_CONSUMER || 'seo-status-change-consumer',
  SEO_STATUS_CHANGE_GROUP: process.env.SEO_STATUS_CHANGE_GROUP || 'seo-status-change-group',
  CREATE_SEO_GROUP: process.env.CREATE_SEO_GROUP || 'create-seo-group',
  CREATE_SEO_CONSUMER_0: process.env.CREATE_SEO_CONSUMER_0 || 'create-seo-consumer-0',
  CREATE_SEO_EVENT: process.env.CREATE_SEO_EVENT || 'create-seo-event',

  CREATE_SEO_SLUG_GROUP: process.env.CREATE_SEO_SLUG_GROUP || 'create-seo-slug-group',
  CREATE_SEO_SLUG_CONSUMER_0: process.env.CREATE_SEO_SLUG_CONSUMER_0 || 'create-seo-slug-consumer-0',
  CREATE_SEO_SLUG_EVENT: process.env.CREATE_SEO_SLUG_EVENT || 'create-seo-slug-event',

  CREATE_SERIES_SEO_SLUG_GROUP: process.env.CREATE_SERIES_SEO_SLUG_GROUP || 'create-series-seo-slug-group',
  CREATE_SERIES_SEO_SLUG_CONSUMER_0: process.env.CREATE_SERIES_SEO_SLUG_CONSUMER_0 || 'create-series-seo-slug-consumer-0',
  CREATE_SERIES_SEO_SLUG_EVENT: process.env.CREATE_SERIES_SEO_SLUG_EVENT || 'create-series-seo-slug-event',

  CREATE_FILTER_CATEGORY_EVENT: process.env.CREATE_FILTER_CATEGORY_EVENT || 'create-filter-category-event',
  CREATE_FILTER_CATEGORY_GROUP: process.env.CREATE_FILTER_CATEGORY_GROUP || 'create-filter-category-group',
  CREATE_FILTER_CATEGORY_CONSUMER: process.env.CREATE_FILTER_CATEGORY_CONSUMER || 'create-filter-category-consumer',
  seoGrpcUrl: process.env.SEO_GRPC_URL || '0.0.0.0:3003',
  KEEP_ALIVE_TIMEOUT: process.env.KEEP_ALIVE_TIMEOUT || 65000
}
const prod = {
  PORT: process.env.PORT || 4003,
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/crictracker-seo-stag',
  CONNECTION: parseInt(process.env.CONNECTION) || 20,
  DOMAIN_NAME: process.env.DOMAIN_NAME || 'crictracker.com',
  AUTH_SUBGRAPH_URL: process.env.AUTH_SUBGRAPH_URL || 'http://localhost:4001/',
  SENTRY_DSN: process.env.SENTRY_DSN || 'https://6233a21ba1064ab9a702ee191113639e@o992135.ingest.sentry.io/6725513',
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  JWT_SECRET: process.env.JWT_SECRET || 'crictracker',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  HOME_PAGE_ID_EVENT: process.env.HOME_PAGE_ID_EVENT || 'homepage-id-event',
  HOME_PAGE_SLUG_EVENT: process.env.HOME_PAGE_SLUG_EVENT || 'homepage-slug-event',
  HOME_PAGE_SLUG_CONSUMER: process.env.HOME_PAGE_SLUG_CONSUMER || 'homepage-slug-consumer',
  HOME_PAGE_ID_CONSUMER: process.env.HOME_PAGE_ID_CONSUMER || 'homepage-id-consumer',
  HOME_PAGE_SLUG_GROUP: process.env.HOME_PAGE_SLUG_GROUP || 'homepage-slug-group',
  HOME_PAGE_ID_GROUP: process.env.HOME_PAGE_ID_GROUP || 'homepage-id-group',
  SEO_STATUS_CHANGE_EVENT: process.env.SEO_STATUS_CHANGE_EVENT || 'seo-status-change-event',
  SEO_STATUS_CHANGE_CONSUMER: process.env.SEO_STATUS_CHANGE_CONSUMER || 'seo-status-change-consumer',
  SEO_STATUS_CHANGE_GROUP: process.env.SEO_STATUS_CHANGE_GROUP || 'seo-status-change-group',
  CREATE_SEO_GROUP: process.env.CREATE_SEO_GROUP || 'create-seo-group',
  CREATE_SEO_CONSUMER_0: process.env.CREATE_SEO_CONSUMER_0 || 'create-seo-consumer-0',
  CREATE_SEO_EVENT: process.env.CREATE_SEO_EVENT || 'create-seo-event',

  CREATE_SEO_SLUG_GROUP: process.env.CREATE_SEO_SLUG_GROUP || 'create-seo-slug-group',
  CREATE_SEO_SLUG_CONSUMER_0: process.env.CREATE_SEO_SLUG_CONSUMER_0 || 'create-seo-slug-consumer-0',
  CREATE_SEO_SLUG_EVENT: process.env.CREATE_SEO_SLUG_EVENT || 'create-seo-slug-event',

  CREATE_SERIES_SEO_SLUG_GROUP: process.env.CREATE_SERIES_SEO_SLUG_GROUP || 'create-series-seo-slug-group',
  CREATE_SERIES_SEO_SLUG_CONSUMER_0: process.env.CREATE_SERIES_SEO_SLUG_CONSUMER_0 || 'create-series-seo-slug-consumer-0',
  CREATE_SERIES_SEO_SLUG_EVENT: process.env.CREATE_SERIES_SEO_SLUG_EVENT || 'create-series-seo-slug-event',

  CREATE_FILTER_CATEGORY_EVENT: process.env.CREATE_FILTER_CATEGORY_EVENT || 'create-filter-category-event',
  CREATE_FILTER_CATEGORY_GROUP: process.env.CREATE_FILTER_CATEGORY_GROUP || 'create-filter-category-group',
  CREATE_FILTER_CATEGORY_CONSUMER: process.env.CREATE_FILTER_CATEGORY_CONSUMER || 'create-filter-category-consumer',
  SITEMAP_ID_CONSUMER: process.env.SITEMAP_ID_CONSUMER || 'sitemap-id-consumer',
  SITEMAP_ID_EVENT: process.env.SITEMAP_ID_EVENT || 'sitemap-id-event',
  SITEMAP_ID_GROUP: process.env.SITEMAP_ID_GROUP || 'sitemap-id-group',
  SITEMAP_SLUG_CONSUMER: process.env.SITEMAP_SLUG_CONSUMER || 'sitemap-slug-consumer',
  SITEMAP_SLUG_EVENT: process.env.SITEMAP_SLUG_EVENT || 'sitemap-slug-event',
  SITEMAP_SLUG_GROUP: process.env.SITEMAP_SLUG_GROUP || 'sitemap-slug-group',
  seoGrpcUrl: process.env.SEO_GRPC_URL || '0.0.0.0:3003',
  KEEP_ALIVE_TIMEOUT: process.env.KEEP_ALIVE_TIMEOUT || 65000
}
const test = {
  PORT: process.env.PORT || 4003,
  DB_URL: process.env.TEST_DB_URL || 'mongodb://localhost:27017/crictracker-seo-test',
  CONNECTION: parseInt(process.env.CONNECTION) || 20,
  DOMAIN_NAME: process.env.DOMAIN_NAME || 'crictracker.com',
  AUTH_SUBGRAPH_URL: process.env.AUTH_SUBGRAPH_URL || 'http://localhost:4001/',
  JWT_SECRET: process.env.JWT_SECRET || 'crictracker',
  SENTRY_DSN: process.env.SENTRY_DSN || 'https://f96732983f404051a44f501297f1d395@o992135.ingest.sentry.io/6073522',
  HOME_PAGE_ID_EVENT: process.env.HOME_PAGE_ID_EVENT || 'homepage-id-event',
  HOME_PAGE_SLUG_EVENT: process.env.HOME_PAGE_SLUG_EVENT || 'homepage-slug-event',
  HOME_PAGE_SLUG_CONSUMER: process.env.HOME_PAGE_SLUG_CONSUMER || 'homepage-slug-consumer',
  HOME_PAGE_ID_CONSUMER: process.env.HOME_PAGE_ID_CONSUMER || 'homepage-id-consumer',
  HOME_PAGE_SLUG_GROUP: process.env.HOME_PAGE_SLUG_GROUP || 'homepage-slug-group',
  HOME_PAGE_ID_GROUP: process.env.HOME_PAGE_ID_GROUP || 'homepage-id-group',
  SEO_STATUS_CHANGE_EVENT: process.env.SEO_STATUS_CHANGE_EVENT || 'seo-status-change-event',
  SEO_STATUS_CHANGE_CONSUMER: process.env.SEO_STATUS_CHANGE_CONSUMER || 'seo-status-change-consumer',
  SEO_STATUS_CHANGE_GROUP: process.env.SEO_STATUS_CHANGE_GROUP || 'seo-status-change-group',
  CREATE_SEO_GROUP: process.env.CREATE_SEO_GROUP || 'create-seo-group',
  CREATE_SEO_CONSUMER_0: process.env.CREATE_SEO_CONSUMER_0 || 'create-seo-consumer-0',
  CREATE_SEO_EVENT: process.env.CREATE_SEO_EVENT || 'create-seo-event',

  CREATE_SEO_SLUG_GROUP: process.env.CREATE_SEO_SLUG_GROUP || 'create-seo-slug-group',
  CREATE_SEO_SLUG_CONSUMER_0: process.env.CREATE_SEO_SLUG_CONSUMER_0 || 'create-seo-slug-consumer-0',
  CREATE_SEO_SLUG_EVENT: process.env.CREATE_SEO_SLUG_EVENT || 'create-seo-slug-event',

  CREATE_SERIES_SEO_SLUG_GROUP: process.env.CREATE_SERIES_SEO_SLUG_GROUP || 'create-series-seo-slug-group',
  CREATE_SERIES_SEO_SLUG_CONSUMER_0: process.env.CREATE_SERIES_SEO_SLUG_CONSUMER_0 || 'create-series-seo-slug-consumer-0',
  CREATE_SERIES_SEO_SLUG_EVENT: process.env.CREATE_SERIES_SEO_SLUG_EVENT || 'create-series-seo-slug-event',

  CREATE_FILTER_CATEGORY_EVENT: process.env.CREATE_FILTER_CATEGORY_EVENT || 'create-filter-category-event',
  CREATE_FILTER_CATEGORY_GROUP: process.env.CREATE_FILTER_CATEGORY_GROUP || 'create-filter-category-group',
  CREATE_FILTER_CATEGORY_CONSUMER: process.env.CREATE_FILTER_CATEGORY_CONSUMER || 'create-filter-category-consumer',
  seoGrpcUrl: process.env.SEO_GRPC_URL || '0.0.0.0:3003',
  KEEP_ALIVE_TIMEOUT: process.env.KEEP_ALIVE_TIMEOUT || 65000
}

if (ENV === 'prod') {
  module.exports = prod
} else if (ENV === 'stag') {
  module.exports = stag
} else if (ENV === 'test') {
  module.exports = test
} else {
  module.exports = dev
}

console.log(`Server Env is ${ENV}`)
