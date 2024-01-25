/* eslint-disable no-useless-escape */
const axios = require('axios')
const _ = require('../../../global')
const Amperize = require('amperize')
const amperize = new Amperize()
const { parse } = require('node-html-parser')
const controllers = {}
const { venues: VenuesModel, matches: MatchesModel } = require('../../model/')
const config = require('../../../config')
const { redis } = require('../../utils/')
const grpcControllers = require('../../grpc/client')
const moment = require('moment')

controllers.getPermissions = (context) => {
  try {
    const { authorization } = context.headers
    if (!authorization) _.throwError('requiredField', context)
    const { decodedToken } = context
    if (!decodedToken || decodedToken === 'jwt expired' || !decodedToken.iAdminId || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') _.throwError('authorizationError', context)
    return { data: decodedToken }
  } catch (error) {
    return { isError: true, error }
  }
}

function cleanAmp(sContent) {
  const htmlParsed = parse(sContent, { comment: true })

  htmlParsed.querySelectorAll('amp-iframe')?.map(s => {
    s.removeAttribute('scrolling')
    s.removeAttribute('loading')
    s.removeAttribute('marginheight')
    s.removeAttribute('marginwidth')
    s.removeAttribute('border')
    s.removeAttribute('security')
    return s
  })
  htmlParsed.querySelectorAll('amp-img')?.map(s => s.removeAttribute('loading'))
  htmlParsed.querySelectorAll('amp-youtube')?.map(s => {
    s.removeAttribute('loading')
    s.removeAttribute('gesture')
    return s
  })
  htmlParsed.querySelectorAll('amp-anim')?.map(s => s.removeAttribute('loading'))
  htmlParsed.querySelectorAll('col')?.map(s => s.removeAttribute('width'))
  htmlParsed.querySelectorAll('colgroup')?.map(s => s.removeAttribute('width'))
  htmlParsed.querySelectorAll('th')?.map(s => s.removeAttribute('nowrap'))
  htmlParsed.querySelectorAll('td')?.map(s => s.removeAttribute('nowrap'))
  htmlParsed.querySelectorAll('tr')?.map(s => s.removeAttribute('aria-rowindex'))
  htmlParsed.querySelectorAll('li')?.map(s => s.removeAttribute('align'))
  htmlParsed.querySelectorAll('div')?.map(s => s.removeAttribute('_affcodeself'))
  htmlParsed.querySelectorAll('span')?.map(s => s.removeAttribute('contenteditable'))

  htmlParsed.querySelectorAll('.twitter-tweet')?.map(s => s.replaceWith(getAmpTweeter(s)))
  htmlParsed.querySelectorAll('.instagram-media')?.map(s => s.replaceWith(getAmpInsta(s)))
  htmlParsed.querySelectorAll('gt-ads')?.map((s, i) => i < 2 ? s.replaceWith(getAmpAds(s, i)) : s.remove())

  htmlParsed.querySelectorAll('.also-read-title').map((ele) => ele.remove())
  htmlParsed.querySelectorAll('quillbot-extension-portal').map((ele) => ele.remove())
  htmlParsed.querySelectorAll('.similar-posts').map((ele) => ele.remove())
  htmlParsed.querySelectorAll('em').forEach((ele) => {
    if (ele.innerText.toLocaleLowerCase().trim() === 'also read:') {
      ele.parentNode.parentNode.removeChild(ele.parentNode)
    }
  })

  htmlParsed?.querySelectorAll('figure')?.map((ele) => {
    ele.setAttribute('style', 'max-width: 100%; margin: 0;')
    ele.querySelectorAll('amp-img').map((elem) => {
      elem.setAttribute('style', 'max-width: 100%; margin: 0;')
      elem.removeAttribute('sizes')
      return elem
    })
    return ele
  })
  htmlParsed.querySelectorAll('amp-img').map((elem) => {
    elem.setAttribute('style', 'max-width: 100%; margin: 0;')
    elem.removeAttribute('sizes')
    return elem
  })

  htmlParsed.querySelectorAll('table').map((s) => {
    s.removeAttribute('height')
    s.removeAttribute('aria-rowcount')
    // s.setAttribute('style', 'width: 100%; border-spacing: 0 4px; border-collapse: separate; border: none; white-space: nowrap;')
    s.removeAttribute('style')
    const classArr = s.parentNode?.classList?.value
    if (s.parentNode.rawTagName === 'div' && (classArr.includes('table-responsive') || classArr.includes('table-scroller'))) {
      // s.parentNode.setAttribute('style', 'overflow-x: auto;')
      s.parentNode.removeAttribute('style')
    } else if (s.parentNode.rawTagName !== 'div') {
      s.replaceWith(`<div class='table-responsive'>${s.toString()}</div>`)
    }
    const children = s.querySelectorAll('tr')
    for (let j = 0; j < children.length; j++) {
      if (children[j].rawTagName === 'tr') {
        if (j === 0) {
          // s.querySelectorAll('tr')[j].querySelectorAll('td').map(el => el.setAttribute('style', 'padding: 12px 14px; background: #045de9; color: #fff; text-transform: capitalize;'))
          s.querySelectorAll('tr')[j].querySelectorAll('td').map(el => el.removeAttribute('style'))
          // s.querySelectorAll('tr')[j].querySelectorAll('th').map(el => el.setAttribute('style', 'padding: 12px 14px; background: #045de9; color: #fff; text-transform: capitalize;'))
          s.querySelectorAll('tr')[j].querySelectorAll('th').map(el => el.removeAttribute('style'))
        } else {
          // s.querySelectorAll('tr')[j].querySelectorAll('td').map(el => el.setAttribute('style', 'padding: 12px 14px; background: #f2f4f7;'))
          s.querySelectorAll('tr')[j].querySelectorAll('td').map(el => el.removeAttribute('style'))
        }
      }
    }

    return s
  })

  const eid = htmlParsed.getElementById('LB24_LIVE_CONTENT')?.getAttribute('data-eid')
  if (eid) htmlParsed.getElementById('LB24_LIVE_CONTENT').replaceWith(`<amp-iframe sandbox="allow-scripts allow-same-origin" src="https://v.24liveblog.com/iframe/?id=${eid}" width="100" height="100" layout="responsive" ></amp-iframe>`)

  return htmlParsed.toString()
}

controllers.convertAmp = (sContent) => {
  return new Promise((resolve, reject) => {
    try {
      axios.post('https://amp.crictracker.com/', JSON.stringify({ plainHtml: sContent })).then(result => {
        if (!result?.data || result?.data.includes('Uncaught Error') || result?.data.includes('Unknown: Input variables exceeded')) {
          amperize.parse(sContent, function (error, result) {
            if (error) {
              console.log({ error }, 'amp error')
              return resolve('')
            } else {
              return resolve(cleanAmp(result))
            }
          })
        } else {
          return resolve(cleanAmp(result?.data))
        }
      }).catch(error => {
        console.log('error in', error)
        amperize.parse(sContent, function (error, result) {
          if (error) {
            console.log({ error }, 'amp error')
            return resolve('')
          } else {
            return resolve(cleanAmp(result))
          }
        })
      })
    } catch (error) {
      console.log({ error }, 'amp error2')
      return reject(error)
    }
  })
}

const getAmpTweeter = (node) => {
  try {
    const patternTweet = 'https?\:\/\/twitter.com\/.*\/status\/([0-9a-z]+)'
    const regexTweet = new RegExp(patternTweet)
    const strTweet = node?.toString()
    const tweetId = strTweet?.match(regexTweet)[1]
    return parse(`<amp-twitter width="375" height="472" layout="responsive" data-tweetid=${tweetId}>`)
  } catch (error) {
    return error
  }
}

const getAmpInsta = (node) => {
  try {
    const patternInsta = 'instagram.com\/(p|tv)\/([0-9a-zA-Z_\-]+)'
    const regexInsta = new RegExp(patternInsta)
    const strInsta = node?.toString()
    const InstaId = strInsta?.match(regexInsta)[2]

    return parse(`<amp-instagram data-shortcode="${InstaId}" data-captioned width="400" height="400" layout="responsive"></amp-instagram>`)
  } catch (error) {
    return error
  }
}

const getAmpAds = (node, position) => {
  if (position === 0) {
    return parse('<amp-ad width=300 height=250 type="doubleclick" data-slot="/138639789/Crictracker2022_AMP_MID_300x250"></amp-ad>')
  } else {
    return parse('<amp-ad width=300 height=250 type="doubleclick" data-slot="/138639789/Crictracker2022_AMP_MID2_300x250"></amp-ad>')
  }
}

controllers.getWeatherCondition = async (parent, { input }, context) => {
  try {
    const { _id } = input
    let oRes
    const cachedData = await redis.redisMatchDb.get(`weather:${_id}`)
    if (cachedData) {
      oRes = JSON.parse(cachedData)
      return oRes
    }
    const oVenue = await VenuesModel.findById(_id).lean()
    if (!oVenue?.sLatitude || !oVenue?.sLongitude) return null
    const axiosRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${parseFloat(oVenue?.sLatitude)}&lon=${parseFloat(oVenue?.sLongitude)}&appid=${config.OPEN_WEATHER_API_KEY}`)
    const oWeatherData = axiosRes?.data
    if (oWeatherData?.cod !== 200) return null
    oRes = {
      sMain: oWeatherData?.weather[0]?.main,
      sDescription: oWeatherData?.weather[0]?.description,
      sIcon: oWeatherData?.weather[0]?.icon,
      nTemp: oWeatherData?.main?.temp - 273.15,
      nHumidity: oWeatherData?.main?.humidity,
      nVisibility: oWeatherData?.visibility / 1000,
      nWindSpeed: oWeatherData?.wind?.speed,
      nClouds: oWeatherData?.clouds?.all
    }
    await redis.redisMatchDb.setex(`weather:${_id}`, 1800, _.stringify(oRes))
    return oRes
  } catch (error) {
    return null
  }
}

controllers.removeWeatherCache = async (parent, { input }, context) => {
  try {
    const { _id } = input
    await redis.redisMatchDb.del(`weather:${_id}`)
    return { sMessage: 'done' }
  } catch (error) {
    return error
  }
}

controllers.createPoll = (match, team1Data, team2Data) => {
  try {
    const date = new Date(match?.dStartDate)

    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    })

    grpcControllers.createPoll({
      sTitle: _.createPollTitle(),
      aField: [
        { sTitle: team1Data?.sAbbr || team1Data?.sTitle },
        { sTitle: team2Data?.sAbbr || team2Data?.sTitle }
      ],
      dStartDate: moment(match?.dStartDate).subtract(3, 'd').toISOString(),
      dEndDate: moment(match?.dEndDate).subtract('1', 'h').toISOString(),
      eStatus: 's',
      sType: 'ma',
      sMatchPollTitle: `${match.sShortTitle || match?.sTitle}, ${match?.sSubtitle ?? ''} - ${formattedDate ?? ''}: Place Your Vote for Winning Team!`
    }).then((data) => {
      if (data?._id) MatchesModel.updateOne({ _id: match._id }, { $set: { aPollId: [data?._id] } }).then()
    }).catch(error => console.log(error))
  } catch (error) {
    return error
  }
}

module.exports = controllers
