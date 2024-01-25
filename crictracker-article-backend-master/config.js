require('dotenv').config()
const ENV = process.env.NODE_ENV

const dev = {
  PORT: process.env.PORT || 4002,
  ARTICLE_DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/crictracker-article-dev',
  CONNECTION: parseInt(process.env.CONNECTION) || 50,
  AUTH_SUBGRAPH_URL: process.env.AUTH_SUBGRAPH_URL || 'http://localhost:4001',
  MATCH_MANAGEMENT_SUBGRAPH_URL: process.env.MATCH_MANAGEMENT_SUBGRAPH_URL || 'https://matchmanage-dev.crictracker.ml',
  SEO_SUBGRAPH_URL: process.env.SEO_SUBGRAPH_URL || 'http://localhost:4003',
  SEO_REST_URL: process.env.SEO_REST_URL || 'http://localhost:4003/',
  SENTRY_DSN: process.env.SENTRY_DSN || 'https://c7afbdb451d74161b1929f2af68253ba@o992135.ingest.sentry.io/6073494',
  NODE_ENV: process.env.NODE_ENV || 'dev',
  JWT_SECRET: process.env.JWT_SECRET || 'crictracker',
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'yudizmean@gmail.com',
  AWS_ACCESSKEYID: process.env.AWS_ACCESSKEYID || 'AKIAVEG4UMFNJUU4K6N5',
  AWS_SECRETKEY: process.env.AWS_SECRETKEY || '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',
  AWS_REGION: process.env.AWS_REGION || 'ap-south-1',
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'crictracker-admin-panel',
  S3_BUCKET_URL: process.env.S3_BUCKET_URL || 'https://crictracker-admin-panel.s3.ap-south-1.amazonaws.com/',
  S3_CDN_URL: process.env.S3_CDN_URL || 'https://media.crictracker.com/',
  S3_BUCKET_ARTICLE_ATTACHMENTIMAGE_PATH: process.env.S3_BUCKET_ARTICLE_ATTACHMENTIMAGE_PATH || 'media/attachments',
  MAX_ALLOW_CLAPS: process.env.MAX_ALLOW_CLAPS || 5,
  IP_EXPIRE_SEC: process.env.IP_EXPIRE_SEC || 300,

  SITEMAP_SLUG_EVENT: process.env.SITEMAP_SLUG_EVENT || 'sitemap-slug-event',
  SITEMAP_SLUG_CONSUMER: process.env.SITEMAP_SLUG_CONSUMER || 'sitemap-slug-consumer',
  SITEMAP_SLUG_GROUP: process.env.SITEMAP_SLUG_GROUP || 'sitemap-slug-group',
  SITEMAP_ID_EVENT: process.env.SITEMAP_ID_EVENT || 'sitemap-id-event',
  SITEMAP_ID_CONSUMER: process.env.SITEMAP_ID_CONSUMER || 'sitemap-id-consumer',
  SITEMAP_ID_GROUP: process.env.SITEMAP_ID_GROUP || 'sitemap-id-group',
  CREATE_SEO_GROUP: process.env.CREATE_SEO_GROUP || 'create-seo-group',
  CREATE_SEO_CONSUMER_0: process.env.CREATE_SEO_CONSUMER_0 || 'create-seo-consumer-0',
  CREATE_SEO_EVENT: process.env.CREATE_SEO_EVENT || 'create-seo-event',
  SERIES_CATEGORY_EVENT: process.env.SERIES_CATEGORY_EVENT || 'series-category-event',
  SERIES_CATEGORY_GROUP: process.env.SERIES_CATEGORY_GROUP || 'series-category-group',
  SERIES_CATEGORY_CONSUMER: process.env.SERIES_CATEGORY_CONSUMER_0 || 'series-category-consumer-0',

  BOOKMARK_COUNT_UPDATE_EVENT: process.env.BOOKMARK_COUNT_UPDATE_EVENT || 'bookmark-count-update-event',
  BOOKMARK_COUNT_UPDATE_CONSUMER: process.env.BOOKMARK_COUNT_UPDATE_CONSUMER || 'bookmark-count-update-consumer',
  BOOKMARK_COUNT_UPDATE_GROUP: process.env.BOOKMARK_COUNT_UPDATE_GROUP || 'bookmark-count-update-group',

  YOUTUBE_CLIENT_ID: process.env.YOUTUBE_CLIENT_ID || '443902559106-svrptipvj2ol1g4fnuogdpd5kprb8efa.apps.googleusercontent.com',
  YOUTUBE_CLIENT_SECRET: process.env.YOUTUBE_CLIENT_SECRET || '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',
  YOUTUBE_REDIRECT_URI: process.env.YOUTUBE_REDIRECT_URI || 'https://article-dev.crictracker.ml/api/oauth2callback',
  YOUTUBE_OAUTH_SCOPE: [process.env.YOUTUBE_OAUTH_SCOPE] || ['https://www.googleapis.com/auth/youtube.readonly'],
  ADMIN_FRONT_REDIRECT_URL: process.env.ADMIN_FRONT_REDIRECT_URL || 'https://admin-dev.crictracker.ml/fetch-playlist-success',

  HOME_WIDGET_ID_EVENT: process.env.HOME_WIDGET_ID_EVENT || 'home-widget-id-event',
  HOME_WIDGET_ID_CONSUMER: process.env.HOME_WIDGET_ID_CONSUMER || 'home-widget-id-consumer',
  HOME_WIDGET_ID_GROUP: process.env.HOME_WIDGET_ID_GROUP || 'home-widget-id-group',
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://cricweb-dev.crictracker.ml',
  BASE_SITEMAP: process.env.BASE_SITEMAP || 'sitemap',
  FEED_TITLE: 'CricTracker',
  FEED_DESCRIPTION: 'Latest Cricket News, Updates, Articles, Stats, Records, Etc',

  ALLOW_DISK_USE: process.env.ALLOW_DISK_USE || false,

  S3_BUCKET_VIDEO_PATH: process.env.S3_BUCKET_VIDEO_PATH || 'video/',
  S3_BUCKET_PLAYLIST_PATH: process.env.S3_BUCKET_PLAYLIST_PATH || 'playlist/',

  CREATE_SERIES_SEO_SLUG_GROUP: process.env.CREATE_SERIES_SEO_SLUG_GROUP || 'create-series-seo-slug-group',
  CREATE_SERIES_SEO_SLUG_EVENT: process.env.CREATE_SERIES_SEO_SLUG_EVENT || 'create-series-seo-slug-event',

  CREATE_BOOKMARK_FANTASY_ARTICLE_EVENT: process.env.CREATE_BOOKMARK_FANTASY_ARTICLE_EVENT || 'create-bookmark-fantasy-article-event',
  CREATE_BOOKMARK_FANTASY_ARTICLE_GROUP: process.env.CREATE_BOOKMARK_FANTASY_ARTICLE_GROUP || 'create-bookmark-fantasy-article-group',

  UPDATE_BOOKMARK_GROUP: process.env.UPDATE_BOOKMARK_GROUP || 'update-bookmark-group',
  UPDATE_BOOKMARK_CONSUMER_0: process.env.UPDATE_BOOKMARK_CONSUMER_0 || 'update-bookmark-consumer',
  UPDATE_BOOKMARK_EVENT: process.env.UPDATE_BOOKMARK_EVENT || 'update-bookmark-event',

  INSTANT_ARTICLE_FEED_TITLE: process.env.INSTANT_ARTICLE_FEED_TITLE || 'CricTracker - Instant Articles',
  TWITTER_TOKEN: process.env.TWITTER_TOKEN || 'AAAAAAAAAAAAAAAAAAAAAK%2F1kgEAAAAAfjQem5rYrTwAkK0zJc3575T2DDA%3DUwFuit3A9PV2MkVFTCGwZ0gCktrrvcxe50miAqHNVQXGJ4iRZb',

  CREATE_CURRENT_SERIES_EVENT: process.env.CREATE_CURRENT_SERIES_EVENT || 'create-current-series-event',
  CREATE_CURRENT_SERIES_GROUP: process.env.CREATE_CURRENT_SERIES_GROUP || 'create-current-series-group',
  CREATE_CURRENT_SERIES_CONSUMER: process.env.CREATE_CURRENT_SERIES_CONSUMER || 'create-current-series-consumer',

  CREATE_FILTER_CATEGORY_EVENT: process.env.CREATE_FILTER_CATEGORY_EVENT || 'create-filter-category-event',
  CREATE_FILTER_CATEGORY_GROUP: process.env.CREATE_FILTER_CATEGORY_GROUP || 'create-filter-category-group',

  TAG_SERVICE_EVENT: process.env.TAG_SERVICE_EVENT || 'tag-service-event',
  TAG_SERVICE_GROUP: process.env.TAG_SERVICE_GROUP || 'tag-service-group',
  TAG_SERVICE_CONSUMER_0: process.env.TAG_SERVICE_CONSUMER_0 || 'tag-service-consumer-0',

  CREATE_TAG_EVENT: process.env.CREATE_TAG_EVENT || 'create-tag-event',
  CREATE_TAG_GROUP: process.env.CREATE_TAG_GROUP || 'create-tag-group',
  CREATE_TAG_CONSUMER_0: process.env.CREATE_TAG_CONSUMER_0 || 'create-tag-consumer-0',

  CACHE_2: 60, // 1 minute
  CACHE_3: 3600, // 1 hour
  CACHE_7: 300, // 5 minute
  CACHE_2H: 7200, // 2 hours

  YOUTUBE_CHANNEL_ID: process.env.YOUTUBE_CHANNEL_ID || 'UC5oTaFLOFlLNeAJt_dt5rBw',
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || 'AIzaSyDTpwWxXrRTg7fSVDwLMvLcF91rJxJFjaM',
  seoGrpcUrl: process.env.SEO_GRPC_URL || 'localhost:3003',
  matchManagementGrpcUrl: process.env.MATCHMANAGEMENT_GRPC_URL || 'localhost:3004',
  globalWidgetGrpcUrl: process.env.GLOBAL_WIDGET_GRPC_URL || 'localhost:3006',
  articleGrpc: process.env.ARTICLE_GRPC_URL || '0.0.0.0:3002',
  authGrpcUrl: process.env.AUTH_GRPC_URL || '0.0.0.0:2001',
  ARTICLE_BACKEND: process.env.BACKEND_URL || 'http://localhost:4002'
}

const stag = {
  PORT: process.env.PORT || 4002,
  ARTICLE_DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/crictracker-article-dev',
  AUTH_SUBGRAPH_URL: process.env.AUTH_SUBGRAPH_URL || 'http://localhost:4001/graphql',
  MATCH_MANAGEMENT_SUBGRAPH_URL: process.env.MATCH_MANAGEMENT_SUBGRAPH_URL || 'https://matchmanage-dev.beta.crictracker.com',
  SEO_SUBGRAPH_URL: process.env.SEO_SUBGRAPH_URL || 'http://localhost:4003',
  SEO_REST_URL: process.env.SEO_REST_URL || 'https://seo-dev.beta.crictracker.com/',
  SENTRY_DSN: process.env.SENTRY_DSN || 'https://c7afbdb451d74161b1929f2af68253ba@o992135.ingest.sentry.io/6073494',
  NODE_ENV: process.env.NODE_ENV || 'dev',
  JWT_SECRET: process.env.JWT_SECRET || 'crictracker',
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'yudizmean@gmail.com',
  AWS_ACCESSKEYID: process.env.AWS_ACCESSKEYID || 'AKIAVEG4UMFNJUU4K6N5',
  AWS_SECRETKEY: process.env.AWS_SECRETKEY || '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',
  AWS_REGION: process.env.AWS_REGION || 'ap-south-1',
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'crictracker-admin-panel',
  S3_BUCKET_URL: process.env.S3_BUCKET_URL || 'https://crictracker-admin-panel.s3.ap-south-1.amazonaws.com/',
  S3_CDN_URL: process.env.S3_CDN_URL || 'https://media.crictracker.com/',
  S3_BUCKET_ARTICLE_ATTACHMENTIMAGE_PATH: process.env.S3_BUCKET_ARTICLE_ATTACHMENTIMAGE_PATH || 'media/attachments',
  MAX_ALLOW_CLAPS: process.env.MAX_ALLOW_CLAPS || 5,
  IP_EXPIRE_SEC: process.env.IP_EXPIRE_SEC || 300,

  YOUTUBE_CLIENT_ID: process.env.YOUTUBE_CLIENT_ID || '443902559106-svrptipvj2ol1g4fnuogdpd5kprb8efa.apps.googleusercontent.com',
  YOUTUBE_CLIENT_SECRET: process.env.YOUTUBE_CLIENT_SECRET || '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',
  YOUTUBE_REDIRECT_URI: process.env.YOUTUBE_REDIRECT_URI || ' https://article-stag.crictracker.ml/api/oauth2callback',
  YOUTUBE_OAUTH_SCOPE: [process.env.YOUTUBE_OAUTH_SCOPE] || ['https://www.googleapis.com/auth/youtube.readonly'],
  ADMIN_FRONT_REDIRECT_URL: process.env.ADMIN_FRONT_REDIRECT_URL || 'https://admin-stag.crictracker.ml/fetch-playlist-success',

  HOME_WIDGET_ID_EVENT: process.env.HOME_WIDGET_ID_EVENT || 'home-widget-id-event',
  HOME_WIDGET_ID_CONSUMER: process.env.HOME_WIDGET_ID_CONSUMER || 'home-widget-id-consumer',
  HOME_WIDGET_ID_GROUP: process.env.HOME_WIDGET_ID_GROUP || 'home-widget-id-group',
  BASE_SITEMAP: process.env.BASE_SITEMAP || 'sitemap',
  FEED_TITLE: 'CricTracker',
  FEED_DESCRIPTION: 'Latest Cricket News, Updates, Articles, Stats, Records, Etc',

  BOOKMARK_COUNT_UPDATE_EVENT: process.env.BOOKMARK_COUNT_UPDATE_EVENT || 'bookmark-count-update-event',
  BOOKMARK_COUNT_UPDATE_CONSUMER: process.env.BOOKMARK_COUNT_UPDATE_CONSUMER || 'bookmark-count-update-consumer',
  BOOKMARK_COUNT_UPDATE_GROUP: process.env.BOOKMARK_COUNT_UPDATE_GROUP || 'bookmark-count-update-group',

  TAG_SERVICE_EVENT: process.env.TAG_SERVICE_EVENT || 'tag-service-event',
  TAG_SERVICE_GROUP: process.env.TAG_SERVICE_GROUP || 'tag-service-group',
  TAG_SERVICE_CONSUMER_0: process.env.TAG_SERVICE_CONSUMER_0 || 'tag-service-consumer-0',

  CREATE_TAG_EVENT: process.env.CREATE_TAG_EVENT || 'create-tag-event',
  CREATE_TAG_GROUP: process.env.CREATE_TAG_GROUP || 'create-tag-group',
  CREATE_TAG_CONSUMER_0: process.env.CREATE_TAG_CONSUMER_0 || 'create-tag-consumer-0',

  CREATE_SEO_GROUP: process.env.CREATE_SEO_GROUP || 'create-seo-group',
  CREATE_SEO_CONSUMER_0: process.env.CREATE_SEO_CONSUMER_0 || 'create-seo-consumer-0',
  CREATE_SEO_EVENT: process.env.CREATE_SEO_EVENT || 'create-seo-event',

  SERIES_CATEGORY_EVENT: process.env.SERIES_CATEGORY_EVENT || 'series-category-event',
  SERIES_CATEGORY_GROUP: process.env.SERIES_CATEGORY_GROUP || 'series-category-group',
  SERIES_CATEGORY_CONSUMER: process.env.SERIES_CATEGORY_CONSUMER_0 || 'series-category-consumer-0',

  CREATE_SERIES_SEO_SLUG_GROUP: process.env.CREATE_SERIES_SEO_SLUG_GROUP || 'create-series-seo-slug-group',
  CREATE_SERIES_SEO_SLUG_EVENT: process.env.CREATE_SERIES_SEO_SLUG_EVENT || 'create-series-seo-slug-event',

  ALLOW_DISK_USE: process.env.ALLOW_DISK_USE || false,

  S3_BUCKET_VIDEO_PATH: process.env.S3_BUCKET_VIDEO_PATH || 'video/',
  S3_BUCKET_PLAYLIST_PATH: process.env.S3_BUCKET_PLAYLIST_PATH || 'playlist/',
  INSTANT_ARTICLE_FEED_TITLE: process.env.INSTANT_ARTICLE_FEED_TITLE || 'INSTANT_ARTICLE_FEED_TITLE',
  TWITTER_TOKEN: process.env.TWITTER_TOKEN || 'AAAAAAAAAAAAAAAAAAAAAK%2F1kgEAAAAAfjQem5rYrTwAkK0zJc3575T2DDA%3DUwFuit3A9PV2MkVFTCGwZ0gCktrrvcxe50miAqHNVQXGJ4iRZb',

  CREATE_BOOKMARK_FANTASY_ARTICLE_EVENT: process.env.CREATE_BOOKMARK_FANTASY_ARTICLE_EVENT || 'create-bookmark-fantasy-article-event',
  CREATE_BOOKMARK_FANTASY_ARTICLE_GROUP: process.env.CREATE_BOOKMARK_FANTASY_ARTICLE_GROUP || 'create-bookmark-fantasy-article-group',

  CREATE_CURRENT_SERIES_EVENT: process.env.CREATE_CURRENT_SERIES_EVENT || 'create-current-series-event',
  CREATE_CURRENT_SERIES_GROUP: process.env.CREATE_CURRENT_SERIES_GROUP || 'create-current-series-group',
  CREATE_CURRENT_SERIES_CONSUMER: process.env.CREATE_CURRENT_SERIES_CONSUMER || 'create-current-series-consumer',

  CREATE_FILTER_CATEGORY_EVENT: process.env.CREATE_FILTER_CATEGORY_EVENT || 'create-filter-category-event',
  CREATE_FILTER_CATEGORY_GROUP: process.env.CREATE_FILTER_CATEGORY_GROUP || 'create-filter-category-group',

  UPDATE_BOOKMARK_GROUP: process.env.UPDATE_BOOKMARK_GROUP || 'update-bookmark-group',
  UPDATE_BOOKMARK_CONSUMER_0: process.env.UPDATE_BOOKMARK_CONSUMER_0 || 'update-bookmark-consumer',
  UPDATE_BOOKMARK_EVENT: process.env.UPDATE_BOOKMARK_EVENT || 'update-bookmark-event',

  CACHE_2: 60, // 1 minute
  CACHE_3: 3600, // 1 hour
  CACHE_7: 300, // 5 minute
  CACHE_2H: 7200, // 2 hours

  YOUTUBE_CHANNEL_ID: process.env.YOUTUBE_CHANNEL_ID || 'UC5oTaFLOFlLNeAJt_dt5rBw',
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || 'AIzaSyDFjV5Bqg8_9Dh-QKolibCPl9O-EktLf5I',
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://cricweb-dev.crictracker.ml',
  seoGrpcUrl: process.env.SEO_GRPC_URL || 'localhost:3003',
  matchManagementGrpcUrl: process.env.MATCHMANAGEMENT_GRPC_URL || 'localhost:3004',
  globalWidgetGrpcUrl: process.env.GLOBAL_WIDGET_GRPC_URL || 'localhost:3006',
  articleGrpc: process.env.ARTICLE_GRPC_URL || '0.0.0.0:3002',
  authGrpcUrl: process.env.AUTH_GRPC_URL || '0.0.0.0:2001',
  ARTICLE_BACKEND: process.env.BACKEND_URL || ''
}

const prod = {
  PORT: process.env.PORT || 4002,
  ARTICLE_DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/crictracker-article-stag',
  CONNECTION: parseInt(process.env.CONNECTION) || 30,
  AUTH_SUBGRAPH_URL: process.env.AUTH_SUBGRAPH_URL || 'http://localhost:4001/',
  SEO_SUBGRAPH_URL: process.env.SEO_SUBGRAPH_URL || 'http://seo.crictracker.com',
  SEO_REST_URL: process.env.SEO_REST_URL || 'https://seo.crictracker.com/',
  MATCH_MANAGEMENT_SUBGRAPH_URL: process.env.MATCH_MANAGEMENT_SUBGRAPH_URL || 'https://matchmanage.crictracker.com',
  SENTRY_DSN: process.env.SENTRY_DSN || 'https://4e97d3b1ccdd4779a086215a9d8bbd51@o992135.ingest.sentry.io/6725495',
  NODE_ENV: process.env.NODE_ENV || 'prod',
  JWT_SECRET: process.env.JWT_SECRET || 'crictracker',
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  SUPPORT_EMAIL: process.env.SUPPORT_EMAIL || 'yudizmean@gmail.com',
  AWS_ACCESSKEYID: process.env.AWS_ACCESSKEYID || 'AKIAVEG4UMFNJUU4K6N5',
  AWS_SECRETKEY: process.env.AWS_SECRETKEY || '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',
  AWS_REGION: process.env.AWS_REGION || 'ap-south-1',
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'crictracker-admin-panel',
  S3_BUCKET_URL: process.env.S3_BUCKET_URL || 'https://crictracker-admin-panel.s3.ap-south-1.amazonaws.com/',
  S3_CDN_URL: process.env.S3_CDN_URL || 'https://media.crictracker.com/',
  S3_BUCKET_ARTICLE_ATTACHMENTIMAGE_PATH: process.env.S3_BUCKET_ARTICLE_ATTACHMENTIMAGE_PATH || 'media/attachments',
  MAX_ALLOW_CLAPS: process.env.MAX_ALLOW_CLAPS || 5,
  IP_EXPIRE_SEC: process.env.IP_EXPIRE_SEC || 300,

  YOUTUBE_CLIENT_ID: process.env.YOUTUBE_CLIENT_ID || '443902559106-q11jpk7h0ki24fvops6sdjhmpckbuvao.apps.googleusercontent.com',
  YOUTUBE_CLIENT_SECRET: process.env.YOUTUBE_CLIENT_SECRET || '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',
  YOUTUBE_REDIRECT_URI: process.env.YOUTUBE_REDIRECT_URI || 'https://article-stag.crictracker.ml/api/oauth2callback',
  YOUTUBE_OAUTH_SCOPE: [process.env.YOUTUBE_OAUTH_SCOPE] || ['https://www.googleapis.com/auth/youtube.readonly'],
  ADMIN_FRONT_REDIRECT_URL: process.env.ADMIN_FRONT_REDIRECT_URL || 'https://admin-stag.crictracker.ml/fetch-playlist-success',
  CREATE_SEO_CONSUMER_0: process.env.CREATE_SEO_CONSUMER_0 || 'create-seo-consumer-0',

  BOOKMARK_COUNT_UPDATE_EVENT: process.env.BOOKMARK_COUNT_UPDATE_EVENT || 'bookmark-count-update-event',
  BOOKMARK_COUNT_UPDATE_CONSUMER: process.env.BOOKMARK_COUNT_UPDATE_CONSUMER || 'bookmark-count-update-consumer',
  BOOKMARK_COUNT_UPDATE_GROUP: process.env.BOOKMARK_COUNT_UPDATE_GROUP || 'bookmark-count-update-group',

  HOME_WIDGET_ID_EVENT: process.env.HOME_WIDGET_ID_EVENT || 'home-widget-id-event',
  HOME_WIDGET_ID_CONSUMER: process.env.HOME_WIDGET_ID_CONSUMER || 'home-widget-id-consumer',
  HOME_WIDGET_ID_GROUP: process.env.HOME_WIDGET_ID_GROUP || 'home-widget-id-group',
  BASE_SITEMAP: process.env.BASE_SITEMAP || 'sitemap',
  FEED_TITLE: 'CricTracker',
  FEED_DESCRIPTION: 'Latest Cricket News, Updates, Articles, Stats, Records, Etc',
  CREATE_SEO_EVENT: process.env.CREATE_SEO_EVENT || 'create-seo-event',

  ALLOW_DISK_USE: process.env.ALLOW_DISK_USE || false,
  S3_BUCKET_VIDEO_PATH: process.env.S3_BUCKET_VIDEO_PATH || 'video/',
  S3_BUCKET_PLAYLIST_PATH: process.env.S3_BUCKET_PLAYLIST_PATH || 'playlist/',

  CREATE_SERIES_SEO_SLUG_GROUP: process.env.CREATE_SERIES_SEO_SLUG_GROUP || 'create-series-seo-slug-group',
  CREATE_SERIES_SEO_SLUG_EVENT: process.env.CREATE_SERIES_SEO_SLUG_EVENT || 'create-series-seo-slug-event',

  INSTANT_ARTICLE_FEED_TITLE: process.env.INSTANT_ARTICLE_FEED_TITLE || 'CricTracker - Instant Articles',
  TWITTER_TOKEN: process.env.TWITTER_TOKEN || 'AAAAAAAAAAAAAAAAAAAAAK%2F1kgEAAAAAfjQem5rYrTwAkK0zJc3575T2DDA%3DUwFuit3A9PV2MkVFTCGwZ0gCktrrvcxe50miAqHNVQXGJ4iRZb',

  CREATE_BOOKMARK_FANTASY_ARTICLE_EVENT: process.env.CREATE_BOOKMARK_FANTASY_ARTICLE_EVENT || 'create-bookmark-fantasy-article-event',
  CREATE_BOOKMARK_FANTASY_ARTICLE_GROUP: process.env.CREATE_BOOKMARK_FANTASY_ARTICLE_GROUP || 'create-bookmark-fantasy-article-group',

  UPDATE_BOOKMARK_GROUP: process.env.UPDATE_BOOKMARK_GROUP || 'update-bookmark-group',
  UPDATE_BOOKMARK_CONSUMER_0: process.env.UPDATE_BOOKMARK_CONSUMER_0 || 'update-bookmark-consumer',
  UPDATE_BOOKMARK_EVENT: process.env.UPDATE_BOOKMARK_EVENT || 'update-bookmark-event',

  CREATE_CURRENT_SERIES_EVENT: process.env.CREATE_CURRENT_SERIES_EVENT || 'create-current-series-event',
  CREATE_CURRENT_SERIES_GROUP: process.env.CREATE_CURRENT_SERIES_GROUP || 'create-current-series-group',
  CREATE_CURRENT_SERIES_CONSUMER: process.env.CREATE_CURRENT_SERIES_CONSUMER || 'create-current-series-consumer',

  CREATE_FILTER_CATEGORY_EVENT: process.env.CREATE_FILTER_CATEGORY_EVENT || 'create-filter-category-event',
  CREATE_FILTER_CATEGORY_GROUP: process.env.CREATE_FILTER_CATEGORY_GROUP || 'create-filter-category-group',

  TAG_SERVICE_EVENT: process.env.TAG_SERVICE_EVENT || 'tag-service-event',
  TAG_SERVICE_GROUP: process.env.TAG_SERVICE_GROUP || 'tag-service-group',
  TAG_SERVICE_CONSUMER_0: process.env.TAG_SERVICE_CONSUMER_0 || 'tag-service-consumer-0',

  CREATE_TAG_EVENT: process.env.CREATE_TAG_EVENT || 'create-tag-event',
  CREATE_TAG_GROUP: process.env.CREATE_TAG_GROUP || 'create-tag-group',
  CREATE_TAG_CONSUMER_0: process.env.CREATE_TAG_CONSUMER_0 || 'create-tag-consumer-0',
  CREATE_SEO_GROUP: process.env.CREATE_SEO_GROUP || 'create-seo-group',
  SERIES_CATEGORY_CONSUMER: process.env.SERIES_CATEGORY_CONSUMER_0 || 'series-category-consumer-0',
  SERIES_CATEGORY_EVENT: process.env.SERIES_CATEGORY_EVENT || 'series-category-event',
  SERIES_CATEGORY_GROUP: process.env.SERIES_CATEGORY_GROUP || 'series-category-group',
  SITEMAP_ID_CONSUMER: process.env.SITEMAP_ID_CONSUMER || 'sitemap-id-consumer',
  SITEMAP_ID_EVENT: process.env.SITEMAP_ID_EVENT || 'sitemap-id-event',
  SITEMAP_ID_GROUP: process.env.SITEMAP_ID_GROUP || 'sitemap-id-group',
  SITEMAP_SLUG_CONSUMER: process.env.SITEMAP_SLUG_CONSUMER || 'sitemap-slug-consumer',
  SITEMAP_SLUG_EVENT: process.env.SITEMAP_SLUG_EVENT || 'sitemap-slug-event',
  SITEMAP_SLUG_GROUP: process.env.SITEMAP_SLUG_GROUP || 'sitemap-slug-group',
  CACHE_2: 60, // 1 minute
  CACHE_3: 3600, // 1 hour
  CACHE_7: 300, // 5 minute
  CACHE_2H: 7200, // 2 hours
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://cricweb-dev.crictracker.ml',
  YOUTUBE_CHANNEL_ID: process.env.YOUTUBE_CHANNEL_ID || 'UC5oTaFLOFlLNeAJt_dt5rBw',
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY || 'AIzaSyDFjV5Bqg8_9Dh-QKolibCPl9O-EktLf5I',
  seoGrpcUrl: process.env.SEO_GRPC_URL || 'localhost:3003',
  matchManagementGrpcUrl: process.env.MATCHMANAGEMENT_GRPC_URL || 'localhost:3004',
  globalWidgetGrpcUrl: process.env.GLOBAL_WIDGET_GRPC_URL || 'localhost:3006',
  articleGrpc: process.env.ARTICLE_GRPC_URL || '0.0.0.0:3002',
  authGrpcUrl: process.env.AUTH_GRPC_URL || '0.0.0.0:2001',
  ARTICLE_BACKEND: process.env.BACKEND_URL || ''
}

if (ENV === 'prod') {
  module.exports = prod
} else if (ENV === 'stag') {
  module.exports = stag
} else {
  module.exports = dev
}
console.log(`Server Env is ${ENV}`)
