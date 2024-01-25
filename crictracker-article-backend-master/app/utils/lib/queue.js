const axios = require('axios')
const { parse } = require('node-html-parser')
const { words } = require('./data')
const { redisclient, redisArticleDb, pubsub } = require('./redis')
const { comments, articles: ArticlesModel, homepages: Homepage, categories: CategoriesModel, rss: RssModel, CMSModel, LiveBlogContentModel } = require('../../model')
const { ObjectId } = require('mongoose').Types
const Filter = require('bad-words')
const moment = require('moment')
const { fixBrokenLinksWithAmp } = require('../../modules/Common/controllers')
const config = require('../../../config')

const sanitize = new Filter()
if (words.length) sanitize.addWords(...words)
const queuePush = (queueName, data) => {
  return redisclient.rpush(queueName, JSON.stringify(data))
}

const queuePop = (queueName) => {
  return redisclient.lpop(queueName)
}

const assignScoreCard = async () => {
  try {
    let data = await queuePop('scoreCard')

    if (!data) {
      setTimeout(() => assignScoreCard(), 20000)
      return
    }

    data = JSON.parse(data)
    if (data) {
      const { liveMatches, scheduledMatches, completedLatestMatches } = data
      const homepage = await Homepage.find({ iSeriesId: { $exists: true } }).select('iSeriesId')

      for await (const ele of homepage) {
        if (liveMatches.length) {
          let liveMatchesFiltered = liveMatches.filter((match) => match.oSeries._id.toString() === ele.iSeriesId.toString())
          if (liveMatchesFiltered.length) {
            [liveMatchesFiltered] = liveMatchesFiltered
            liveMatchesFiltered.iMatchId = liveMatchesFiltered._id
            await Homepage.updateOne({ _id: ele._id }, { oScore: liveMatchesFiltered, bScoreCard: true })
            return false
          }
        } else if (scheduledMatches.length) {
          let scheduledMatchesFiltered = scheduledMatches.filter((match) => match.oSeries._id.toString() === ele.iSeriesId.toString())
          if (scheduledMatchesFiltered.length) {
            [scheduledMatchesFiltered] = scheduledMatchesFiltered
            scheduledMatchesFiltered.iMatchId = scheduledMatchesFiltered._id
            await Homepage.updateOne({ _id: ele._id }, { oScore: scheduledMatchesFiltered, bScoreCard: true })
            return false
          }
        } else if (completedLatestMatches.length) {
          let completedLatestMatchesFiltered = completedLatestMatches.filter((match) => match.oSeries._id.toString() === ele.iSeriesId.toString())
          if (completedLatestMatchesFiltered.length) {
            [completedLatestMatchesFiltered] = completedLatestMatchesFiltered
            completedLatestMatchesFiltered.iMatchId = completedLatestMatchesFiltered._id
            await Homepage.updateOne({ _id: ele._id }, { oScore: completedLatestMatchesFiltered, bScoreCard: true })
            return false
          }
        }
      }
      await redisArticleDb.setex('homepage', 3600, JSON.stringify(await Homepage.find({}).sort({ nPriority: 1 }).lean()))
    }
    setTimeout(() => assignScoreCard(), 2000)
  } catch (error) {
    console.log(error)
    setTimeout(() => assignScoreCard(), 2000)
  }
}

const sanitizeContent = async () => {
  try {
    let data = await queuePop('sanitizeContent')
    if (!data) {
      setTimeout(() => sanitizeContent(), 20000)
      return
    }

    data = JSON.parse(data)
    const { _id, sContent } = data
    const sSanitizeContent = sanitize.clean(sContent)
    const query = { sContent: sSanitizeContent }

    if (sContent !== sSanitizeContent) Object.assign(query, { sOriginalContent: sContent })

    await comments.findByIdAndUpdate(_id, query)
    setTimeout(() => sanitizeContent(), 7000)
  } catch (error) {
    setTimeout(() => sanitizeContent(), 7000)
  }
}

const publishArticle = async () => {
  try {
    const data = await redisArticleDb.lpop('article')
    if (data) {
      const parsedData = JSON.parse(data)
      const article = await ArticlesModel.findOne({ _id: parsedData._id })

      if (article && article?.eState === 's' && (moment(article?.dPublishDate).unix() === parsedData.nTimestamp)) {
        await ArticlesModel.updateOne({ _id: parsedData._id }, { eState: 'pub' })
      }

      return publishArticle()
    } else {
      setTimeout(() => publishArticle(), 20000)
    }
  } catch (error) {
    console.log(error)
    return publishArticle()
  }
}

const assignSeries = async () => {
  try {
    let data = await queuePop('assignSeriesArticle')
    if (!data) {
      setTimeout(() => assignSeries(), 20000)
      return
    }
    data = JSON.parse(data)
    if (data) {
      const { lastMatch } = data
      lastMatch.iMatchId = lastMatch._id
      await Homepage.findOneAndUpdate({ iSeriesId: ObjectId(lastMatch.iSeriesId) }, { oScore: lastMatch, bScoreCard: true }, { new: true })
      await redisArticleDb.setex('homepage', 3600, JSON.stringify(await Homepage.find({}).sort({ nPriority: 1 }).lean()))
      return assignSeries()
    }
  } catch (error) {
    console.log(error)
    return assignSeries()
  }
}

const fantasyArticleFeed = async () => {
  try {
    const queueArticle = await queuePop('fantasyArticlesForFeed')
    if (!queueArticle) {
      return setTimeout(() => fantasyArticleFeed(), 5000)
    }

    const { article } = JSON.parse(queueArticle)

    const { data: { data: seoData } } = await axios.get(`${config.SEO_SUBGRAPH_URL}/api/seo/${article._id.toString()}`)
    const { sSlug } = seoData
    const { data } = await axios.get(`https://www.crictracker.com/get-fantasy-article-feed/?slug=${sSlug}`)

    const fantasyHtml = parse(data)

    const articleHtml = await fantasyHtml.querySelector('article')
    articleHtml.querySelectorAll('a').map(e => {
      const eleHref = e.getAttribute('href')
      if (eleHref.includes('live-scores')) {
        return e.setAttribute('href', `https://www.crictracker.com${eleHref}`)
      } else {
        return e
      }
    })

    let categories = []

    const author = await axios.get(`${config.AUTH_SUBGRAPH_URL}/api/fetch-name/${article.iAuthorDId}`)

    if (article.iCategoryId) categories.push(article.iCategoryId)
    if (article.aSeries?.length) categories = [...categories, ...article.aSeries]

    if (categories.length) {
      categories = await CategoriesModel.find({ _id: { $in: categories } })
      categories = categories.map(e => e.sName)
    }

    const itemOptions = {
      title: article.sTitle,
      description: article.sSubtitle,
      url: `${config.FRONTEND_URL}/${sSlug}/`,
      guid: `${config.FRONTEND_URL}/?p=${article.id ?? article._id}`,
      categories,
      author: author.data.data,
      custom_elements: [
        { pubDate: moment(article.dPublishDate).format() },
        {
          'content:encoded': `<figure>
      <img src="${config.S3_CDN_URL}${article?.oImg?.sUrl}" width="${article?.oImg?.oMeta?.nWidth ?? 600}" height="${article?.oImg?.oMeta?.nHeight ?? 400}" alt="${article?.oImg?.sText}"/>
    <figcaption>${article?.oImg?.sCaption}</figcaption>
    </figure><br>${articleHtml.toString()}`
        }
      ]
    }

    const rssObj = {
      iId: article._id,
      sSlug,
      oRss: itemOptions,
      dPublishDate: article.dPublishDate,
      eType: 'fa'
    }

    await RssModel.findOneAndUpdate({ iId: article._id }, rssObj, { upsert: true })

    if (article.isLast) {
      const olderRss = await RssModel.findOne({}).skip(20).sort({ dCreated: -1 })
      if (olderRss) {
        await RssModel.deleteMany({ dCreated: { $lt: olderRss.dCreated } })
      }
    }

    fantasyArticleFeed()
  } catch (error) {
    console.log({ error })
    fantasyArticleFeed()
  }
}

const updateOrangeCapData = async () => {
  try {
    const oOrangeCapData = await redisclient.lpop('orangeCapData')
    if (!oOrangeCapData) {
      return setTimeout(() => updateOrangeCapData(), 5000)
    }
    const cms = await CMSModel.findOne({ _id: '6307c01a4532d19f1070301a' }).lean()
    if (cms) {
      const root = parse(cms?.sContent)
      const table = root.querySelector('tbody')
      table.setAttribute('id', 'orange-cap')
      const oTableData = table.querySelectorAll('tr')
      let sAmpContent
      oTableData.shift()
      const data = JSON.parse(oOrangeCapData)
      if (data?.length) {
        for (let i = 0; i < 10; i++) {
          const ele = oTableData[i]
          ele.querySelectorAll('td')[1].innerHTML = data[i].oPlayer.sFullName || data[i].oPlayer.sFirstName || '--'
          ele.querySelectorAll('td')[2].innerHTML = data[i].oTeam.sAbbr || '--'
          ele.querySelectorAll('td')[3].innerHTML = data[i].nMatches || '--'
          ele.querySelectorAll('td')[4].innerHTML = data[i].nRuns || '--'
          ele.querySelectorAll('td')[5].innerHTML = data[i].nHighest || '--'
          ele.querySelectorAll('td')[6].innerHTML = data[i]?.nAverage || '--'
          ele.querySelectorAll('td')[7].innerHTML = data[i].nBalls || '--'
          ele.querySelectorAll('td')[8].innerHTML = data[i].sStrike || '--'
          ele.querySelectorAll('td')[9].innerHTML = data[i].nRun100 || '--'
          ele.querySelectorAll('td')[10].innerHTML = data[i].nRun50 || '--'
          ele.querySelectorAll('td')[11].innerHTML = data[i].nRun4 || '--'
          ele.querySelectorAll('td')[12].innerHTML = data[i].nRun6 || '--'
        }
        if (root.toString().trim()) {
          sAmpContent = await fixBrokenLinksWithAmp(root.toString())
        } else {
          sAmpContent = ''
        }
        await CMSModel.updateOne({ _id: '6307c01a4532d19f1070301a' }, { sContent: root.toString(), sAmpContent })
      }
    }
    setTimeout(() => updateOrangeCapData(), 5000)
  } catch (error) {
    return setTimeout(() => updateOrangeCapData(), 5000)
  }
}

const updatePurpleCapData = async () => {
  try {
    const oPurpleCapData = await redisclient.lpop('purpleCapData')
    if (!oPurpleCapData) { return setTimeout(() => updatePurpleCapData(), 5000) }
    const cms = await CMSModel.findOne({ _id: '6307c0234532d19f10703026' }).lean()
    if (cms) {
      const root = parse(cms?.sContent)
      const table = root.querySelector('tbody')
      table.setAttribute('id', 'purple-cap')
      const oTableData = table.querySelectorAll('tr')
      let sAmpContent
      oTableData.shift()
      const data = JSON.parse(oPurpleCapData)
      if (data?.length) {
        for (let i = 0; i < 10; i++) {
          const ele = oTableData[i]
          ele.querySelectorAll('td')[1].innerHTML = data[i].oPlayer.sFullName || data[i].oPlayer.sFirstName || '--'
          ele.querySelectorAll('td')[2].innerHTML = data[i].oTeam.sAbbr || '--'
          ele.querySelectorAll('td')[3].innerHTML = data[i].nMatches || '--'
          ele.querySelectorAll('td')[4].innerHTML = data[i].nOvers || '--'
          ele.querySelectorAll('td')[5].innerHTML = data[i].nRuns || '--'
          ele.querySelectorAll('td')[6].innerHTML = data[i].nWickets || '--'
          ele.querySelectorAll('td')[7].innerHTML = data[i].nAverage || '--'
          ele.querySelectorAll('td')[8].innerHTML = data[i].nEcon || '--'
          ele.querySelectorAll('td')[9].innerHTML = data[i].sStrike || '--'
          ele.querySelectorAll('td')[10].innerHTML = data[i].nWicket4i || '--'
          ele.querySelectorAll('td')[11].innerHTML = data[i].nWicket5i || '--'
        }
        if (root.toString().trim()) {
          sAmpContent = await fixBrokenLinksWithAmp(root.toString())
        } else {
          sAmpContent = ''
        }
        await CMSModel.updateOne({ _id: '6307c0234532d19f10703026' }, { sContent: root.toString(), sAmpContent })
      }
    }
    setTimeout(() => updatePurpleCapData(), 5000)
  } catch (error) {
    return setTimeout(() => updatePurpleCapData(), 5000)
  }
}

const publishContent = async () => {
  try {
    const data = await redisArticleDb.lpop('content')
    if (data) {
      const parsedData = JSON.parse(data)
      const content = await LiveBlogContentModel.findOne({ _id: parsedData._id })

      if (content && content?.eStatus === 's' && (moment(content?.dPublishDate).unix() === parsedData.nTimestamp)) {
        const blogContent = await LiveBlogContentModel.findByIdAndUpdate(parsedData._id, { eStatus: 'pb' }, { select: { iEventId: 1 }, new: true })
        pubsub.publish(`listLiveBlogContent:${blogContent.iEventId}`, { listLiveBlogContent: { eOpType: 'add', blogContent } })
      }

      return publishContent()
    } else {
      setTimeout(() => publishContent(), 20000)
    }
  } catch (error) {
    console.log({ error })
    publishContent()
  }
}

setTimeout(() => {
  sanitizeContent()
  publishArticle()
  assignScoreCard()
  assignSeries()
  fantasyArticleFeed()
  updateOrangeCapData()
  updatePurpleCapData()
  publishContent()
}, 2000)

module.exports = { queuePush }
