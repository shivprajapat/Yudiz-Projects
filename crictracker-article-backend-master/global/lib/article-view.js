const { redisclient } = require('../../app/utils/lib/redis')
const { IP_EXPIRE_SEC } = require('../../config')

/**
 *Same user browsing same article expiration time
*/
const ipExpireSec = IP_EXPIRE_SEC

const articleViews = async (article, ip) => {
  try {
    const id = article._id

    // First of all, judge that ipexpiresec = 300 seconds, the same IP access multiple times, only as one visit
    const ipLimit = await ipViewLimit(id, ip)

    const key = 'article:' + article._id + ':views'
    // When an IP accesses the post for the first time in 300 seconds, refresh the page views of the article
    if (ipLimit) await redisclient.hincrby('articles', key, 1)
  } catch (error) {
    console.log(error)
  }
}

/**
 *In a period of time, restrict the same IP access to prevent the increase of invalid browsing times
    * @param id
    * @param ip
    * @return bool
    */
async function ipViewLimit(id, ip) {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        // ip = '1.1.1.6';
        // In redis, the key value segmentation is done with: which can be understood
        const ipArticleViewKey = 'article:ip:limit:' + id
        // The redis sismember checks whether the key exists in the set type, the time complexity of the instruction is O (1), and the value of the set type is unique
        const existsInRedisSet = await redisclient.sismember(ipArticleViewKey, ip)

        if (!existsInRedisSet) {
          // Sadd, set type instruction, adds a value IP to the ipArticleviewkey
          await redisclient.sadd(ipArticleViewKey, ip)
          // And set the lifetime of the key, here set 300 seconds, after 300 seconds, the same IP access will be regarded as a new view
          await redisclient.expire(ipArticleViewKey, ipExpireSec)
          return resolve(1)
        }
        return resolve(0)
      } catch (error) {
        reject(error)
      }
    })()
  })
}

module.exports = { articleViews }
