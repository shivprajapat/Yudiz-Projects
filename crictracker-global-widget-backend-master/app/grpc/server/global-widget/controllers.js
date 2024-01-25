/* eslint-disable no-useless-escape */
const { cricspecials: CricspecialsModel, trendingnews: TrendingNewsModel, MiniScoreCardPriority, PollModel } = require('../../../model')
const { schedular: { schedulePoll } } = require('../../../utils')
const moment = require('moment')

const controllers = {}

controllers.updateGlobalWidgetByType = async ({ request }, cb) => {
  try {
    const { data, type } = request
    if (data && type) {
      if (type === 'cricspecial') {
        const cricspecilData = []
        for (let index = 0; index < data.length; index++) {
          const articleData = {
            iArticleId: data[index]._id,
            sTitle: data[index].sTitle,
            sSrtTitle: data[index].sSrtTitle,
            sSubtitle: data[index].sSubtitle,
            oImg: data[index].oImg,
            oTImg: data[index].oTImg,
            dPublishDate: data[index].dPublishDate,
            nDuration: data[index].nDuration,
            oCategory: data[index].oCategory
          }
          cricspecilData.push(articleData)
        }

        if (cricspecilData.length > 0) {
          const bIsCricspecialsData = await CricspecialsModel.countDocuments({})
          if (bIsCricspecialsData) await CricspecialsModel.deleteMany({})
          await CricspecialsModel.insertMany(cricspecilData)
        }
      }
      if (type === 'trendingnews') {
        const trendingNewsData = []
        for (let index = 0; index < data.length; index++) {
          const articleData = {
            iArticleId: data[index]._id,
            sTitle: data[index].sTitle,
            sSrtTitle: data[index].sSrtTitle,
            sSubtitle: data[index].sSubtitle,
            oImg: data[index].oImg,
            oTImg: data[index].oTImg,
            dPublishDate: data[index].dPublishDate,
            nDuration: data[index].nDuration,
            oCategory: data[index].oCategory
          }
          trendingNewsData.push(articleData)
        }

        if (trendingNewsData.length > 0) {
          const bIsCricspecialsData = await TrendingNewsModel.countDocuments({})
          if (bIsCricspecialsData) await TrendingNewsModel.deleteMany({})
          await TrendingNewsModel.insertMany(trendingNewsData)
        }
      }
    }
    cb(null, { sMessage: 'success' })
  } catch (error) {
    console.log(error)
    cb(error, null)
  }
}

controllers.getMiniScorePriority = async (request, cb) => {
  try {
    console.log({ request })
    const aMiniScorePriority = await MiniScoreCardPriority.find({}).sort({ nPriority: -1 }).lean()
    cb(null, { aMiniScorePriority })
  } catch (error) {
    console.log(error)
    cb(error, null)
  }
}

controllers.getPollById = async (request, cb) => {
  try {
    cb(null, await PollModel.findById(request?.iPollId))
  } catch (error) {
    console.log(error)
    cb(error, null)
  }
}

controllers.createPoll = async ({ request }, cb) => {
  try {
    if (request?.dStartDate && request?.dEndDate && request?.aField && request?.sTitle) {
      if (moment(request?.dStartDate).unix() < moment().unix()) return cb(null, { _id: null })
      if (moment(request?.dEndDate).unix() < moment(request?.dStartDate).unix()) return cb(null, { _id: null })

      const poll = await PollModel.create(request)

      if (request?.eStatus === 's') {
        schedulePoll({ eType: 'pollstatus', data: { _id: poll._id, nStartTimeStamp: moment(request.dStartDate).utc().unix() } }, moment(request.dStartDate).utc().unix())
        schedulePoll({ eType: 'pollstatus', data: { _id: poll._id, nEndTimeStamp: moment(request.dEndDate).utc().unix() } }, moment(request.dEndDate).utc().unix())
      }

      return cb(null, { _id: poll._id })
    }

    return cb(null, { _id: null })
  } catch (error) {
    console.log(error)
    cb(error, null)
  }
}

module.exports = controllers
