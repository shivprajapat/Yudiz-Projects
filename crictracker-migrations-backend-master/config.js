require('dotenv').config()
let ENV = process.env.NODE_ENV

if (!process.env.NODE_ENV) ENV = 'dev'

const dev = {
  PORT: process.env.PORT || 1337,
  MATCHMANAGEMENT_DB_URL: process.env.MATCHMANAGEMENT_DB_URL || 'your DB url',
  SEO_DB_URL: process.env.SEO_DB_URL || 'mongodb://localhost:27017/crictracker-seo-dev',
  MIGRATION_DB_URL: process.env.MIGRATION_DB_URL || 'mongodb://localhost:27017/crictracker-migration',
  ARTICLE_DB_URL: process.env.ARTICLE_DB_URL || 'mongodb://localhost:27017/crictracker-migration',
  AUTHENTICATION_DB_URL: process.env.AUTHENTICATION_DB_URL || 'mongodb://localhost:27017/crictracker-migration',
  CAREER_DB_URL: process.env.CAREER_DB_URL || 'mongodb://localhost:27017/crictracker-career-dev',
  GLOBAL_WIDGET_DB_URL: process.env.GLOBAL_WIDGET_DB_URL || 'mongodb://localhost:27017/crictracker-widget-dev',

  SENTRY_DSN: process.env.SENTRY_DSN,
  SQL_HOST: process.env.SQL_HOST || 'localhost',
  SQL_PORT: process.env.SQL_PORT || '3306',
  SQL_DATABASE: process.env.SQL_DATABASE || 'admin',
  SQL_USER: process.env.SQL_USER || 'root',
  SQL_PASSWORD: process.env.SQL_PASSWORD || '',
  JWT_SECRET: process.env.JWT_SECRET || 'crictracker',
  ENTITY_SPORT_TOKEN: process.env.ENTITY_SPORT_TOKEN || 'your token',

  ADMINS_DEV: process.env.ADMINS_DEV || '',
  ARTICLE_DEV: process.env.ARTICLE_DEV || '',
  SEO_DEV: process.env.SEO_DEV || '',
  MATCH_DEV: process.env.MATCH_DEV || '',
  HELP_DEV: process.env.HELP_DEV || '',
  GLOBAL_WIDGET_DEV: process.env.GLOBAL_WIDGET_DEV || '',
  CAREER_DEV: process.env.CAREER_DEV || '',
  MIGRATIONS_DEV: process.env.MIGRATIONS_DEV || '',

  ENTITY_SPORT_BASE_URL: process.env.ENTITY_SPORT_BASE_URL || '',
  BASE_SITEMAP: process.env.BASE_SITEMAP || 'sitemap',
  POST_SITEMAP: process.env.POST_SITEMAP || 'news-archive',
  CATEGORY_SITEMAP: process.env.CATEGORY_SITEMAP || 'category',
  POST_TAG_SITEMAP: process.env.POST_TAG_SITEMAP || 'post-tag',
  AUTHOR_SITEMAP: process.env.AUTHOR_SITEMAP || 'authors',
  PLAYER_SITEMAP: process.env.PLAYER_SITEMAP || 'cricket-players',
  TEAM_SITEMAP: process.env.TEAM_SITEMAP || 'cricket-teams',
  VENUE_SITEMAP: process.env.VENUE_SITEMAP || 'cricket-venues',
  MATCH_SITEMAP: process.env.MATCH_SITEMAP || 'live-match',
  CAREER_SITEMAP: process.env.CAREER_SITEMAP || 'careers',
  PAGE_SITEMAP: process.env.PAGE_SITEMAP || 'pages',
  NEWS_SITEMAP: process.env.NEWS_SITEMAP || 'news-sitemap',
  SITEMAP_REDIS_KEY: process.env.SITEMAP_REDIS_KEY || 'sitemap',
  AWS_ACCESSKEYID: process.env.AWS_ACCESSKEYID || 'AKIAVEG4UMFNJUU4K6N5',
  AWS_SECRETKEY: process.env.AWS_SECRETKEY || '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',
  AWS_REGION: process.env.AWS_REGION || 'ap-south-1',
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'crictracker-admin-panel',
  S3_BUCKET_URL: process.env.S3_BUCKET_URL || 'https://crictracker-admin-panel.s3.ap-south-1.amazonaws.com/',
  S3_CDN_URL: process.env.S3_CDN_URL || 'https://media.crictracker.com/',
  S3_BUCKET_LIVE_URL: process.env.S3_BUCKET_LIVE_URL || 'https://media.crictracker.com.s3.ap-south-1.amazonaws.com/',
  S3_BUCKET_ARTICLE_FEATUREIMAGE_PATH: process.env.S3_BUCKET_ARTICLE_FEATUREIMAGE_PATH || 'media/featureimage',
  S3_BUCKET_ARTICLE_ATTACHMENTIMAGE_PATH: process.env.S3_BUCKET_ARTICLE_ATTACHMENTIMAGE_PATH || 'media/attachments',
  S3_BUCKET_FB_PATH: process.env.S3_BUCKET_FB_PATH || 'fb',
  S3_BUCKET_TWITTER_PATH: process.env.S3_BUCKET_TWITTER_PATH || 'twitter',
  S3_BUCKET_TEAM_THUMB_URL_PATH: process.env.S3_BUCKET_TEAM_THUMB_URL_PATH || 'teams',
  CREATE_TAG_ARTICLE: process.env.CREATE_TAG_ARTICLE || '0',
  FRONTEND_URL: process.env.FRONTEND_URL || 'https://www.crictracker.com',
  KEEP_ALIVE_TIMEOUT: process.env.KEEP_ALIVE_TIMEOUT || 65000

}

const stag = {
  PORT: process.env.PORT || 1337,
  MATCHMANAGEMENT_DB_URL: process.env.MATCHMANAGEMENT_DB_URL || 'your DB url',
  SEO_DB_URL: process.env.SEO_DB_URL || 'mongodb://localhost:27017/crictracker-seo-dev',
  MIGRATION_DB_URL: process.env.MIGRATION_DB_URL || 'mongodb://localhost:27017/crictracker-migration',
  ARTICLE_DB_URL: process.env.ARTICLE_DB_URL || 'mongodb://localhost:27017/crictracker-migration',
  AUTHENTICATION_DB_URL: process.env.AUTHENTICATION_DB_URL || 'mongodb://localhost:27017/crictracker-migration',
  CAREER_DB_URL: process.env.CAREER_DB_URL || 'mongodb://localhost:27017/crictracker-career-dev',
  GLOBAL_WIDGET_DB_URL: process.env.GLOBAL_WIDGET_DB_URL || 'mongodb://localhost:27017/crictracker-widget-dev',
  SENTRY_DSN: process.env.SENTRY_DSN,
  SQL_HOST: process.env.SQL_HOST || 'localhost',
  SQL_PORT: process.env.SQL_PORT || '3306',
  SQL_DATABASE: process.env.SQL_DATABASE || 'admin',
  SQL_USER: process.env.SQL_USER || 'root',
  SQL_PASSWORD: process.env.SQL_PASSWORD || '',
  JWT_SECRET: process.env.JWT_SECRET || 'crictracker',
  BASE_SITEMAP: process.env.BASE_SITEMAP || 'sitemap',
  POST_SITEMAP: process.env.POST_SITEMAP || 'post-sitemap',
  CAREER_SITEMAP: process.env.CAREER_SITEMAP || 'career-sitemap',
  CATEGORY_SITEMAP: process.env.CATEGORY_SITEMAP || 'category-sitemap',
  POST_TAG_SITEMAP: process.env.POST_TAG_SITEMAP || 'post_tag-sitemap',
  AUTHOR_SITEMAP: process.env.AUTHOR_SITEMAP || 'author-sitemap',
  PAGE_SITEMAP: process.env.PAGE_SITEMAP || 'page-sitemap',
  FANTASY_ARTICLE_SITEMAP: process.env.FANTASY_ARTICLE_SITEMAP || 'fantasy-article-sitemap',

  ENTITY_SPORT_TOKEN: process.env.ENTITY_SPORT_TOKEN || 'your token',
  SITEMAP_REDIS_KEY: process.env.SITEMAP_REDIS_KEY || 'sitemap',
  MATCH_SITEMAP: process.env.MATCH_SITEMAP || 'live-match',
  AWS_ACCESSKEYID: process.env.AWS_ACCESSKEYID || 'AKIAVEG4UMFNJUU4K6N5',
  AWS_SECRETKEY: process.env.AWS_SECRETKEY || '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',
  AWS_REGION: process.env.AWS_REGION || 'ap-south-1',
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'crictracker-admin-panel',
  S3_BUCKET_URL: process.env.S3_BUCKET_URL || 'https://crictracker-admin-panel.s3.ap-south-1.amazonaws.com/',
  S3_CDN_URL: process.env.S3_CDN_URL || 'https://media.crictracker.com/',
  S3_BUCKET_LIVE_URL: process.env.S3_BUCKET_LIVE_URL || 'https://media.crictracker.com.s3.ap-south-1.amazonaws.com/',
  S3_BUCKET_ARTICLE_FEATUREIMAGE_PATH: process.env.S3_BUCKET_ARTICLE_FEATUREIMAGE_PATH || 'media/featureimage',
  S3_BUCKET_FB_PATH: process.env.S3_BUCKET_FB_PATH || 'fb/',
  S3_BUCKET_TWITTER_PATH: process.env.S3_BUCKET_TWITTER_PATH || 'twitter/',
  CREATE_TAG_ARTICLE: process.env.CREATE_TAG_ARTICLE || '0',
  KEEP_ALIVE_TIMEOUT: process.env.KEEP_ALIVE_TIMEOUT || 65000
}

const prod = {
  PORT: process.env.PORT || 1337,
  MATCHMANAGEMENT_DB_URL: process.env.MATCHMANAGEMENT_DB_URL || 'your DB url',
  SEO_DB_URL: process.env.SEO_DB_URL || 'mongodb://localhost:27017/crictracker-seo-dev',
  MIGRATION_DB_URL: process.env.MIGRATION_DB_URL || 'mongodb://localhost:27017/crictracker-migration',
  ARTICLE_DB_URL: process.env.ARTICLE_DB_URL || 'mongodb://localhost:27017/crictracker-migration',
  AUTHENTICATION_DB_URL: process.env.AUTHENTICATION_DB_URL || 'mongodb://localhost:27017/crictracker-migration',
  CAREER_DB_URL: process.env.CAREER_DB_URL || 'mongodb://localhost:27017/crictracker-career-dev',
  GLOBAL_WIDGET_DB_URL: process.env.GLOBAL_WIDGET_DB_URL || 'mongodb://localhost:27017/crictracker-widget-dev',
  SENTRY_DSN: process.env.SENTRY_DSN,
  SQL_HOST: process.env.SQL_HOST || 'localhost',
  SQL_PORT: process.env.SQL_PORT || '3306',
  SQL_DATABASE: process.env.SQL_DATABASE || 'admin',
  SQL_USER: process.env.SQL_USER || 'root',
  SQL_PASSWORD: process.env.SQL_PASSWORD || '',
  JWT_SECRET: process.env.JWT_SECRET || 'crictracker',
  BASE_SITEMAP: process.env.BASE_SITEMAP || 'sitemap',
  POST_SITEMAP: process.env.POST_SITEMAP || 'post-sitemap',
  CAREER_SITEMAP: process.env.CAREER_SITEMAP || 'career-sitemap',
  CATEGORY_SITEMAP: process.env.CATEGORY_SITEMAP || 'category-sitemap',
  POST_TAG_SITEMAP: process.env.POST_TAG_SITEMAP || 'post_tag-sitemap',
  FANTASY_ARTICLE_SITEMAP: process.env.FANTASY_ARTICLE_SITEMAP || 'fantasy-article-sitemap',
  AUTHOR_SITEMAP: process.env.AUTHOR_SITEMAP || 'author-sitemap',
  PAGE_SITEMAP: process.env.PAGE_SITEMAP || 'page-sitemap',
  SITEMAP_REDIS_KEY: process.env.SITEMAP_REDIS_KEY || 'sitemap',
  MATCH_SITEMAP: process.env.MATCH_SITEMAP || 'live-match',
  AWS_ACCESSKEYID: process.env.AWS_ACCESSKEYID || 'AKIAVEG4UMFNJUU4K6N5',
  AWS_SECRETKEY: process.env.AWS_SECRETKEY || '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',
  AWS_REGION: process.env.AWS_REGION || 'ap-south-1',
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'crictracker-admin-panel',
  S3_BUCKET_URL: process.env.S3_BUCKET_URL || 'https://crictracker-admin-panel.s3.ap-south-1.amazonaws.com/',
  S3_CDN_URL: process.env.S3_CDN_URL || 'https://media.crictracker.com/',
  S3_BUCKET_LIVE_URL: process.env.S3_BUCKET_LIVE_URL || 'https://media.crictracker.com.s3.ap-south-1.amazonaws.com/',
  S3_BUCKET_ARTICLE_FEATUREIMAGE_PATH: process.env.S3_BUCKET_ARTICLE_FEATUREIMAGE_PATH || 'media/featureimage',
  S3_BUCKET_FB_PATH: process.env.S3_BUCKET_FB_PATH || 'fb/',
  S3_BUCKET_TWITTER_PATH: process.env.S3_BUCKET_TWITTER_PATH || 'twitter/',
  TEAM_SITEMAP: process.env.TEAM_SITEMAP || 'cricket-teams',
  VENUE_SITEMAP: process.env.VENUE_SITEMAP || 'cricket-venues',
  PLAYER_SITEMAP: process.env.PLAYER_SITEMAP || 'cricket-players',
  NEWS_SITEMAP: process.env.NEWS_SITEMAP || 'news-sitemap',
  S3_BUCKET_ARTICLE_ATTACHMENTIMAGE_PATH: process.env.S3_BUCKET_ARTICLE_ATTACHMENTIMAGE_PATH || 'media/attachments',
  S3_BUCKET_TEAM_THUMB_URL_PATH: process.env.S3_BUCKET_TEAM_THUMB_URL_PATH || 'teams',
  CREATE_TAG_ARTICLE: process.env.CREATE_TAG_ARTICLE || '0',
  KEEP_ALIVE_TIMEOUT: process.env.KEEP_ALIVE_TIMEOUT || 65000
}

const development = {
  PORT: process.env.PORT || 1337,
  MATCHMANAGEMENT_DB_URL: process.env.MATCHMANAGEMENT_DB_URL || 'your DB url',
  SEO_DB_URL: process.env.SEO_DB_URL || 'mongodb://localhost:27017/crictracker-seo-dev',
  MIGRATION_DB_URL: process.env.MIGRATION_DB_URL || 'mongodb://localhost:27017/crictracker-migration',
  ARTICLE_DB_URL: process.env.ARTICLE_DB_URL || 'mongodb://localhost:27017/crictracker-migration',
  AUTHENTICATION_DB_URL: process.env.AUTHENTICATION_DB_URL || 'mongodb://localhost:27017/crictracker-migration',
  CAREER_DB_URL: process.env.CAREER_DB_URL || 'mongodb://localhost:27017/crictracker-career-dev',
  GLOBAL_WIDGET_DB_URL: process.env.GLOBAL_WIDGET_DB_URL || 'mongodb://localhost:27017/crictracker-widget-dev',
  SENTRY_DSN: process.env.SENTRY_DSN,
  SQL_HOST: process.env.SQL_HOST || 'localhost',
  SQL_PORT: process.env.SQL_PORT || '3306',
  SQL_DATABASE: process.env.SQL_DATABASE || 'admin',
  CAREER_SITEMAP: process.env.CAREER_SITEMAP || 'career-sitemap',
  SQL_USER: process.env.SQL_USER || 'root',
  SQL_PASSWORD: process.env.SQL_PASSWORD || '',
  JWT_SECRET: process.env.JWT_SECRET || 'crictracker',
  BASE_SITEMAP: process.env.BASE_SITEMAP || 'sitemap',
  POST_SITEMAP: process.env.POST_SITEMAP || 'post-sitemap',
  FANTASY_ARTICLE_SITEMAP: process.env.FANTASY_ARTICLE_SITEMAP || 'fantasy-article-sitemap',
  PAGE_SITEMAP: process.env.PAGE_SITEMAP || 'page-sitemap',
  CATEGORY_SITEMAP: process.env.CATEGORY_SITEMAP || 'category-sitemap',
  POST_TAG_SITEMAP: process.env.POST_TAG_SITEMAP || 'post_tag-sitemap',
  AUTHOR_SITEMAP: process.env.AUTHOR_SITEMAP || 'author-sitemap',
  SITEMAP_REDIS_KEY: process.env.SITEMAP_REDIS_KEY || 'sitemap',
  MATCH_SITEMAP: process.env.MATCH_SITEMAP || 'live-match',
  AWS_ACCESSKEYID: process.env.AWS_ACCESSKEYID || 'AKIAVEG4UMFNJUU4K6N5',
  AWS_SECRETKEY: process.env.AWS_SECRETKEY || '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',
  AWS_REGION: process.env.AWS_REGION || 'ap-south-1',
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'crictracker-admin-panel',
  S3_BUCKET_URL: process.env.S3_BUCKET_URL || 'https://crictracker-admin-panel.s3.ap-south-1.amazonaws.com/',
  S3_CDN_URL: process.env.S3_CDN_URL || 'https://media.crictracker.com/',
  S3_BUCKET_LIVE_URL: process.env.S3_BUCKET_LIVE_URL || 'https://media.crictracker.com.s3.ap-south-1.amazonaws.com/',
  S3_BUCKET_ARTICLE_FEATUREIMAGE_PATH: process.env.S3_BUCKET_ARTICLE_FEATUREIMAGE_PATH || 'media/featureimage',
  S3_BUCKET_FB_PATH: process.env.S3_BUCKET_FB_PATH || 'fb/',
  S3_BUCKET_TWITTER_PATH: process.env.S3_BUCKET_TWITTER_PATH || 'twitter/',
  S3_BUCKET_TEAM_THUMB_URL_PATH: process.env.S3_BUCKET_TEAM_THUMB_URL_PATH || 'teams',
  CREATE_TAG_ARTICLE: process.env.CREATE_TAG_ARTICLE || '0',
  KEEP_ALIVE_TIMEOUT: process.env.KEEP_ALIVE_TIMEOUT || 65000
}

if (ENV === 'prod') {
  module.exports = prod
} else if (ENV === 'development') {
  module.exports = development
} else if (ENV === 'stag') {
  module.exports = stag
} else {
  module.exports = dev
}

console.log(`Server Env is ${ENV}`)
