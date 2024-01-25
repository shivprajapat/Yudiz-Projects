require('dotenv').config()
const ENV = process.env.NODE_ENV
console.log(ENV)
const dev = {
  PORT: process.env.PORT || 4004,
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/crictracker-match-dev',
  SENTRY_DSN: process.env.SENTRY_DSN || 'https://66ecc6572c134e1d9ec724c991dea023@o992135.ingest.sentry.io/6073525',
  APOLLO_KEY: process.env.APOLLO_KEY || 'service:crictracker-dev-urewc:8_PU_fvkKRami-F_ausnyg',
  APOLLO_GRAPH_REF: process.env.APOLLO_GRAPH_REF || 'current',
  APOLLO_GATEWAY_URL: process.env.APOLLO_GATEWAY_URL || 'https://gateway.crictracker.com',
  APOLLO_GRAPH_VARIANT: process.env.APOLLO_GRAPH_VARIANT || 'current',
  seoGrpcUrl: process.env.SEO_GRPC_URL || 'localhost:3003',
  authGrpcUrl: process.env.AUTH_GRPC_URL || '0.0.0.0:3001',
  globalWidgetGrpcUrl: process.env.GLOBAL_WIDGET_GRPC_URL || 'localhost:3006'
}

const prod = {
  PORT: process.env.PORT || 4004,
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/crictracker-match-stag',
  SENTRY_DSN: process.env.SENTRY_DSN || 'https://66ecc6572c134e1d9ec724c991dea023@o992135.ingest.sentry.io/6073525',
  APOLLO_KEY: process.env.APOLLO_KEY || 'service:crictracker-dev-urewc:8_PU_fvkKRami-F_ausnyg',
  APOLLO_GRAPH_REF: process.env.APOLLO_GRAPH_REF || 'current',
  APOLLO_GATEWAY_URL: process.env.APOLLO_GATEWAY_URL || 'https://gateway.crictracker.com/graphql',
  APOLLO_GRAPH_VARIANT: process.env.APOLLO_GRAPH_VARIANT || 'current',
  seoGrpcUrl: process.env.SEO_GRPC_URL || 'crictracker-seo-prod-grpc.production.svc.cluster.local:80',
  authGrpcUrl: process.env.AUTH_GRPC_URL || 'crictracker-authentication-prod-grpc.production.svc.cluster.local:80',
  globalWidgetGrpcUrl: process.env.GLOBAL_WIDGET_GRPC_URL || 'localhost:3006'
}

const test = {
  PORT: process.env.PORT || 4004,
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/crictracker-match-test',
  SENTRY_DSN: process.env.SENTRY_DSN || 'https://66ecc6572c134e1d9ec724c991dea023@o992135.ingest.sentry.io/6073525',
  APOLLO_KEY: process.env.APOLLO_KEY || 'service:crictracker-dev-urewc:8_PU_fvkKRami-F_ausnyg',
  APOLLO_GRAPH_REF: process.env.APOLLO_GRAPH_REF || 'current',
  APOLLO_GATEWAY_URL: process.env.APOLLO_GATEWAY_URL || 'http://localhost:4000',
  APOLLO_GRAPH_VARIANT: process.env.APOLLO_GRAPH_VARIANT || 'current',
  seoGrpcUrl: process.env.SEO_GRPC_URL || 'localhost:3003',
  authGrpcUrl: process.env.AUTH_GRPC_URL || '0.0.0.0:3001',
  globalWidgetGrpcUrl: process.env.GLOBAL_WIDGET_GRPC_URL || 'localhost:3006'
}

if (ENV === 'prod') {
  console.log(`DB URL of ${ENV} MODE IS ${prod.DB_URL}`)
  module.exports = prod
} else if (ENV === 'test') {
  console.log(`DB URL of ${ENV} MODE IS ${test.DB_URL}`)
  module.exports = test
} else {
  console.log(`DB URL of ${ENV} MODE IS ${dev.DB_URL}`)
  module.exports = dev
}
