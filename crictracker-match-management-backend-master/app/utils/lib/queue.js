const { fantasyarticles: FantasyArticleModel, UserCommentsModel, matches, series: SeriesModel } = require('../../model')
const moment = require('moment')
const config = require('../../../config')
const { redisclient, redisArticleDb } = require('./redis')
const Filter = require('bad-words')
const { words } = require('./data')
const { categorySeoBuilder } = require('./seoBuilder')
const { ObjectId } = require('mongoose').Types

const queuePush = (queueName, data) => {
  return redisclient.rpush(queueName, JSON.stringify(data))
}

const queuePop = (queueName) => {
  return redisclient.lpop(queueName)
}

const sanitize = new Filter()
if (words.length) sanitize.addWords(...words)

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
    await UserCommentsModel.findByIdAndUpdate(_id, query)
    sanitizeContent()
  } catch (error) {
    console.log(error)
  }
}

const publishArticle = async () => {
  try {
    const data = await redisArticleDb.lpop('fantasyArticle')
    if (data) {
      const parsedData = JSON.parse(data)
      const article = await FantasyArticleModel.findOne({ _id: parsedData._id })
      if (article.eState === 's' && (moment(article.dPublishDate).unix() === parsedData.nTimestamp)) {
        await FantasyArticleModel.updateOne({ _id: article._id }, { eState: 'pub' })

        await redisclient.xadd(config.SITEMAP_ID_EVENT, '*', 'article', JSON.stringify({ iId: article._id, sKey: config.POST_SITEMAP, eOpType: 'add' }))
      }

      publishArticle()
    } else {
      setTimeout(() => publishArticle(), 20000)
    }
  } catch (error) {
    return error
  }
}

const assignSeries = async () => {
  try {
    let data = await queuePop('seriesCategory')
    if (!data) {
      setTimeout(() => assignSeries(), 2000)
      return
    }
    data = JSON.parse(data)
    const startDate = moment.utc().subtract(1, 'days').toDate()
    const endDate = moment.utc().add(1, 'days').toDate()
    if (data) {
      const { iSeriesId } = data
      const [lastMatch] = await matches.find({ iSeriesId: ObjectId(iSeriesId), sStatusStr: 'live' }).populate([
        { path: 'oSeries', select: '_id sTitle sAbbr sSeason isBlockedMini nTotalTeams iCategoryId sSrtTitle' },
        { path: 'oVenue', select: 'sName sLocation' },
        { path: 'oTeamScoreA.oTeam', select: '_id sTitle sAbbr oImg' },
        { path: 'oTeamScoreB.oTeam', select: '_id sTitle sAbbr oImg' },
        { path: 'oWinner', select: '_id sTitle sAbbr oImg' }
      ]).sort({ dStartDate: -1 }).limit(1).lean()

      if (lastMatch) queuePush('assignSeriesArticle', { lastMatch })
      else {
        const [upcomingMatch] = await matches.find({ iSeriesId: ObjectId(iSeriesId), dStartDate: { $gt: moment().startOf('day'), $lt: moment().endOf('day') }, sStatusStr: 'scheduled' }).populate([
          { path: 'oSeries', select: '_id sTitle sAbbr sSeason isBlockedMini nTotalTeams iCategoryId sSrtTitle' },
          { path: 'oVenue', select: 'sName sLocation' },
          { path: 'oTeamScoreA.oTeam', select: '_id sTitle sAbbr oImg' },
          { path: 'oTeamScoreB.oTeam', select: '_id sTitle sAbbr oImg' },
          { path: 'oWinner', select: '_id sTitle sAbbr oImg' }
        ]).sort({ dStartDate: -1 }).limit(1).lean()
        if (upcomingMatch) queuePush('assignSeriesArticle', { lastMatch: upcomingMatch })
        else {
          const [lastLiveMatch] = await matches.find({ iSeriesId: ObjectId(iSeriesId), dStartDate: { $gt: startDate, $lt: endDate } }).sort({ dStartDate: 1 }).populate([
            { path: 'oSeries', select: '_id sTitle sAbbr sSeason isBlockedMini nTotalTeams iCategoryId sSrtTitle' },
            { path: 'oVenue', select: 'sName sLocation' },
            { path: 'oTeamScoreA.oTeam', select: '_id sTitle sAbbr oImg' },
            { path: 'oTeamScoreB.oTeam', select: '_id sTitle sAbbr oImg' },
            { path: 'oWinner', select: '_id sTitle sAbbr oImg' }
          ]).limit(1).lean()
          if (lastLiveMatch) queuePush('assignSeriesArticle', { lastMatch: lastLiveMatch })
          else {
            const seriesStatus = await SeriesModel.findOne({ _id: iSeriesId }).lean()
            const query = {
              iSeriesId: ObjectId(iSeriesId)
            }

            const sort = {
              dStartDate: 1
            }

            if (seriesStatus.sStatus === 'live') {
              Object.assign(query, { dStartDate: { $gt: startDate } })
            }
            if (seriesStatus.sStatus === 'result') sort.dStartDate = -1

            const [lastMatch] = await matches.find(query).sort(sort).populate([
              { path: 'oSeries', select: '_id sTitle sAbbr sSeason isBlockedMini nTotalTeams iCategoryId sSrtTitle' },
              { path: 'oVenue', select: 'sName sLocation' },
              { path: 'oTeamScoreA.oTeam', select: '_id sTitle sAbbr oImg' },
              { path: 'oTeamScoreB.oTeam', select: '_id sTitle sAbbr oImg' },
              { path: 'oWinner', select: '_id sTitle sAbbr oImg' }
            ]).limit(1).lean()
            if (lastMatch) queuePush('assignSeriesArticle', { lastMatch })
          }
        }
      }
      assignSeries()
    } else {
      setTimeout(() => assignSeries(), 2000)
    }
  } catch (error) {
    console.log(error)
  }
}

const addSeriesShortTitle = async () => {
  try {
    let data = await queuePop('modifySeriesTitle')
    if (!data) {
      setTimeout(() => addSeriesShortTitle(), 500)
      return
    }
    data = JSON.parse(data)
    if (data) {
      const { iSeriesId, sSrtTitle } = data
      await SeriesModel.updateOne({ _id: iSeriesId }, { sSrtTitle })
      setTimeout(() => addSeriesShortTitle(), 500)
    }
  } catch (error) {
    setTimeout(() => addSeriesShortTitle(), 500)
    return error
  }
}

const seriesSeoInitializer = async () => {
  try {
    let data = await queuePop('seriesSeoInitializer')
    if (!data) {
      setTimeout(() => seriesSeoInitializer(), 5000)
      return
    }
    console.log('check data', { data })
    data = JSON.parse(data)

    if (data) {
      const { category } = data
      const seriesData = await SeriesModel.findOne({ _id: category?.iSeriesId }).lean()

      try {
        if (seriesData) {
          console.log('categorySeoBuilder fired')
          categorySeoBuilder(seriesData, category, queuePush)
        }
      } catch (grpcError) {
        setTimeout(() => seriesSeoInitializer(), 5000)
        queuePush('seriesSeoInitializer', data)
      }
    }
    setTimeout(() => seriesSeoInitializer(), 5000)
  } catch (error) {
    setTimeout(() => seriesSeoInitializer(), 5000)
    return error
  }
}

setTimeout(() => {
  publishArticle()
  sanitizeContent()
  assignSeries()
  addSeriesShortTitle()
  seriesSeoInitializer()
}, 2000)

module.exports = { queuePush, publishArticle, queuePop }
