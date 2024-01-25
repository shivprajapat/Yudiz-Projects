/* eslint-disable no-useless-escape */
const _ = require('../../../global')
const { sitemap: SiteMapModel, adstxt: AdsTxtModel, userfavourites: FavouritesModel, ampbrokenarticles: AmpBrokenArticlesModel } = require('../../model')
const xmlParser = require('xml-js')
const config = require('../../../config')
const { deleteObject } = require('../../utils/lib/s3Bucket.js')
const moment = require('moment')
const axios = require('axios')
const Amperize = require('amperize')
const async = require('async')
const amperize = new Amperize()
const { parse } = require('node-html-parser')
const controllers = {}

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

controllers.getPermissionsV2 = (context) => {
  try {
    const { authorization } = context.headers
    if (!authorization) _.throwError('requiredField', context)
    const decodedToken = _.decodeToken(authorization)
    if (!decodedToken || decodedToken === 'jwt expired' || !decodedToken.iAdminId || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') _.throwError('authorizationError', context)
    return { data: decodedToken }
  } catch (error) {
    return { isError: true, error }
  }
}

// To be removed

controllers.isUsersAuthenticated = async (context) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const { authorization } = context.headers
        if (!authorization) _.throwError('requiredField', context)
        const { decodedToken } = context
        if (!decodedToken || decodedToken === 'jwt expired' || !decodedToken?.iUserId || decodedToken !== 'invalid signature' || decodedToken !== 'jwt malformed') _.throwError('authorizationError', context)
        // const userAuthResponse = await axios.post(`${AUTH_SUBGRAPH_URL}`, {
        //   query: 'query GetUser { getUser { _id sEmail } }'
        // }, {
        //   headers: {
        //     'Content-Type': 'application/json',
        //     authorization: authorization
        //   }
        // })
        // const data = userAuthResponse.data?.data?.getUser
        // if (!data) resolve({ error: userAuthResponse.data?.errors, isError: true })
        resolve({ isError: false })
      } catch (error) {
        resolve({ error, isError: true })
      }
    })()
  })
}

controllers.getSiteMap = async (parent, { input }, context) => {
  try {
    const { sKey } = input
    const jsData = { _declaration: { _attributes: { version: '1.0', encoding: 'UTF-8' } } }

    if (sKey === config.BASE_SITEMAP + '.xml') {
      const sitemapindex = { sitemapindex: { _attributes: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9', 'xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1' }, sitemap: [] } }
      const sitemap = await SiteMapModel.findOne({ sKey }).lean()
      if (!sitemap) _.throwError('notFound', context, 'sitemap')

      sitemap.sitemap.map((ele) => {
        ele.loc = `${config.FRONTEND_URL}/${ele.loc}`
        ele.lastmod = moment(ele.lastmod).format('YYYY-MM-DD')
        return ele
      })

      sitemapindex.sitemapindex.sitemap = sitemap.sitemap
      Object.assign(jsData, sitemapindex)
    } else {
      Object.assign(jsData, { _doctype: 'html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"' })

      const url = {
        urlset: {
          _attributes: {
            xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
            'xmlns:image': 'http://www.google.com/schemas/sitemap-image/1.1',
            'xmlns:news': 'http://www.google.com/schemas/sitemap-news/0.9',
            'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            'xsi:schemaLocation': 'http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-news/0.9 http://www.google.com/schemas/sitemap-news/0.9/sitemap-news.xsd'
          },
          url: []
        }
      }
      const sitemap = await SiteMapModel.findOne({ sKey }).lean()
      if (!sitemap?.url?.length) _.throwError('notFound', context, 'sitemap')

      sitemap.url.map((ele) => {
        ele.loc = `${config.FRONTEND_URL}/${ele.loc}`
        ele.lastmod = moment(ele.lastmod).format('YYYY-MM-DD')
        if (sKey === 'news-sitemap.xml') {
          ele['news:news'][0]['news:publication_date'] = moment(ele['news:news'][0]['news:publication_date']).utcOffset('+05:30').format()
          delete ele.lastmod
        }
        return ele
      })

      url.urlset.url = sitemap.url
      Object.assign(jsData, url)
    }
    const xmlData = xmlParser.js2xml(jsData, { compact: true })

    return xmlData
  } catch (error) {
    return error
  }
}

controllers.getFrontUrlData = async (parent, { input }, context) => {
  try {
    const { sUrl } = input
    const response = await axios.get(sUrl, { timeout: 5000 })
    const { data } = response
    const oData = JSON.stringify(data)
    return _.resolve('fetchSuccess', { oData }, 'response', context)
  } catch (error) {
    return error
  }
}

const getAmpTweeter = (node) => {
  const patternTweet = 'https?\:\/\/twitter.com\/.*\/status\/([0-9a-z]+)'
  const regexTweet = new RegExp(patternTweet)
  const strTweet = node?.toString()
  const tweetMatch = strTweet?.match(regexTweet)
  const tweetId = tweetMatch ? tweetMatch[1] : ''
  return tweetId ? parse(`<amp-twitter width="375" height="472" layout="responsive" data-tweetid=${tweetId}>`) : parse('')
}

const getAmpInsta = (node) => {
  const patternInsta = 'instagram.com\/(p|tv|reel)\/([0-9a-zA-Z_\-]+)'
  const regexInsta = new RegExp(patternInsta)
  const strInsta = node?.toString()
  const InstaId = strInsta?.match(regexInsta)[2]

  return parse(`<amp-instagram data-shortcode="${InstaId}" data-captioned width="400" height="400" layout="responsive"></amp-instagram>`)
}

const getAmpAds = (node, position) => {
  if (position === 0) {
    return parse('<amp-ad width=300 height=250 type="doubleclick" data-slot="/138639789/Crictracker2022_AMP_MID_300x250"></amp-ad>')
  } else {
    return parse('<amp-ad width=300 height=250 type="doubleclick" data-slot="/138639789/Crictracker2022_AMP_MID2_300x250"></amp-ad>')
  }
}

function validURL(str) {
  // const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
  //   '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
  //   '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
  //   '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
  //   '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
  //   '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator
  // return !!pattern.test(str)

  const pattern = str.match(/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/g)
  return !!pattern
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
  htmlParsed.querySelectorAll('amp-video')?.map(s => s.removeAttribute('preload'))
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
          s.querySelectorAll('tr')[j].querySelectorAll('td').map(el => el.removeAttribute('style'))
          s.querySelectorAll('tr')[j].querySelectorAll('th').map(el => el.removeAttribute('style'))
        } else {
          s.querySelectorAll('tr')[j].querySelectorAll('td').map(el => el.removeAttribute('style'))
        }
      }
    }

    return s
  })

  const eid = htmlParsed.getElementById('LB24_LIVE_CONTENT')?.getAttribute('data-eid')
  if (eid) htmlParsed.getElementById('LB24_LIVE_CONTENT').replaceWith(`<amp-iframe sandbox="allow-scripts allow-same-origin"src="https://v.24liveblog.com/iframe/?id=${eid}" width="100" height="100" layout="responsive" ></amp-iframe>`)

  return htmlParsed.toString()
}

function convertAmp(sContent, article) {
  return new Promise((resolve, reject) => {
    try {
      axios.post('https://amp.crictracker.com/', JSON.stringify({ plainHtml: sContent })).then(result => {
        if (!result?.data || result?.data.includes('Uncaught Error') || result?.data.includes('Unknown: Input variables exceeded')) {
          AmpBrokenArticlesModel.create({ iId: article._id, eType: 'a', eIssue: 'amp' })
          amperize.parse(sContent, function (error, result) {
            if (error) {
              return resolve('')
            } else {
              return resolve(cleanAmp(result))
            }
          })
        } else {
          return resolve(cleanAmp(result?.data))
        }
      }).catch(catchError => {
        if (article) AmpBrokenArticlesModel.create({ iId: article._id, eType: 'a', eIssue: 'amp' })

        amperize.parse(sContent, function (error, result) {
          if (error) {
            return resolve('')
          } else {
            return resolve(cleanAmp(result))
          }
        })
      })
    } catch (error) {
      return reject(error)
    }
  })
}

async function convertWithFixedBrokenLinks(sContent) {
  return new Promise((resolve, reject) => {
    try {
      const staticBrokenLinks = ['https://www.crictracker.com/category/cricket-match-predictions/', 'https://www.crictracker.com/category/cricket-news/', 'https://www.crictracker.com/category/fantasy-cricket/', 'https://www.crictracker.com/category/cricket-teams/india/', 'https://www.crictracker.com/category/t20/bbl-big-bash-league/']
      const staticCorrectLinks = ['https://www.crictracker.com/cricket-match-predictions/', 'https://www.crictracker.com/cricket-news/', 'https://www.crictracker.com/fantasy-cricket-tips/', 'https://www.crictracker.com/cricket-teams/india/', 'https://www.crictracker.com/t20/bbl-big-bash-league/']

      const htmlParsed = parse(sContent, { comment: true })
      async.mapSeries(htmlParsed.querySelectorAll('a'), async function (e, callback) {
        const link = e.getAttribute('href')
        if (link === undefined) {
          e.replaceWith(...e.childNodes)
        } else {
          const linkIndex = staticBrokenLinks.indexOf(link)
          if (!validURL(link)) {
            e.removeAttribute('href')
            e.replaceWith(...e.childNodes)
          } else if (linkIndex >= 0) {
            e.setAttribute('href', staticCorrectLinks[linkIndex])
          } else {
            try {
              if (!(link.includes('https://twitter.com') || link.includes('https://t.co'))) {
                await axios.get(link)
              }
            } catch (error) {
              if (String(error?.response?.status)[0] === '4' || String(error?.response?.status)[0] === '5' || error.toString().includes('ECONNREFUSED')) {
                e.removeAttribute('href')
                e.replaceWith(...e.childNodes)
              }
            }
          }
        }
        // console.log({ e })
        return callback(null, e)
      }, function (err) {
        if (err) {
          reject(err)
        } else {
          return resolve(htmlParsed.toString())
        }
      })
    } catch (error) {
      console.log({ error })
      reject(error)
    }
  })
}

controllers.fixBrokenLinksWithAmp = (sContent) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const fixedArticle = await convertWithFixedBrokenLinks(sContent)
        let ampContent
        if (fixedArticle) {
          ampContent = await convertAmp(fixedArticle)
        }
        return resolve(ampContent)
      } catch (error) {
        console.log({ error })
        return reject(error)
      }
    })()
  })
}

controllers.addAdsTxt = async (parent, { input }, context) => {
  try {
    const { sAds } = input
    await AdsTxtModel.deleteMany()
    const adsTxt = await AdsTxtModel.create({ sAds })
    if (adsTxt) return _.resolve('updateSuccess', null, 'adsTxt', context)
  } catch (error) {
    return error
  }
}

controllers.getAdsTxt = async (parent, { input }, context) => {
  try {
    const adsTxt = await AdsTxtModel.findOne({}).lean()
    return adsTxt?.sAds
  } catch (error) {
    return error
  }
}

controllers.deleteArticleAttachment = async (parent, { input }, context) => {
  try {
    const { sUrl } = input
    const deletedObject = await deleteObject(sUrl)
    if (deletedObject) return _.resolve('deleteSuccess', null, 'articleAttachment', context)
  } catch (error) {
    return error
  }
}

controllers.isFavourite = async (parent, { input }, context) => {
  try {
    const { decodedToken } = context
    const { _id } = input

    const bIsFav = await FavouritesModel.countDocuments({ iUserId: _.mongify(decodedToken?.iUserId), iId: _.mongify(_id) })
    return { bIsFav: !!bIsFav }
  } catch (error) {
    return error
  }
}

module.exports = controllers
