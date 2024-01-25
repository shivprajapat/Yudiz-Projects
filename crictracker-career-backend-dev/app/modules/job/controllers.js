/* eslint-disable no-useless-escape */
const { jobPosts: JobPostsModel, locations, enquiries: EnquiriesModel } = require('../../model')
const { getPaginationValues, queuePush } = require('../../utils/index')
const _ = require('../../../global')
const cachegoose = require('cachegoose')
const { CACHE_5M } = require('../../../config')

const controllers = {}

controllers.addJob = async (parent, { input }, context) => {
  try {
    const { jobInput } = input
    const { sTitle, eDesignation, iLocationId, eOpeningFor, fExperienceFrom, fExperienceTo, fSalaryFrom, fSalaryTo, nOpenPositions, sDescription } = jobInput

    if (!sTitle || !eDesignation || !iLocationId || !eOpeningFor || !fExperienceFrom || !fExperienceTo || !nOpenPositions || !sDescription) _.throwError('requiredField', context)
    if (sTitle?.length > 200 || sTitle?.length < 10) _.throwError('formFieldInvalid', context, 'title')

    const iSubmittedBy = _.decodeToken(context.headers.authorization).iAdminId

    const insertJobQuery = { sTitle, eDesignation, iLocationId, eOpeningFor, fExperienceFrom, fExperienceTo, fSalaryFrom, fSalaryTo, nOpenPositions, sDescription }
    insertJobQuery.iSubmittedBy = _.mongify(iSubmittedBy)
    insertJobQuery.iLocationId = _.mongify(iLocationId)

    const job = await JobPostsModel.findOne({ sTitle }).lean()
    if (job) _.throwError('jobAlreadyExist', context)

    const data = await JobPostsModel.create(insertJobQuery)

    return _.resolve('addSuccess', { oData: data }, 'jobPost', context)
  } catch (error) {
    return error
  }
}

controllers.getJobs = async (parent, { input }, context) => {
  try {
    const { nSkip, nLimit, sorting, sSearch } = getPaginationValues(input)
    let { eDesignation } = input
    eDesignation = !eDesignation ? [] : eDesignation

    const query = {
      $or: [
        { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      ],
      eStatus: { $ne: 'd' }
    }
    if (eDesignation.length) query.eDesignation = { $in: eDesignation }

    const nTotal = await JobPostsModel.countDocuments(query)
    const data = await JobPostsModel.find(query)
      .populate([
        { path: 'oLocation', match: { eStatus: 'a' } }
      ])
      .sort(sorting).skip(nSkip).limit(nLimit).lean()
    return { nTotal, aResults: data }
  } catch (error) {
    return error
  }
}

controllers.getJobById = async (parent, { input }, context) => {
  try {
    if (!input) _.throwError('requiredField', context)
    const job = await JobPostsModel.findById(input._id).populate({ path: 'oLocation', match: { eStatus: 'a' } }).lean().cache(CACHE_5M, `job:${input._id}`)
    if (!job) _.throwError('notFound', context, 'jobPost')
    return job
  } catch (error) {
    return error
  }
}

controllers.editJob = async (parent, { input }, context) => {
  try {
    const { _id, jobInput } = input
    const { sTitle, eDesignation, iLocationId, eOpeningFor, fExperienceFrom, fExperienceTo, fSalaryFrom, fSalaryTo, nOpenPositions, sDescription } = jobInput

    if (!sTitle || !eDesignation || !iLocationId || !eOpeningFor || !fExperienceFrom || !fExperienceTo || !nOpenPositions || !sDescription) _.throwError('requiredField', context)
    if (sTitle?.length > 200 || sTitle?.length < 10) _.throwError('formFieldInvalid', context, 'title')

    const jobExist = await JobPostsModel.findOne({ sTitle }).lean()
    if (jobExist && jobExist._id.toString() !== _id) _.throwError('jobAlreadyExist', context)

    const job = await JobPostsModel.findOne({ _id }, { _id: 1 }).lean()
    if (!job) _.throwError('notFound', context, 'jobPost')

    const iProcessedBy = _.decodeToken(context.headers.authorization).iAdminId

    const updateJobQuery = { sTitle, eDesignation, iLocationId, eOpeningFor, fExperienceFrom, fExperienceTo, fSalaryFrom, fSalaryTo, nOpenPositions, sDescription }
    updateJobQuery.iProcessedBy = _.mongify(iProcessedBy)
    updateJobQuery.iLocationId = _.mongify(iLocationId)

    const updateJob = await JobPostsModel.updateOne({ _id }, updateJobQuery)
    if (!updateJob.modifiedCount) _.throwError('notFound', context, 'jobPost')

    cachegoose.clearCache(`job:${_id}`)

    const data = await JobPostsModel.findOne({ _id }).populate({ path: 'oLocation', match: { eStatus: 'a' } }).lean()

    return _.resolve('updateSuccess', { oData: data }, 'jobPost', context)
  } catch (error) {
    return error
  }
}

controllers.deleteJob = async (parent, { input }, context) => {
  try {
    const { _id } = input

    const deleteJob = await JobPostsModel.updateOne({ _id: _.mongify(_id) }, { eStatus: 'd' })
    if (!deleteJob.modifiedCount) return _.resolve('alreadyDeleted', null, 'jobPost', context)

    cachegoose.clearCache(`job:${_id}`)

    await EnquiriesModel.updateMany({ iJobId: _.mongify(_id) }, { eStatus: 'd' })

    return _.resolve('deleteSuccess', null, 'jobPost', context)
  } catch (error) {
    return error
  }
}

controllers.bulkJobUpdate = async (parent, { input }, context) => {
  try {
    const { aId, eStatus } = input
    const ids = aId.map(id => _.mongify(id))
    const iProcessedBy = _.decodeToken(context.headers.authorization).iAdminId

    const query = { eStatus, iProcessedBy }
    if (eStatus !== 'a') query.nEnquiryCount = 0

    const jobs = await JobPostsModel.updateMany({ _id: ids }, query)
    if (!jobs.modifiedCount) _.throwError('notFound', context, 'jobPost')

    for (const id of aId) {
      cachegoose.clearCache(`job:${id}`)
      if (eStatus === 'd') queuePush('updateSiteMap', { _id: id, eType: 'jo' })
      await EnquiriesModel.updateMany({ iJobId: _.mongify(id) }, { eStatus })
    }

    return _.resolve('updateSuccess', null, 'jobPost', context)
  } catch (error) {
    return error
  }
}

controllers.getLocations = async (parent, { input }, context) => {
  try {
    const data = await locations.find({ eStatus: { $ne: 'd' } }).lean()
    return data
  } catch (error) {
    return error
  }
}

controllers.getFrontJobs = async (parent, { input }, context) => {
  try {
    const { nSkip, nLimit, sorting, sSearch } = getPaginationValues(input)
    let { eDesignation } = input
    eDesignation = !eDesignation ? [] : eDesignation

    const query = {
      $or: [
        { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      ],
      eStatus: 'a'
    }
    if (eDesignation.length) query.eDesignation = { $in: eDesignation }

    const nTotal = await JobPostsModel.countDocuments(query)
    const aResults = await JobPostsModel.find(query)
      .populate([
        { path: 'oLocation', match: { eStatus: 'a' } }
      ])
      .sort(sorting).skip(nSkip).limit(nLimit).lean()
    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.getFrontJobById = async (parent, { input }, context) => {
  try {
    if (!input) _.throwError('requiredField', context)
    const job = await JobPostsModel.findOne({ _id: _.mongify(input._id), eStatus: 'a' }).populate({ path: 'oLocation', match: { eStatus: 'a' } }).lean().cache(CACHE_5M, `job:${input._id}`)
    if (!job) _.throwError('notFound', context, 'jobPost')
    return job
  } catch (error) {
    return error
  }
}

// front service
controllers.getRelatedJobs = async (parent, { input }, context) => {
  try {
    const { nSkip, nLimit } = input
    if (!input._id) _.throwError('requiredField', context)
    const { _id } = input
    // Get job by slug
    const job = await JobPostsModel.findOne({ _id, eStatus: 'a' }).lean()
    if (!job) _.throwError('notFound', context, 'jobPost')
    const { eDesignation } = job

    const query = {
      _id: { $ne: _.mongify(job._id) },
      eStatus: 'a'
    }
    const nTotal = await JobPostsModel.countDocuments(query)
    const aResults = await JobPostsModel.aggregate([
      {
        $match: query
      },
      {
        $addFields: {
          priority: { $cond: { if: { $eq: ['$eDesignation', eDesignation] }, then: 2, else: 1 } }
        }
      },
      { $lookup: { from: 'locations', localField: 'iLocationId', foreignField: '_id', as: 'oLocation' } },
      { $unwind: { path: '$oLocation', preserveNullAndEmptyArrays: true } },
      { $sort: { priority: -1, dCreated: -1 } },
      { $limit: parseInt(nSkip) + parseInt(nLimit) },
      { $skip: parseInt(nSkip) }
    ])

    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

module.exports = controllers
