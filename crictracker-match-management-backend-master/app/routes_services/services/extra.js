// const moment = require('moment')
// const { players: PlayersModel } = require('../../model')
const crypto = require('crypto')
const fs = require('fs')
const path = require('path')
const https = require('https')
const privateKey = fs.readFileSync(path.resolve(__dirname, './private_key_CricTracker_AMP.pem'), 'utf-8')
const { venues } = require('../../model/')
const opencage = require('opencage-api-client')

class MatchService {
  async updatePlayersBirthDate(req, res) {
    try {
      // const players = await PlayersModel.find({})
      // for (const player of players) {
      // const birthDate = moment(player.dDOB).format('YYYY-MM-DD')
      // console.log({ birthDate })
      // await PlayersModel.findOneAndUpdate({ _id: player._id }, { dDOB: birthDate })
      // }
      // return res.send({ status: 'ok' })
    } catch (error) {
      return res.send({ error })
    }
  }

  async ping(req, res) {
    return res.status(200).jsonp({ sStatus: 200, sMessage: 'ping' })
  }

  async addLongLat(req, res) {
    try {
      const aVenue = await venues.find({ _id: { $lte: '622d97e809a36f4f3cbac026' } }).sort({ _id: -1 })

      for (const oVenue of aVenue) {
        console.log(oVenue?._id)
        const data = await opencage.geocode({ q: oVenue?.sName })
        console.log({ data })
        if (data?.results[0]?.geometry?.lat && data?.results[0]?.geometry?.lng) {
          await venues.findByIdAndUpdate(oVenue?._id, { sLatitude: data?.results[0]?.geometry?.lat, sLongitude: data?.results[0]?.geometry?.lng })
          console.log(`completed venue id: ${oVenue?._id}`)
        } else {
          const locationData = await opencage.geocode({ q: oVenue?.sLocation })
          if (locationData?.results[0]?.geometry?.lat && locationData?.results[0]?.geometry?.lng) {
            await venues.findByIdAndUpdate(oVenue?._id, { sLatitude: locationData?.results[0]?.geometry?.lat, sLongitude: locationData?.results[0]?.geometry?.lng })
          } else {
            console.log(`missed venue in location id : ${oVenue?._id}`)
          }
          console.log(`missed venue id : ${oVenue?._id}`)
        }
      }
      console.log('done')
      return res.send('done')
    } catch (error) {
      console.log({ error })
      return res.send({ error })
    }
  }

  // async invalidateCache1(req, res) {
  //   const ampUrl = 'https://www.crictracker.com/cricket-live-feeds/kkr-vs-rr-live-score-updates-kolkata-knight-riders-vs-rajasthan-royals-live-updates/?amp=1' // Replace with your actual AMP URL with query parameters
  //   const privateKey = fs.readFileSync(path.resolve(__dirname, './private_key_CricTracker_AMP.pem'), 'utf-8')

  //   const { timestamp, signature } = generateSignature(ampUrl, privateKey)

  //   const parsedUrl = new URL(ampUrl)
  //   const encodedPathAndQuery = encodeURIComponent(parsedUrl.pathname + parsedUrl.search)
  //   const updateCacheUrl = `https://amp.googleapis.com/update-cache/c/s/${parsedUrl.hostname}${encodedPathAndQuery}&amp_action=flush&amp_ts=${timestamp}&amp_url_signature=${signature}`

  //   console.log({ updateCacheUrl })
  //   try {
  //     const response = await axios.get(updateCacheUrl)
  //     if (response.status === 200) {
  //       console.log('Cache invalidated successfully')
  //     } else {
  //       console.error('Error invalidating cache:', response.status, response.statusText)
  //     }
  //   } catch (error) {
  //     console.error('Error invalidating cache:', error.message)
  //   }
  // }

  async invalidateCache(url, privateKeyPath, callback) {
    const ampCacheDomain = 'cdn.ampproject.org'
    const encodedUrl = encodeURIComponent('www.crictracker.com/cricket-live-feeds/mi-vs-gt-live-score-updates-mumbai-indians-vs-gujarat-titans-live-updates/?amp=1')
    const timestamp = Math.floor(Date.now() / 1000)
    const signature = createSignature(encodedUrl, timestamp, privateKey)

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': 0
      }
    }

    const requestUrl = `https://${ampCacheDomain}/update-cache/c/s/${encodedUrl}?amp_action=flush&_ts=${timestamp}&_url_signature=${signature}`
    console.log({ requestUrl })
    const req = https.request(requestUrl, requestOptions, (res) => {
      if (res.statusCode === 200) {
        callback(null, 'Google AMP cache cleared successfully')
      } else {
        callback(new Error(`Error clearing Google AMP cache: ${res.statusCode}`))
      }
    })

    req.on('error', (error) => {
      callback(error)
    })

    req.end()
  }
}

function createSignature(url1, timestamp, privateKey) {
  const url = 'www.crictracker.com/cricket-live-feeds/mi-vs-gt-live-score-updates-mumbai-indians-vs-gujarat-titans-live-updates/?amp=1'
  const data = `url=${url}&timestamp=${timestamp}`
  console.log({ url })
  const sign = crypto.createSign('RSA-SHA256')

  sign.update(data)
  const signature = sign.sign(privateKey, 'base64')

  return signature
}

module.exports = new MatchService()
