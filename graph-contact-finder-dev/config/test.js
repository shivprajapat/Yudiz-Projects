const test = {
  PORT: process.env.PORT_NUMBER || 8080,
  NODE_ENV: process.env.NODE_ENV || 'Development',

  // Neo4j Config
  DB_NEO4J_PROTOCOL: process.env.DB_NEO4J_PROTOCOL || 'bolt',
  DB_NEO4J_IP: process.env.DB_NEO4J_IP || 'neo4j+s://38ab0f6a.databases.neo4j.io',
  DB_NEO4J_PORT: process.env.DB_NEO4J_PORT || 7687,
  DB_NEO4J_USER_NAME: process.env.DB_NEO4J_NAME || 'neo4j',
  DB_NEO4J_PASSWORD: process.env.DB_NEO4J_PASSWORD || 'root',

  // Mongodb Config
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/graphContact',
  MONGODB_ALLOW_DISK_USE: process.env.MONGODB_ALLOW_DISK_USE || false,

  // Elastic Search Config
  DB_ELASTIC_SEARCH_NODE: process.env.DB_ELASTIC_SEARCH_NODE || 'http://localhost:9200',

  // JWT Config
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'jghdif784fb4f48f7t48bhv984ygh4FUhsdfndfoieu94856u6g45o958yjggj50y9j',
  JWT_VALIDITY: process.env.JWT_VALIDITY || '60d',

  // Redis Config
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,

  // Login Config
  LOGIN_HARD_LIMIT: 5,
  LOGIN_HARD_LIMIT_ADMIN: 5,

  // mongo query cache time config
  CACHE_30_MIN: 1800,
  CACHE_1_HOUR: 3600,
  CACHE_5_HOUR: 18000,
  CACHE_1_DAY: 86400
}

module.exports = test
