// @ts-check
const driver = require('./database/neo4j_driver')
const { redisClient } = require('./helpers/redis')

const contactSyncNodeNew = async () => {
  const session = driver.session()
  try {
    const currentCount = await redisClient.hget('contact-sync:newHash', 'countNew') || 0
    await redisClient.hset('contact-sync:newHash', 'countNew', Number(currentCount))

    const strNew = await redisClient.lindex('contact-sync:new', 0)

    if (!strNew) {
      return
    }
    const iCurrentUserId = strNew.slice(0, 24)
    const data = JSON.parse(strNew.slice(24))

    for (let i = Number(currentCount); i < data.length; i++) {
      const graphQueryParams = { iCurrentUserId, newUserId: data[i]._id }
      await session.run('match(iCurrentUserId:User{id:$iCurrentUserId}) merge (iCurrentUserId)-[:CONNECTED]->(:User{id:$newUserId})', graphQueryParams)
      await redisClient.hincrby('contact-sync:newHash', 'countNew', 1)
    }
    await redisClient.lpop('contact-sync:new')
    await redisClient.hset('contact-sync:newHash', 'countNew', 0)
  } catch (error) {
    return error
  } finally {
    setTimeout(contactSyncNodeNew, 2000)
    await session.close()
  }
}

const contactSyncNodeExists = async () => {
  const session = driver.session()
  try {
    const currentCount = await redisClient.hget('contact-sync:existsHash', 'countExists') || 0
    await redisClient.hset('contact-sync:existsHash', 'countExists', Number(currentCount))

    const strExists = await redisClient.lindex('contact-sync:exists', 0)

    if (!strExists) {
      return
    }

    const iCurrentUserId = strExists.slice(0, 24)
    const data = JSON.parse(strExists.slice(24))

    for (let i = Number(currentCount); i < data.length; i++) {
      const graphQueryParams = { iCurrentUserId, newUserId: data[i]._id }
      await session.run('match (u:User{id:$iCurrentUserId}), (e:User{id:$newUserId}) merge (u)-[:CONNECTED]->(e)', graphQueryParams)
      await redisClient.hincrby('contact-sync:existsHash', 'countExists', 1)
    }
    await redisClient.hset('contact-sync:existsHash', 'countExists', 0)
    await redisClient.lpop('contact-sync:exists')
  } catch (error) {
    return console.log(error)
  } finally {
    setTimeout(contactSyncNodeExists, 2000)
    await session.close()
  }
}

// const addDataToElasticSearch = async () => {
//   try {
//     // await deleteAllData("autosuggest_index")
//     const categoryList = await CategoryModel.find({}, { sName: 1, eStatus: 1, id: '$_id', _id: 0 })
//     console.log('categoryList', categoryList)

//     const response = await bulkAddData({ indexName: 'autosuggest_index', documents: JSON.parse(JSON.stringify(categoryList)) })
//     console.log('response', response)
//   } catch (error) {
//     console.log('error', error)
//   }
// }

module.exports = {
  contactSyncNodeNew,
  contactSyncNodeExists
}
