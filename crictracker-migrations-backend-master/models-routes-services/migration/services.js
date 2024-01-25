/* eslint-disable no-useless-escape */
const axios = require('axios')
const async = require('async')
const Amperize = require('amperize')
const amperize = new Amperize()
const { parse } = require('node-html-parser')
const Rss = require('rss-generator')
const xmlParser = require('xml-js')
const { ENTITY_SPORT_BASE_URL, ENTITY_SPORT_TOKEN, MATCH_DEV, MIGRATIONS_DEV } = require('./../../config')
const { matches: MatchesModel, players: PlayersModel, series: SeriesModel, teams: TeamsModel, venues: VenuesModel, articles: ArticlesModel, cms: CmsModel, seo: SeoModel, admins: AdminsModel, fantasyarticles: FantasyArticlesModel, ampbrokenarticles: AmpBrokenArticlesModel, articlefixtrackings: ArticleFixTrackingsModel, categories: categoryModel } = require('../models/index')
const { terms } = require('../models')
const { ObjectId } = require('mongoose').Types
// const { getS3ImageURL } = require('../../app/utils/lib/services')
const { removeImagePath } = require('../../app/utils/lib/s3Bucket')
const config = require('../../config')

const getAmpTweeter = (node) => {
  const patternTweet = 'https?\:\/\/twitter.com\/.*\/status\/([0-9a-z]+)'
  const regexTweet = new RegExp(patternTweet)
  const strTweet = node?.toString()
  if (!strTweet?.match(regexTweet)) return parse('')
  const tweetId = strTweet?.match(regexTweet)[1]
  return parse(`<amp-twitter width="375" height="472" layout="responsive" data-tweetid=${tweetId}>`)
}

const getAmpInsta = (node) => {
  const patternInsta = 'instagram.com\/(p|tv|reel)\/([0-9a-zA-Z_\-]+)'
  const regexInsta = new RegExp(patternInsta)
  const strInsta = node?.toString()
  if (!strInsta?.match(regexInsta)) return parse('')
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
  try {
    // const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    //   '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    //   '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    //   '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    //   '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    //   '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator
    const pattern = str.match(/^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/g)
    return !!pattern
  } catch (error) {
    console.log({ error })
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
        console.log('error in', article._id, error)
        AmpBrokenArticlesModel.create({ iId: article._id, eType: 'a', eIssue: 'amp' })

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

function convertWithFixedBrokenLinks(sContent, article) {
  return new Promise((resolve, reject) => {
    try {
      const staticBrokenLinks = ['https://www.crictracker.com/category/cricket-match-predictions/', 'https://www.crictracker.com/category/cricket-news/', 'https://www.crictracker.com/category/fantasy-cricket/', 'https://www.crictracker.com/category/cricket-teams/india/', 'https://www.crictracker.com/category/t20/bbl-big-bash-league/']
      const staticCorrectLinks = ['https://www.crictracker.com/cricket-match-predictions/', 'https://www.crictracker.com/cricket-news/', 'https://www.crictracker.com/fantasy-cricket-tips/', 'https://www.crictracker.com/cricket-teams/india/', 'https://www.crictracker.com/t20/bbl-big-bash-league/']

      const htmlParsed = parse(sContent, { comment: true })
      async.mapSeries(htmlParsed.querySelectorAll('a'), async function (e, callback) {
        let flag = false
        const link = e.getAttribute('href')
        if (link === undefined) {
          e.replaceWith(...e.childNodes)
        } else {
          const linkIndex = staticBrokenLinks.indexOf(link)
          if (!validURL(link)) {
            e.removeAttribute('href')
            e.replaceWith(...e.childNodes)
            flag = true
          } else if (linkIndex >= 0) {
            e.setAttribute('href', staticCorrectLinks[linkIndex])
            flag = true
          } else {
            try {
              await axios.get(link)
            } catch (error) {
              console.log(String(error?.response?.status), error?.config?.url)
              if (String(error?.response?.status)[0] === '4' || String(error?.response?.status)[0] === '5' || error.toString().includes('ECONNREFUSED')) {
                AmpBrokenArticlesModel.create({ iId: article._id, eType: 'fa', eIssue: 'link', oData: { sLink: link } })
                e.removeAttribute('href')
                e.replaceWith(...e.childNodes)
                flag = true
              }
            }
          }
        }

        if (flag) AmpBrokenArticlesModel.create({ iId: article._id, eType: 'fa', eIssue: 'link', oData: { sLink: link } })
        return e
      }, function (err, result) {
        if (err) {
          reject(err)
        } else {
          return resolve(htmlParsed.toString())
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}

class Migrations {
  // 1
  async startMigrateMatches(req, res) {
    try {
      let { nStart = 1, nLimit = 10 } = req.body
      console.log(nStart, nLimit)
      for (let i = 0; i < 100; i++) {
        axios.get(`${ENTITY_SPORT_BASE_URL}/matches?paged=${nStart}&per_page=${nLimit}&token=${ENTITY_SPORT_TOKEN}`).then(async response => {
          const matches = response.data.response.items
          // console.log({ matches })
          await axios.put(`${MATCH_DEV}/match`, { aMatches: matches })
        })
        nStart++
      }
      return res.send({ data: 'done' })
    } catch (error) {
      console.log(error.response)
      return res.send({ error, message: 'Something went wrong' })
    }
  }

  // 2
  async updateMatchAfterDetails(req, res) {
    try {
      console.log('in updateMatchAfterDetails')
      let { nSkip = 0 } = req.body
      const matchLimit = 5
      const matchesCount = await MatchesModel.count({})
      // const matchesCount = 1
      for (let i = 0; i < matchLimit; i++) {
        console.log({ matches: 'inn for' })
        const matches = await MatchesModel.find({}).skip(nSkip).limit(Math.ceil(matchesCount / matchLimit))
        if (matches.length) {
          for (let j = 0; j < matches.length; j++) {
            const matchId = matches[j]._id
            console.log({ matchId, j, nSkip })
            // update match Squad
            await axios.get(`${MATCH_DEV}/match-squad/${matchId}`)

            // // update full scorecard
            await axios.put(`${MATCH_DEV}/full-scorecard`, { iMatchId: matchId })

            // // update commentary
            // for (let inning = 1; inning <= matches[j].nLatestInningNumber; inning++) {
            //   await axios.put(`${MATCH_DEV}/commentaries`, { iMatchId: matchId, nInningNumber: inning })
            // }
          }
          nSkip = (i + 1) * Math.ceil(matchesCount / matchLimit)
        }
      }
      // return res.send({ message: 'done updateMatchAfterDetails' })
    } catch (error) {
      console.log(error)
      return res.send({ error, message: 'Something went wrong' })
    }
  }

  // 3
  async startMigrationTagsNCat(req, res) {
    try {
      const { nLimit = 100 } = req.body
      await axios.put(`${MIGRATIONS_DEV}/dump-tags`, { nLimit, eType: 'player' })
      await axios.put(`${MIGRATIONS_DEV}/dump-tags`, { nLimit, eType: 'team' })
      await axios.put(`${MIGRATIONS_DEV}/dump-tags`, { nLimit, eType: 'venue' })
      await axios.put(`${MIGRATIONS_DEV}/dump-remaining-simple-tags`, { nLimit })
      await axios.put(`${MIGRATIONS_DEV}/dump-category`, { limit: nLimit })

      return res.send({ data: 'Done -> startMigrationTagsNCat' })
    } catch (error) {
      console.log(error)
      return res.send({ error, message: 'Something went wrong' })
    }
  }

  // 4
  async startArticleSitemapMigration(req, res) {
    try {
      await axios.get(`${MIGRATIONS_DEV}/author/migrate`)
      // Have to migrate article first then update counts
      // await axios.get(`${MIGRATIONS_DEV}/author/update/counts`)
      // add read time update
      return res.send({ data: 'Done -> startArticleSitemapMigration' })
    } catch (error) {
      console.log(error)
      return res.send({ error, message: 'Something went wrong' })
    }
  }

  // 5
  async startSitemapMigration(req, res) {
    try {
      await axios.get(`${MIGRATIONS_DEV}/sitemap`)

      return res.send({ data: 'Done -> startSitemapMigration' })
    } catch (error) {
      console.log(error)
      return res.send({ error, message: 'Something went wrong' })
    }
  }

  async removeAllMatchData(req, res) {
    try {
      await MatchesModel.deleteMany({})
      await PlayersModel.deleteMany({})
      await SeriesModel.deleteMany({})
      await TeamsModel.deleteMany({})
      await VenuesModel.deleteMany({})

      res.send('done')
    } catch (error) {
      console.log(error)
      return res.send({ error, message: 'Something went wrong' })
    }
  }

  async fetchAllSeries(req, res) {
    try {
      console.log('fetching fetchAllSeries')
      for (let i = 0; i < 9; i++) {
        const series = await axios.get(`${process.env.ENTITY_SPORT_BASE_URL}/competitions?per_page=100&paged=${i + 1}}`, { params: { token: process.env.ENTITY_SPORT_TOKEN } })
        console.log({ series: series?.data?.response?.items })
        const seriesData = series?.data?.response?.items
        if (seriesData.length) {
          for (let j = 0; j < seriesData.length; j++) {
            console.log(seriesData[j].cid)
            // await getTeamIdFromKey(seriesData[j].tid, null, seriesData[j])
            await axios.put(`${process.env.MATCH_DEV}/match`, { sSeriesKey: seriesData[j].cid })
          }
        }
      }
      return res.send({ data: 'done' })
    } catch (error) {
      console.log(error)
      return res.send({ error, message: 'Something went wrong' })
    }
  }

  async updateTeamImage() {
    try {
      const teams = await TeamsModel.find({ sLogoUrl: { $exists: true }, oImg: { $exists: false } })
      for (const team of teams) {
        // const s3Res = await getS3ImageURL(team.sLogoUrl, config.S3_BUCKET_TEAM_THUMB_URL_PATH)
        // if (s3Res?.success) team.oImg = { sUrl: s3Res.path }
        // else team.oImg = { sUrl: '' }
        // await team.save()
        const isImage = await removeImagePath(team.oImg?.sUrl)
        if (isImage) {
          console.log({ id: team._id })
          await TeamsModel.updateOne({ _id: team._id }, { $unset: { oImg: 1 } })
        }
      }
    } catch (error) {
      console.log('error :: ', error)
    }
  }

  async removeAlsoRead(req, res) {
    const allArticles = await ArticlesModel.find({}).sort({ _id: -1 }).skip(5000).limit(100000).lean()

    async.eachSeries(allArticles, async (article, cb) => {
      const parsedContent = parse(article.sContent)
      const parsedAmpContent = parse(article.sAmpContent)

      await parsedContent.querySelectorAll('.also-read-title').map((ele) => ele.remove())
      await parsedContent.querySelectorAll('.similar-posts').map((ele) => ele.remove())
      await parsedContent.querySelectorAll('em').forEach((ele) => {
        if (ele.innerText.toLocaleLowerCase().trim() === 'also read:') {
          ele.parentNode.parentNode.removeChild(ele.parentNode)
        }
      })

      await parsedAmpContent.querySelectorAll('.also-read-title').map((ele) => ele.remove())
      await parsedAmpContent.querySelectorAll('.similar-posts').map((ele) => ele.remove())
      await parsedAmpContent.querySelectorAll('em').forEach((ele) => {
        if (ele.innerText.toLocaleLowerCase().trim() === 'also read:') {
          ele.parentNode.parentNode.removeChild(ele.parentNode)
        }
      })

      await ArticlesModel.updateOne({ _id: article._id }, { sContent: parsedContent.toString(), sAmpContent: parsedAmpContent.toString() })
    }, () => {
      return res.send('completed')
    })
  }

  async migrateStaticPages(req, res) {
    try {
      const slugArray = [
        'https://www.crictracker.com/advertise-with-us/',
        'https://www.crictracker.com/best-bowling-averages-in-t20-world-cup/',
        'https://www.crictracker.com/best-bowling-strike-rates-in-t20-world-cup/',
        'https://www.crictracker.com/highest-averages-in-t20-world-cup/',
        'https://www.crictracker.com/highest-strike-rates-in-t20-world-cup/',
        'https://www.crictracker.com/icc-womens-world-cup-points-table/',
        'https://www.crictracker.com/icc-world-cup-super-league-points-table/',
        'https://www.crictracker.com/world-test-championship-wtc-points-table/',
        'https://www.crictracker.com/india-vs-new-zealand-schedule/',
        'https://www.crictracker.com/india-vs-new-zealand-teams-and-squads/',
        'https://www.crictracker.com/india-vs-south-africa-teams-squads/',
        'https://www.crictracker.com/indian-premier-league-ipl-teams-and-squads/',
        'https://www.crictracker.com/ipl-orange-cap/',
        'https://www.crictracker.com/ipl-points-table/',
        'https://www.crictracker.com/ipl-purple-cap/',
        'https://www.crictracker.com/ipl-schedule/',
        'https://www.crictracker.com/super-striker-in-ipl/',
        'https://www.crictracker.com/t20-world-cup-points-table-2021/',
        'https://www.crictracker.com/t20-world-cup-squad-2021-teams-and-squads/'
      ]
      for (let i = 0; i < slugArray.length; i++) {
        console.log(slugArray[i])
        const xmlData = await axios.get(`${slugArray[i]}feed`)
        const jsonData = xmlParser.xml2json(xmlData.data, { compact: true, spaces: 4 })
        const { rss } = JSON.parse(jsonData)
        const sContent = rss.channel.item['content:encoded']._cdata
        const sTitle = rss.channel.item.title._text

        const { data: { json, status } } = await axios.get(`https://www.crictracker.com/wp-json/yoast/v1/get_head?url=${slugArray[i]}`)

        if (status === 200) {
          // console.log({ json })
          const CmsData = await CmsModel.create({ sContent, sTitle })
          let sSlug = slugArray[i].replace('https://www.crictracker.com/', '')
          sSlug = sSlug.slice(0, -1)
          const query = {
            iId: CmsData._id,
            sTitle: json?.title,
            sDescription: json?.description,
            sRobots: `${json?.robots?.follow.charAt(0).toUpperCase() + json?.robots?.follow.slice(1)}, ${json?.robots?.index.charAt(0).toUpperCase() + json?.robots?.index.slice(1)}`,
            sCUrl: json.canonical.split('/')[json.canonical.split('/').length - 2],
            oFB: {
              sTitle: json?.og_title,
              sDescription: json?.og_description
            },
            oTwitter: {
              sTitle: json?.og_title,
              sDescription: json?.og_description
            },
            sSlug: sSlug,
            eType: 'cms'
          }
          // console.log({ query })
          await SeoModel.create(query)
        } else {
          console.log({ 'With Status Failed': slugArray[i] })
        }
      }
      return res.send('done')
    } catch (error) {
      console.log({ error })
    }
  }

  async setSqlMongoId(req, res) {
    try {
      const arr = [{ cricSlug: 'cricket-match-predictions' }, { cricSlug: 'twitter-reactions-cricket' }, { cricSlug: 'cricket-analysis' }, { cricSlug: 'cricket-stats-mania' }, { cricSlug: 'cricket-articles' }, { cricSlug: 'cricket-appeal' }, { cricSlug: 'cricket-in-pics' }, { cricSlug: 'cricket-facts' }, { cricSlug: 'cricket-quiz' }, { cricSlug: 'crictracker-explainers' }, { cricSlug: 'cricket-critics' }, { cricSlug: 'domestic-cricket' }, { cricSlug: 'cricket-humour' }, { cricSlug: 'cricket-interviews' }, { cricSlug: 'cricket-live-feeds' }, { cricSlug: 'on-this-day' }, { cricSlug: 'cricket-opinion' }, { cricSlug: 'cricket-poll' }, { cricSlug: 'cricket-player-valuation' }, { cricSlug: 'cricket-previews' }, { cricSlug: 'cricket-reviews' }, { cricSlug: 'rario' }, { cricSlug: 'social-tracker-cricket' }, { cricSlug: 'trending' }, { cricSlug: 'sponsored' }, { cricSlug: 'cricket-press-release' }, { cricSlug: 'editors-pick-cricket' }, { cricSlug: 'cricket-infographics' }]

      for (let i = 0; i < arr.length; i++) {
        const sqlData = await terms.findAll({ where: { slug: arr[i].cricSlug }, raw: true })

        if (sqlData.length === 1) {
          const mongoData = await SeoModel.findOne({ sSlug: arr[i].cricSlug, eType: 'ct' })
          console.log({
            cricSlug: arr[i].cricSlug,
            betaSlug: arr[i].cricSlug,
            sqlId: sqlData[0].term_id,
            mongoId: mongoData.iId
          })
        } else {
          console.log('Multi', {
            cricSlug: arr[i].cricSlug
          })
        }
      }
    } catch (error) {
      console.log({ error })
    }
  }

  async fantasyArticleFeed(req, res) {
    try {
      const sSlug = 'fantasy-cricket-tips/dream11-ned-w-vs-fb-xi-dream11-prediction-fantasy-cricket-tips-playing-11-pitch-report-and-injury-updates-for-1st-t20-match'
      const { data } = await axios.get(`https://cricweb-dev.beta.crictracker.com/get-fantasy-article-feed/?slug=${sSlug}`)
      const fantasyHtml = parse(data)
      const articleHtml = await fantasyHtml.querySelector('article')

      const seoData = await SeoModel.findOne({ sSlug, eType: 'fa' }).lean()

      const feedOptions = {
        title: seoData.sTitle,
        description: articleHtml.toString(),
        site_url: config.FRONTEND_URL,
        language: 'en-US',
        custom_elements: [
          {
            image: [
              { url: 'https://media.crictracker.com/apple-touch-icon-150x150.webp' },
              { title: 'CricTracker' },
              { link: config.FRONTEND_URL },
              { width: 32 },
              { height: 32 }
            ]
          },
          {
            'atom:link': {
              _attr: {
                href: `${config.FRONTEND_URL}/${sSlug}/feed/`,
                rel: 'self',
                type: 'application/rss+xml'
              }
            }
          }
        ]
      }
      const rss = new Rss(feedOptions)

      const categories = []
      const article = await FantasyArticlesModel.findOne({ _id: seoData.iId, eState: 'pub' }).lean()
      const author = await AdminsModel.findById(article.iAuthorDId).lean()

      if (article.iCategoryId) {
        categories.push(article.iCategoryId.sName)
      }
      if (article.aSeries) {
        categories.push(...article.aSeries.map((ele) => ele.sName))
      }

      console.log({ article })

      const itemOptions = {
        title: article.sTitle,
        description: article.sSubtitle,
        url: `${config.FRONTEND_URL}/${sSlug}/`,
        guid: `${config.FRONTEND_URL}/?p=${article.id ?? article._id}`,
        categories,
        author: author,
        date: article.dPublishDate,
        custom_elements: [
          {
            'content:encoded': `<figure>
        <img src="${config.S3_BUCKET_URL}${article?.oImg?.sUrl}" width="${article?.oImg?.oMeta?.nWidth}" height="${article?.oImg?.oMeta?.nHeight}" alt="${article?.oImg?.sText}"/>
      <figcaption>${article?.oImg?.sCaption}</figcaption>
      </figure><br>${article.sContent}`
          }
        ]
      }

      rss.item(itemOptions)

      console.log(rss.xml())
      return res.send('ok')
    } catch (error) {
      console.log({ error })
    }
  }

  async fixBrokenLinks(req, res) {
    try {
      const { nSkip, nLimit, isUpdate } = req.body

      // const articles = await ArticlesModel.find({ eState: 'pub', dPublishDate: { $lt: new Date('Thu Nov 10 2022 12:34:20') } }).sort({ dPublishDate: -1 }).skip(parseInt(nSkip)).limit(parseInt(nLimit)).lean()
      // eslint-disable-next-line prefer-regex-literals
      const articles = await ArticlesModel.find({ sTitle: { $regex: new RegExp('^.*Fan2Play Fantasy Cricket Tips.*.', 'ig') } }).sort({ dPublishDate: -1 }).skip(parseInt(nSkip)).limit(parseInt(nLimit)).lean()
      // const articles = await ArticlesModel.find({}).sort({ dPublishDate: -1 }).skip(parseInt(nSkip)).limit(parseInt(nLimit)).lean()
      console.log({ len: articles.length })

      async.mapSeries(articles, async (article, cb) => {
        const fixedArticleData = await ArticleFixTrackingsModel.findOne({ iId: article._id }).lean()
        console.log({ _id: article._id })

        if (!fixedArticleData || isUpdate) {
          try {
            // article.sContent = article?.oListicleArticle?.oPageContent.join('<!-- pagebreak -->')
            const fixedArticle = await convertWithFixedBrokenLinks(article.sContent, article)

            if (fixedArticle) {
              const ampContent = await convertAmp(fixedArticle, article)

              console.log({ ampContent })
              if (ampContent) {
                await ArticlesModel.updateOne({ _id: article._id }, { sAmpContent: ampContent, sContent: fixedArticle })
                if (ampContent.includes('<!-- pagebreak -->')) {
                  const ampFigure = ampContent.split(/<!-- pagebreak -->/i)
                  await ArticlesModel.updateOne({ _id: article._id }, { 'oListicleArticle.oAmpPageContent': ampFigure })
                }
              }
            }
          } catch (error) {
            const ampContent = await convertAmp(article.sContent, article)
            if (ampContent) {
              await ArticlesModel.updateOne({ _id: article._id }, { sAmpContent: ampContent })
              if (ampContent.includes('<!-- pagebreak -->')) {
                const ampFigure = ampContent.split(/<!-- pagebreak -->/i)
                await ArticlesModel.updateOne({ _id: article._id }, { 'oListicleArticle.oAmpPageContent': ampFigure })
              }
            }
          }

          await ArticleFixTrackingsModel.create({ iId: article._id, eType: 'fa' })
        }

        Promise.resolve(cb)
      }, (error) => {
        console.log('done', error)
      })

      return res.send({ message: 'done' })
    } catch (error) {
      console.log({ error })
    }
  }

  async assignArticleToSeo(req, res) {
    try {
      const seoData = await SeoModel.find({ sSlug: { $in: [] } })

      async.mapSeries(seoData, async (seo, cb) => {
        const article = await ArticlesModel.findById(seo.iId)
        if (!article) {
          const articleByTitle = await ArticlesModel.findOne({ sTitle: seo.sTitle })
          if (articleByTitle) {
            await SeoModel.updateOne({ _id: seo._id }, { $set: { iId: articleByTitle._id } })
          }
        }
        Promise.resolve(cb)
      }, (error) => {
        console.log('done', error)
        return res.send({ message: 'done' })
      })
    } catch (error) {
      console.log('done', error)
    }
  }

  async updateDtitle(req, res) {
    try {
      const seos = await SeoModel.find({
        eType: 'ct',
        eSubType: 'n',
        // eslint-disable-next-line prefer-regex-literals
        sDescription: { $regex: new RegExp('^.*undefined.*', 'i') },
        iId: {
          $nin: [
            ObjectId('623184adf5d229bacb00ff5e'),
            ObjectId('62ea94cf8059cc6a8f70bd39'),
            ObjectId('623184adf5d229bacb00ff40'),
            ObjectId('623184b0f5d229bacb010018'),
            ObjectId('623184b0f5d229bacb010009'),
            ObjectId('62da9693c0ce1bf7255327a3'),
            ObjectId('623184b6f5d229bacb010205'),
            ObjectId('623184adf5d229bacb00ff63'),
            ObjectId('623184baf5d229bacb01030e'),
            ObjectId('62aaf778bb516e56f1f8fe74'),
            ObjectId('63981cb4e17906e521fa1dfb'),
            ObjectId('632838cd5afa2bc1c4b171b3')
          ]
        }
      }).lean()
      // const seos = await SeoModel.find({ eType: 'ct', iId: ObjectId('632bf0ad7dfa10fa238449ab') }).sort({ dCreated: -1 }).lean()
      // const category = await categoryModel.findById({ _id: ObjectId(seo.iId) }, { sName: 1 }).lean()
      for (const seo of seos) {
        const category = await categoryModel.findOne({ _id: seo.iId, eType: 'as' }).lean()
        if (category) {
          const series = await SeriesModel.findOne({ iCategoryId: ObjectId(seo.iId) }).lean()
          if (series) {
            console.log({ sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()}: Check out the ${category.sName} Latest news, Live updates, Match previews, Post match analysis & more on CricTracker.` })
            await SeoModel.updateOne({ _id: seo._id }, { sDescription: `${category?.sSrtTitle ?? series.sAbbr} ${new Date(series.dStartDate).getFullYear()}: Check out the ${category.sName} Latest news, Live updates, Match previews, Post match analysis & more on CricTracker.` })
          }
        }
      }
      console.log('Done')
      res.send('done')
      // if (category?.sName && seo?.eSubType) {
      //   await SeoModel.updateOne({ _id: seo._id }, { sDTitle })
      // } else {
      //   console.log(`seoId${seo._id},CategoryName${category?.sTitle},seoSubType${seo?.eSubType},dCreated${seo.dCreated}`)
      // }
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = new Migrations()
