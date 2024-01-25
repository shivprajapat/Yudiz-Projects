
const { LiveBlogContentModel, EventsModel, articles: ArticleModel } = require('../../model')
const _ = require('../../../global')
const { getPaginationValues } = require('../../utils/index')
const { pubsub } = require('../../utils/lib/redis')
const moment = require('moment')
const { scheduleArticleTask } = require('../../utils/lib/scheduler')
const { fixBrokenLinksWithAmp } = require('../Common/controllers')
const grpcController = require('../../grpc/client/')

const controllers = {}

controllers.addLiveBlogEvent = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['sEventName', 'sDescription', 'dEventDate', 'sLocation', 'sEventStatus', 'aEditorsId', 'oTeams', 'iMatchId', 'dEventEndDate'])

    body.iCreatedBy = context.decodedToken.iAdminId

    if (body?.iMatchId && body?.oTeams) delete body?.oTeams

    const event = await EventsModel.create(body)

    if (body?.iMatchId) {
      const grpcAck = await grpcController.assignLiveEventId({ iEventId: event?._id, iMatchId: body?.iMatchId })
      if (grpcAck?.nStatus !== 200) _.throwError('wentWrong', context)
    }

    return _.resolve('addSuccess', { oData: event }, 'liveBlogEvent', context)
  } catch (error) {
    return error
  }
}

controllers.addLiveBlogContent = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['iEventId', 'sContent', 'sTitle', 'eStatus', 'iDisplayAuthorId', 'eType', 'dPublishDate', 'iPollId'])

    if (!body?.iPollId && !body?.sContent && !body?.sTitle) _.throwError('requiredField', context)
    if (body?.eType === 'poll' && !body?.iPollId)_.throwError('requiredField', context)

    const eventExist = await EventsModel.findOne({ _id: body?.iEventId, eStatus: 'a' }, { _id: 1 }).lean()
    if (!eventExist) _.throwError('notFound', context, 'liveBlogEvent')

    body.iAuthorId = context.decodedToken.iAdminId

    const ct = await LiveBlogContentModel.findOne({ iEventId: _.mongify(body?.iEventId) }, { sEventId: 1 }).sort({ sEventId: -1 }).collation({ locale: 'en_US', numericOrdering: true })
    let sLastEventId

    if (!ct) sLastEventId = '0'
    else sLastEventId = parseInt(ct?.sEventId) + 1

    body.sEventId = sLastEventId.toString()

    if (body?.sContent) body.sAmpContent = await fixBrokenLinksWithAmp(body?.sContent)

    const content = await LiveBlogContentModel.create(body)

    if (body?.eStatus === 's') {
      if (moment(body.dPublishDate).unix() < moment().unix()) _.throwError('invalidPublishDate', context)
      const scheduledTime = moment(body.dPublishDate).unix()
      scheduleArticleTask({ eType: 'content', data: { _id: content._id, nTimestamp: scheduledTime } }, scheduledTime)
    }

    const liveBlogContent = await LiveBlogContentModel.findOne({ _id: content._id }).lean()

    if (body?.iEventId) await ArticleModel.updateMany({ iEventId: body?.iEventId, eState: { $ne: 't' } }, { $set: { dModifiedDate: new Date() } })
    if (!(body?.eStatus === 's')) pubsub.publish(`listLiveBlogContent:${body.iEventId}`, { listLiveBlogContent: { eOpType: 'add', liveBlogContent } })

    return _.resolve('addSuccess', { oData: content }, 'blogContent', context)
  } catch (error) {
    return error
  }
}

controllers.editLiveBlogContent = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['_id', 'sContent', 'sTitle', 'eStatus', 'eType', 'iDisplayAuthorId', 'dPublishDate', 'iPollId'])

    if (body?.eType !== 'poll' && !body?.sContent && !body?.sTitle) _.throwError('requiredField', context)
    if (body?.eType === 'poll' && !body?.iPollId)_.throwError('requiredField', context)

    const content = await LiveBlogContentModel.findById({ _id: _.mongify(body?._id) }).lean()
    if (!content) _.throwError('notFound', context, 'blogContent')

    if (content?.eStatus === 's') {
      if (moment(body.dPublishDate).unix() < moment().unix()) _.throwError('invalidPublishDate', context)
      const scheduledTime = moment(body.dPublishDate).unix()
      scheduleArticleTask({ eType: 'content', data: { _id: content._id, nTimestamp: scheduledTime } }, scheduledTime)
    }

    body.iAuthorId = context.decodedToken.iAdminId

    if (body?.sContent) body.sAmpContent = await fixBrokenLinksWithAmp(body?.sContent)

    const liveBlogContent = await LiveBlogContentModel.findByIdAndUpdate({ _id: body?._id }, body, { new: true }).lean()

    if (content?.iEventId) await ArticleModel.updateMany({ iEventId: content?.iEventId, eState: { $ne: 't' } }, { $set: { dModifiedDate: new Date() } })
    if (!(body?.eStatus === 's')) pubsub.publish(`listLiveBlogContent:${liveBlogContent.iEventId}`, { listLiveBlogContent: { eOpType: 'update', liveBlogContent } })

    return _.resolve('updateSuccess', { oData: liveBlogContent }, 'blogContent', context)
  } catch (error) {
    return error
  }
}

controllers.editLiveBlogEvent = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['_id', 'sEventName', 'sDescription', 'dEventDate', 'sLocation', 'sEventStatus', 'aEditorsId', 'oTeams', 'iMatchId', 'dEventEndDate'])

    if (body?.iMatchId && body?.oTeams) delete body?.oTeams

    const event = await EventsModel.findByIdAndUpdate({ _id: _.mongify(body?._id) }, body, { select: { iEventId: 1 } })
    if (!event) _.throwError('notFound', context, 'blogContent')

    if (!body?.iMatchId) {
      const grpcAck = await grpcController.assignLiveEventId({ iEventId: event?._id, iMatchId: null })
      if (grpcAck?.nStatus !== 200) _.throwError('wentWrong', context)
    }

    return _.resolve('updateSuccess', { oData: event }, 'liveBlogEvent', context)
  } catch (error) {
    return error
  }
}

controllers.deleteLiveBlogContent = async (parent, { input }, context) => {
  try {
    const liveBlogContent = await LiveBlogContentModel.findByIdAndUpdate({ _id: _.mongify(input?._id) }, { eStatus: 'd' })
    if (!liveBlogContent) _.throwError('notFound', context, 'blogContent')

    if (liveBlogContent?.iEventId) await ArticleModel.updateMany({ iEventId: liveBlogContent?.iEventId, eState: { $ne: 't' } }, { $set: { dModifiedDate: new Date() } })
    if (!(liveBlogContent?.eStatus === 's')) pubsub.publish(`listLiveBlogContent:${liveBlogContent.iEventId}`, { listLiveBlogContent: { eOpType: 'delete', liveBlogContent } })

    return _.resolve('deleteSuccess', null, 'blogContent', context)
  } catch (error) {
    return error
  }
}

controllers.listLiveBlogEvents = async (parent, { input }, context) => {
  try {
    const { nSkip, nLimit, sorting, sSearch } = getPaginationValues(input)
    const query = { eStatus: 'a' }

    if (sSearch) Object.assign(query, { sEventName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } })

    if (context.decodedToken.eType !== 'su') Object.assign(query, { $or: [{ aEditorsId: context.decodedToken.iAdminId.toString() }, { iCreatedBy: _.mongify(context.decodedToken.iAdminId) }] })
    const events = await EventsModel.find(query).sort(sorting).skip(nSkip).limit(nLimit).lean()
    const nTotal = await EventsModel.countDocuments(query)

    return { nTotal, aResults: events }
  } catch (error) {
    return error
  }
}

controllers.listLiveBlogContent = async (parent, { input }, context) => {
  try {
    const { nSkip, nLimit, sSearch } = getPaginationValues(input)

    const { aStatus } = input

    const query = { iEventId: _.mongify(input?.iEventId), eStatus: { $in: aStatus } }

    if (sSearch) Object.assign(query, { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } })

    const blogContent = await LiveBlogContentModel.find(query).skip(nSkip).limit(nLimit).sort({ sEventId: -1 }).collation({ locale: 'en_US', numericOrdering: true }).lean()

    const event = await EventsModel.findById(input?.iEventId).lean()
    const nTotal = await LiveBlogContentModel.countDocuments(query)

    return { nTotal, aResults: blogContent, oEvent: event }
  } catch (error) {
    return error
  }
}

controllers.listLiveBlogContentFront = async (parent, { input }, context) => {
  try {
    const { nLimit, sSearch } = getPaginationValues(input)

    const { sEventId, iEventId } = input

    const query = { iEventId: _.mongify(iEventId), eStatus: 'pb' }

    if (sEventId)Object.assign(query, { sEventId: { $lt: sEventId } })

    if (sSearch) Object.assign(query, { sContent: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } })

    const blogContent = await LiveBlogContentModel.find(query).sort({ sEventId: -1 }).collation({ locale: 'en_US', numericOrdering: true }).limit(nLimit).lean()
    const nTotal = await LiveBlogContentModel.countDocuments(query)

    const event = await EventsModel.findById(input?.iEventId).lean()

    return { nTotal, aResults: blogContent, oEvent: event }
  } catch (error) {
    return error
  }
}

controllers.getLiveBlogContent = async (parent, { input }, context) => {
  try {
    const blogContent = await LiveBlogContentModel.findOne({ _id: input?._id, eStatus: { $ne: 'd' } }).lean()
    if (!blogContent) _.throwError('notFound', context, 'blogContent')

    return blogContent
  } catch (error) {
    return error
  }
}

controllers.getLiveBlog = async (parent, { input }, context) => {
  try {
    const event = await EventsModel.findById(input._id).lean()
    if (!event) _.throwError('notFound', context, 'liveBlogEvent')

    const blogContent = await LiveBlogContentModel.find({ iEventId: event._id, eStatus: 'a' }).sort({ dCreated: -1 })
    console.log(blogContent)
    return { oBlogEvent: event, aBlogContent: blogContent }
  } catch (error) {
    return error
  }
}

controllers.bulkDeleteLiveBlogEvent = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['aId'])

    body.aId = body?.aId.map(ele => _.mongify(ele))

    if (body?.aId?.length) {
      EventsModel.updateMany({ _id: { $in: body?.aId } }, { eStatus: 'd' })
      LiveBlogContentModel.updateMany({ iEventId: { $in: body?.aId } }, { eStatus: 'd' })
      ArticleModel.updateMany({ iEventId: { $in: body?.aId } }, { $unset: { iEventId: 1 }, $set: { dModifiedDate: new Date() } })
    }

    const events = await EventsModel.find({ eStatus: 'a' }).sort({ dCreated: -1 }).lean()

    return _.resolve('deleteSuccess', { aResults: events }, 'liveBlogEvents', context)
  } catch (error) {
    return error
  }
}

controllers.getLiveBlogEventById = async (parent, { input }, context) => {
  try {
    const event = await EventsModel.findOne({ _id: input?._id }).lean()
    if (!event) _.throwError('notFound', context, 'blogContent')

    return event
  } catch (error) {
    console.log(error)
    return error
  }
}

controllers.updateMatchScores = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['iEventId', 'oTeams'])

    const event = await EventsModel.findByIdAndUpdate(body?.iEventId, { $set: { oTeams: body?.oTeams } }, { new: true }).lean()

    pubsub.publish(`getLiveMatchScore:${body?.iEventId}`, { getLiveMatchScore: event })

    return _.resolve('updateSuccess', { oData: event }, 'blogContent', context)
  } catch (error) {
    console.log(error)
    return error
  }
}

module.exports = controllers
