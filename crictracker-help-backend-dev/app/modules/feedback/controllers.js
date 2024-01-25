/* eslint-disable no-useless-escape */
const { feedback } = require('../../model')
const { getPaginationValues } = require('../../utils/index')
const _ = require('../../../global')
const enums = require('../../model/enums')

const controllers = {}

controllers.insertFeedback = async (parent, { input }, context) => {
  try {
    const { feedbackInput } = input
    const { sName, sEmail, sPhone, eQueryType, sSubject, sPageLink, sMessage } = feedbackInput

    if (!sName || !sEmail || !eQueryType || !sSubject || !sMessage) _.throwError('requiredField', context)

    if (sEmail && _.isEmail(sEmail)) _.throwError('invalidEmail', context)

    if (sPhone) if (sPhone.length !== 10) _.throwError('invalidNumber', context)

    const insertFeedbackQuery = { sName, sEmail, sPhone, eQueryType, sSubject, sPageLink, sMessage }

    const newFeedback = await feedback.create(insertFeedbackQuery)

    // const quryTypeLable = (eQueryType == 's' ? 'Site Feedback' : 'Editorial Feedback')
    // For now comment mail code, I will impliment in future
    // await queuePush('sendMail', {
    //   eType: 'feedback',
    //   sEmail: "test31qa1947@gmail.com",
    //   sName, sPhone, quryTypeLable, sSubject, sPageLink, sMessage
    // })
    return _.resolve('feedbackSuccess', { oData: newFeedback }, null, context)
  } catch (error) {
    return error
  }
}

controllers.getFeedbacks = async (parent, { input }, context) => {
  try {
    const { eQueryType, aState } = input
    const { nSkip, nLimit, sorting, sSearch } = getPaginationValues(input)

    const query = {
      $or: [
        { sName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { sEmail: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { sSubject: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      ],
      eStatus: { $in: aState }
    }

    if (eQueryType) {
      query.eQueryType = { $in: eQueryType }
    } else {
      query.eQueryType = { $in: enums.eQueryType.value }
    }

    const nTotal = await feedback.countDocuments(query)
    const aResults = await feedback.find(query).sort(sorting).skip(nSkip).limit(nLimit).lean()

    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.getFeedbackById = async (parent, { input }, context) => {
  try {
    if (!input) _.throwError('requiredField', context)
    const feedbackObj = await feedback.findById(input._id).lean()

    if (!feedbackObj) _.throwError('notFound', context, 'feedback')
    if (feedbackObj.eStatus === 'ur') await feedback.updateOne({ _id: _.mongify(feedbackObj?._id) }, { eStatus: 'r' })

    return feedbackObj
  } catch (error) {
    return error
  }
}

controllers.deleteFeedback = async (parent, { input }, context) => {
  try {
    const { _id } = input
    if (!input) _.throwError('requiredField', context)
    const deleteFeedback = await feedback.updateOne({ _id: _.mongify(_id) }, { eStatus: 'd' })
    if (!deleteFeedback.modifiedCount) return _.resolve('alreadyDeleted', null, 'feedback', context)
    return _.resolve('deleteSuccess', null, 'feedback', context)
  } catch (error) {
    return error
  }
}

controllers.bulkFeedbackDelete = async (parent, { input }, context) => {
  try {
    const { aId } = input
    const ids = aId.map(id => _.mongify(id))
    const feedbackObj = await feedback.updateMany({ _id: ids }, { eStatus: 'd' })
    if (!feedbackObj.modifiedCount) _.throwError('notFound', context, 'feedback')
    return _.resolve('deleteSuccess', null, 'feedbacks', context)
  } catch (error) {
    return error
  }
}

controllers.getFeedbackQueryType = async (parent, { input }, context) => {
  try {
    const type = [{
      sValue: 's',
      sLabel: 'Site Feedback'
    }, {
      sValue: 'e',
      sLabel: 'Editorial Feedback'
    }]
    return type
  } catch (error) {
    return error
  }
}

module.exports = controllers
