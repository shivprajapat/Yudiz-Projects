require('dotenv').config()
const ENV = process.env.NODE_ENV
console.log(ENV)
const dev = {
  PORT: process.env.PORT || 4004,
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/crictracker-match-dev',
  SENTRY_DSN: process.env.SENTRY_DSN || 'https://66ecc6572c134e1d9ec724c991dea023@o992135.ingest.sentry.io/6073525',
  ENTITY_SPORT_BASE_URL: process.env.ENTITY_SPORT_BASE_URL || 'https://rest.entitysport.com/v2',
  ENTITY_SPORT_TOKEN: process.env.ENTITY_SPORT_TOKEN || 'd63f2f01c116136d404f0c2d3a69a53c',
  SEO_SUBGRAPH_URL: process.env.SEO_SUBGRAPH_URL || 'http://localhost:4003',
  ARTICLE_SUBGRAPH_URL: process.env.ARTICLE_SUBGRAPH_URL || 'http://localhost:4002',
  APOLLO_KEY: process.env.APOLLO_KEY || 'service:SportsBuzz-dev:iZ7Z4LUVPzbu99XK3-Mquw',
  APOLLO_GRAPH_REF: process.env.APOLLO_GRAPH_REF || 'current',
  APOLLO_GATEWAY_URL: process.env.APOLLO_GATEWAY_URL || 'https://gateway-dev.sportsbuzzweb.com/graphql',
  APOLLO_GRAPH_VARIANT: process.env.APOLLO_GRAPH_VARIANT || 'current'
}

const prod = {
  PORT: process.env.PORT || 4004,
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/crictracker-match-stag',
  SENTRY_DSN: process.env.SENTRY_DSN || 'https://66ecc6572c134e1d9ec724c991dea023@o992135.ingest.sentry.io/6073525',
  ENTITY_SPORT_BASE_URL: process.env.ENTITY_SPORT_BASE_URL || 'https://rest.entitysport.com/v2',
  ENTITY_SPORT_TOKEN: process.env.ENTITY_SPORT_TOKEN || 'd63f2f01c116136d404f0c2d3a69a53c',
  APOLLO_KEY: process.env.APOLLO_KEY || 'service:SportsBuzz-dev:iZ7Z4LUVPzbu99XK3-Mquw',
  APOLLO_GRAPH_REF: process.env.APOLLO_GRAPH_REF || 'current',
  APOLLO_GATEWAY_URL: process.env.APOLLO_GATEWAY_URL || 'https://gateway-dev.sportsbuzzweb.com/graphql',
  APOLLO_GRAPH_VARIANT: process.env.APOLLO_GRAPH_VARIANT || 'current'
}

const test = {
  PORT: process.env.PORT || 4004,
  DB_URL: process.env.DB_URL || 'mongodb://localhost:27017/crictracker-match-test',
  SENTRY_DSN: process.env.SENTRY_DSN || 'https://66ecc6572c134e1d9ec724c991dea023@o992135.ingest.sentry.io/6073525',
  ENTITY_SPORT_BASE_URL: process.env.ENTITY_SPORT_BASE_URL || 'https://rest.entitysport.com/v2',
  ENTITY_SPORT_TOKEN: process.env.ENTITY_SPORT_TOKEN || 'd63f2f01c116136d404f0c2d3a69a53c',
  APOLLO_KEY: process.env.APOLLO_KEY || 'service:SportsBuzz-dev:iZ7Z4LUVPzbu99XK3-Mquw',
  APOLLO_GRAPH_REF: process.env.APOLLO_GRAPH_REF || 'current',
  APOLLO_GATEWAY_URL: process.env.APOLLO_GATEWAY_URL || 'https://gateway-dev.sportsbuzzweb.com/graphql',
  APOLLO_GRAPH_VARIANT: process.env.APOLLO_GRAPH_VARIANT || 'current'
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
