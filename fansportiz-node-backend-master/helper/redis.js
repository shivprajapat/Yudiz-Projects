const fs = require('fs')
const Redis = require('ioredis')
const config = require('../config/config')
const jwt = require('jsonwebtoken')

const { handleCatchError } = require('./utilities.services')
const sanitizeHtml = require('sanitize-html')

const redisClient = new Redis({
  host: config.REDIS_HOST,
  port: config.REDIS_PORT,
  password: config.REDIS_PASSWORD
})

const redisClient2 = new Redis({
  host: config.REDIS_2_HOST,
  port: config.REDIS_2_PORT,
  password: config.REDIS_PASSWORD
})

redisClient.on('error', function (error) {
  console.log('Error in Redis', error)
  handleCatchError(error)
  process.exit(1)
})

redisClient2.on('error', function (error) {
  console.log('Error in Redis2', error)
  handleCatchError(error)
  process.exit(1)
})

redisClient.on('connect', function () {
  console.log('redis connected')
})

redisClient2.on('connect', function () {
  console.log('redis2 connected')
  checkScriptExists('lb.lua', '5b9a4657e92b7ce3a7abe5cbb7441730454eda5e')
  checkScriptExists('getMyTeams.lua', '5111ebb3688a5c52bd02c6df453b42710ede8f94')
  checkScriptExists('updateLb.lua', 'f88598c5398832fdb4bfc609562d1cb3f6eae0e0')
})

// const Stampede = require('cache-stampede').redis(redisClient, { retryDelay: 1000, maxRetries: 25 })

const checkScriptExists = async function (scriptName, hash) {
  try {
    const data = await redisClient2.send_command('SCRIPT', ['EXISTS', hash])
    if (!data[0]) {
      const script = fs.readFileSync(`luaScripts/${scriptName}`, 'utf8')
      const loadScript = await redisClient2.send_command('SCRIPT', ['LOAD', script])
      console.log({ loadScript, scriptName })
    }
  } catch (error) {
    handleCatchError(error)
  }
}
module.exports = {
  cacheRoute: function (duration) {
    return async (req, res, next) => {
      const key = '__express__' + sanitizeHtml(req.originalUrl || req.url)
      if (process.env.NODE_ENV === 'dev') return next()
      const cachedBody = await redisClient.get(key)
      if (cachedBody) {
        res.setHeader('is-cache', 1)
        res.setHeader('content-type', 'application/json')
        res.status(JSON.parse(cachedBody)?.status || 200)
        return res.send(cachedBody)
      } else {
        res.sendResponse = res.send
        res.send = (body) => {
          redisClient.set(key, body, 'EX', duration)
          res.setHeader('content-type', 'application/json')
          res.sendResponse(body)
        }
        next()
      }
    }
  },

  cacheHTMLRoute: function (duration) {
    return async (req, res, next) => {
      const key = '__express__' + sanitizeHtml(req.originalUrl || req.url)
      // if (process.env.NODE_ENV === 'dev') return next()
      const cachedBody = await redisClient.get(key)
      if (cachedBody) {
        res.setHeader('is-cache', 1)
        res.setHeader('Content-type', 'text/html')
        return res.send(cachedBody)
      } else {
        res.sendResponse = res.send
        res.send = (body) => {
          redisClient.set(key, body, 'EX', duration)
          res.setHeader('Content-type', 'text/html')
          res.sendResponse(body)
        }
        next()
      }
    }
  },
  // cacheRoute: function (duration) {
  //   return async (req, res, next) => {
  //     const key = '__express__' + req.originalUrl || req.url
  //     if (process.env.NODE_ENV === 'dev') return next()
  //     try {
  //       const data = await Stampede.get(key)
  //       res.sendResponse = res.send
  //       res.setHeader('is-cache', 1)
  //       res.setHeader('content-type', 'application/json')
  //       return res.send(data.data)
  //     } catch (error) {
  //       try {
  //         Stampede.cached(key, () => {
  //           return new Promise((resolve, reject) => {
  //             try {
  //               res.sendResponse = res.send
  //               res.send = (body) => {
  //                 res.setHeader('content-type', 'application/json')
  //                 res.sendResponse(body)
  //                 return resolve(body)
  //               }
  //             } catch (error) {
  //               handleCatchError(error)
  //               return reject(error)
  //             }
  //           })
  //         }, { expiry: duration * 1000 })
  //         next()
  //       } catch (error) {
  //         console.log('error', error)
  //         return catchError('cacheRoute', error, req, res)
  //       }
  //     }
  //   }
  // },

  checkRateLimitOTP: function (sLogin, sType, sAuth) {
    return new Promise((resolve, reject) => {
      if (process.env.NODE_ENV === 'dev') resolve()
      if (!config.THRESHOLD_RATE_LIMIT) resolve()
      if (!sLogin || !sType || !sAuth) resolve()
      redisClient.incr(`rlotp:${sLogin}:${sType}:${sAuth}:${(new Date()).getHours()}`).then(data => {
        if (data > config.THRESHOLD_RATE_LIMIT) {
          resolve('LIMIT_REACHED')
        } else {
          redisClient.expire(`rlotp:${sLogin}:${sType}:${sAuth}:${(new Date()).getHours()}`, 1800).then().catch()
          resolve()
        }
      }).catch(error => {
        handleCatchError(error)
        resolve()
      })
    })
  },

  // It will check only rate limit count if limit is reached returns 'LIMIT_REACHED'
  getRateLimitStatus: function (sLogin, sType, sAuth) {
    return new Promise((resolve, reject) => {
      if (process.env.NODE_ENV === 'dev') resolve()
      if (!sLogin || !sType || !sAuth) resolve()
      redisClient.get(`rlotp:${sLogin}:${sType}:${sAuth}:${(new Date()).getHours()}`).then(data => {
        if (data > 5) {
          return resolve('LIMIT_REACHED')
        }
        return resolve()
      }).catch(error => {
        handleCatchError(error)
        resolve()
      })
    })
  },
  //  It will check whether sent otp is expired or not
  getOTPExpiryStatus: function (sLogin, sType, sAuth) {
    return new Promise((resolve, reject) => {
      if (process.env.NODE_ENV === 'dev') resolve()
      if (!sLogin || !sType || !sAuth) resolve()
      redisClient.ttl(`rlotp:${sLogin}:${sType}:${sAuth}:${(new Date()).getHours()}`).then(data => {
        if (data <= 0) {
          return resolve('EXPIRED')
        }
        return resolve()
      }).catch(error => {
        handleCatchError(error)
        resolve()
      })
    })
  },
  checkTeamJoined: function (iUserId, iUserTeamId, iMatchLeagueId) {
    return new Promise((resolve, reject) => {
      // if (process.env.NODE_ENV === 'dev') return resolve()
      if (!iUserId || !iUserTeamId) return resolve()
      redisClient.incr(`join:${iUserId}:${iUserTeamId}:${iMatchLeagueId}`).then(data => {
        if (data > 1) {
          return resolve('EXIST')
        } else {
          redisClient.expire(`join:${iUserId}:${iUserTeamId}:${iMatchLeagueId}`, 5).then().catch()
          return resolve()
        }
      }).catch(error => {
        handleCatchError(error)
        return resolve()
      })
    })
  },

  bulkQueuePush: async function (queueName, aData, limit) {
    const aStringData = aData.map(d => JSON.stringify(d))

    while (aStringData.length) {
      await redisClient.rpush(queueName, ...aStringData.splice(0, limit))
    }
  },

  checkProcessed: function (sKey, nExpire = 15) {
    return new Promise((resolve, reject) => {
      // if (process.env.NODE_ENV === 'dev') return resolve()
      if (!sKey) return resolve()
      redisClient.incr(sKey).then(data => {
        if (data > 1) {
          return resolve('EXIST')
        } else {
          redisClient.expire(sKey, nExpire).then().catch()
          return resolve()
        }
      }).catch(error => {
        handleCatchError(error)
        return resolve()
      })
    })
  },

  checkRateLimit: async function (threshold, path, ip) {
    // return async function (req, res, next) {
    try {
      // if (process.env.NODE_ENV === 'dev') return
      if (!config.THRESHOLD_RATE_LIMIT) return
      const ipLimit = await redisClient.incr(`${path}:${ip}`)

      if (ipLimit > threshold) {
        // return res.status(status.TooManyRequest).jsonp({ status: jsonStatus.TooManyRequest, message: messages[req.userLanguage].limit_reached.replace('##', messages[req.userLanguage].request) })
        return 'LIMIT_REACHED'
      } else {
        const ttl = await redisClient.ttl(`${path}:${ip}`)
        if (ttl === -1) {
          await redisClient.expire(`${path}:${ip}`, 1800)
        }
        // return next()
        return
      }
    } catch (error) {
      handleCatchError(error)
      // return next()
    }
    // }
  },
  addMember: function (memberName, data, ttl) {
    return new Promise((resolve, reject) => {
      (async () => {
        await Promise.all([
          redisClient.sadd(`UserTeam:${memberName}`, data),
          redisClient.expire(`UserTeam:${memberName}`, ttl)
        ])
        return resolve()
      })()
    })
  },

  removeMember: function (memberName, data) {
    return new Promise((resolve, reject) => {
      (async () => {
        await Promise.all([
          redisClient.srem(`UserTeam:${memberName}`, data)
        ])
        return resolve()
      })()
    })
  },

  checkTeamExist: function (memberName, member) {
    return new Promise((resolve, reject) => {
      (async () => {
        const checkLen = await redisClient.scard(`UserTeam:${memberName}`)
        if (checkLen > 121) return resolve('LENGTH_EXCEED') // total captain and viceCaptain switch possibilities is 11^2 = 121
        const bExists = await redisClient.sismember(`UserTeam:${memberName}`, member)
        if (!bExists) return resolve()
        return resolve('EXIST')
      })()
    })
  },

  blackListToken: function (token) {
    try {
      const sBlackListKey = `BlackListToken:${token}`
      const tokenData = jwt.decode(token, { complete: true })
      const tokenExp = tokenData.payload.exp
      redisClient.setex(sBlackListKey, tokenExp, 0)
    } catch (error) {
      handleCatchError(error)
    }
  },

  queuePush: function (queueName, data) {
    return redisClient.rpush(queueName, JSON.stringify(data))
  },

  queuePop: function (queueName, data) {
    return redisClient.lpop(queueName)
  },

  bulkQueuePop: function (queueName, limit) {
    return redisClient.lpop(queueName, limit)
  },

  queueLen: function (queueName) {
    return redisClient.llen(queueName)
  },
  checkScriptExists,
  redisClient,
  redisClient2
}
