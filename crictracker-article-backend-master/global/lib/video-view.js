const { redisclient } = require('../../app/utils/lib/redis')
const { IP_EXPIRE_SEC } = require('../../config')

/**
 *Same user browsing same video expiration time
*/
const ipExpireSec = IP_EXPIRE_SEC

const videoViews = async (video, ip) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const id = video._id
        let oldCount = 0
        if (video.nViewCount) {
          oldCount = parseInt(video.nViewCount)
        }
        /* First of all, judge that ipexpiresec = 300 seconds, the same IP access multiple times, only as one visit */
        const ipLimit = await ipViewLimit(id, ip)

        const key = 'video:' + video._id + ':views'
        let redisViewCount = 0
        if (ipLimit) {
          // When an IP accesses the post for the first time in 300 seconds, refresh the page views of the video
          const videoViews = await redisclient.hincrby('videos', key, 1, function (error, reply) {
            if (error) reject(error)
            return reply
          })
          if (videoViews) {
            redisViewCount = videoViews
          }
          // For most view video set
          const updatedCount = parseInt(oldCount) + parseInt(redisViewCount)
          resolve(updatedCount)
        } else {
          const oldViews = await redisclient.hget('videos', key, function (error, reply) {
            if (error) reject(error)
            return reply
          })
          if (oldViews) {
            redisViewCount = oldViews
          }
          const updatedCount = parseInt(oldCount) + parseInt(redisViewCount)
          resolve(updatedCount)
        }
      } catch (error) {
        reject(error)
      }
    })()
  })
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
        const ipVideoViewKey = 'video:ip:limit:' + id

        // The redis sismember checks whether the key exists in the set type, the time complexity of the instruction is O (1), and the value of the set type is unique
        const existsInRedisSet = await redisclient.sismember(ipVideoViewKey, ip, function (error, reply) {
          if (error) reject(error)
          return reply
        })

        if (!existsInRedisSet) {
          // Sadd, set type instruction, adds a value IP to the ipVideoviewkey
          await redisclient.sadd(ipVideoViewKey, ip)
          // And set the lifetime of the key, here set 300 seconds, after 300 seconds, the same IP access will be regarded as a new view
          await redisclient.expire(ipVideoViewKey, ipExpireSec)
          resolve(1)
        }
        resolve(0)
      } catch (error) {
        reject(error)
      }
    })()
  })
}
module.exports = { videoViews }
