const neo4j = require('neo4j-driver')
const config = require('../config')

// connecting driver
const driver = neo4j.driver(config.DB_NEO4J_IP, neo4j.auth.basic(config.DB_NEO4J_USER_NAME, config.DB_NEO4J_PASSWORD))
driver.verifyConnectivity()
  .then(() => {
    console.log('Connected to neo4j')
  }).catch((err) => {
    console.log('Error in neo4j connection')
    throw err
  })

async function checkIndexExists ({ name, node }) {
  const session = driver.session()
  await session.run(
    `CREATE CONSTRAINT ${name} if not exists
    FOR (u:${node}) REQUIRE u.id IS UNIQUE`
  )
  session.close()
}
checkIndexExists({ name: 'user_id', node: 'User' })
checkIndexExists({ name: 'city_id', node: 'City' })
checkIndexExists({ name: 'profession_id', node: 'Profession' })
module.exports = driver
