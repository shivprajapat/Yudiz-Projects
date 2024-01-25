const moment = require('moment')
const { PollModel } = require('../../model')
const _ = require('../../../global')
const { getPaginationValues } = require('../../utils')
const { schedular: { schedulePoll } } = require('../../utils')

const controllers = {}

controllers.addPoll = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['sTitle', 'aField', 'dStartDate', 'dEndDate', 'eStatus'])

    if (moment(body.dStartDate).utc().unix() < moment().utc().unix()) _.throwError('invalidStartDate', context)
    if (moment(body?.dEndDate).utc().unix() < moment(body?.dStartDate).utc().unix()) _.throwError('invalidDateRange', context)

    const poll = await PollModel.create(body)

    if (body?.eStatus === 's') {
      schedulePoll({ eType: 'pollstatus', data: { _id: poll._id, nStartTimeStamp: moment(body.dStartDate).utc().unix() } }, moment(body.dStartDate).utc().unix())
      schedulePoll({ eType: 'pollstatus', data: { _id: poll._id, nEndTimeStamp: moment(body.dEndDate).utc().unix() } }, moment(body.dEndDate).utc().unix())
    }

    return _.resolveV2('addSuccess', { oData: poll }, 'poll', context)
  } catch (error) {
    return error
  }
}

controllers.getPollById = async (parent, { input }, context, info) => {
  try {
    const poll = await PollModel.findById(input._id, _.extractSelection(info?.fieldNodes[0]?.selectionSet)).lean()
    if (!poll) _.throwError('notFound', context, 'poll')

    return poll
  } catch (error) {
    return error
  }
}

controllers.getPollByIdFront = async (parent, { input }, context) => {
  try {
    const poll = await PollModel.findById(input._id, _.extractSelection(input)).lean()
    if (!poll) _.throwError('notFound', context, 'poll')

    return poll
  } catch (error) {
    return error
  }
}

controllers.getPollByIdRef = async (_id) => {
  const poll = await PollModel.findById(_id).lean()
  return poll
}

controllers.editPoll = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['_id', 'sTitle', 'aField', 'dStartDate', 'dEndDate', 'eStatus'])

    if (moment(body?.dEndDate).utc().unix() < moment(body?.dStartDate).utc().unix()) _.throwError('invalidDateRange', context)
    if (body?.eStatus === 's' && moment(body?.dStartDate).utc().unix() < moment().utc().unix()) _.throwError('invalidStartDate', context)

    body.nTotalVote = 0

    body.aField = body?.aField?.map((ele) => {
      body.nTotalVote += ele?.nVote
      return ele
    })

    const poll = await PollModel.findByIdAndUpdate({ _id: _.mongify(body?._id), eStatus: 'a' }, body, { new: true })
    if (!poll) _.throwError('notFound', context, 'poll')

    if (body?.eStatus === 's') {
      if (moment(body?.dStartDate).utc().unix() !== moment(poll?.dStartDate).utc().unix()) schedulePoll({ eType: 'pollstatus', data: { _id: poll._id, nStartTimeStamp: moment(body.dStartDate).utc().unix() } }, moment(body.dStartDate).utc().unix())
      if (moment(body?.dEndDate).utc().unix() !== moment(poll?.dEndDate).utc().unix()) schedulePoll({ eType: 'pollstatus', data: { _id: poll._id, nEndTimeStamp: moment(body.dEndDate).utc().unix() } }, moment(body.dEndDate).utc().unix())
    }

    console.log({ oData: poll })
    return _.resolveV2('updateSuccess', { oData: poll }, 'poll', context)
  } catch (error) {
    console.log(error)
    return error
  }
}

controllers.updatePollCount = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['_id', 'iOptionId'])

    const updateAkg = await PollModel.updateOne({ _id: _.mongify(body?._id), 'aField._id': _.mongify(body?.iOptionId) }, { $inc: { 'aField.$.nVote': 1, nTotalVote: 1 } })
    if (!updateAkg.modifiedCount) _.throwError('notFound', context, 'poll')

    return _.resolveV2('updateSuccess', null, 'pollcount', context)
  } catch (error) {
    return error
  }
}

controllers.listPoll = async (parent, { input }, context, info) => {
  try {
    const { nSkip, nLimit, sSearch } = getPaginationValues(input)

    const { aStatus } = input

    const query = { eStatus: { $in: aStatus } }

    if (sSearch) query.sTitle = { $regex: new RegExp('^.*' + sSearch + '.*', 'i') }

    const aPolls = await PollModel.find(query).sort({ dStartDate: -1 }).lean()
      .skip(nSkip)
      .limit(nLimit)
      .lean()

    const nTotal = await PollModel.countDocuments(query)

    return { nTotal, aPolls }
  } catch (error) {
    return error
  }
}

controllers.bulkDeletePoll = async (parent, { input }, context) => {
  try {
    let { aPollIds } = input

    aPollIds = aPollIds.map((ele) => _.mongify(ele))

    PollModel.updateMany({ _id: { $in: aPollIds } }, { $set: { eStatus: 'd' } }).then()
    return _.resolveV2('deleteSuccess', null, 'poll', context)
  } catch (error) {
    return error
  }
}

module.exports = controllers
