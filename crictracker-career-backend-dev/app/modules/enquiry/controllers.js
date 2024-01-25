/* eslint-disable no-useless-escape */
const { enquiries: EnquiriesModel, jobPosts } = require('../../model')
const { getPaginationValues, s3 } = require('../../utils/index')
const _ = require('../../../global')
const config = require('../../../config')

const controllers = {}

controllers.applyJob = async (parent, { input }, context) => {
  try {
    const { jobApplyInput } = input
    const { iJobId, sFullName, sEmail, sPhone, sCurrentEmployer, sCurrentCTC, sExpectedCTC, sCurrentLocation, iPreferredLocationId, sTotalExperience, sUploadCV, sMessage, sUploadSample, sReference } = jobApplyInput

    if (!iJobId || !sFullName || !sEmail || !sPhone || !sCurrentCTC || !sExpectedCTC || !sTotalExperience || !sMessage || !sUploadCV) _.throwError('requiredField', context)

    if (_.isEmail(sEmail)) _.throwError('invalidEmail', context)

    const job = await jobPosts.findById(iJobId).lean()
    if (!job) _.throwError('notFound', context, 'jobPost')

    // check user already applied for job or not
    const isApplied = await _.CheckJobApply(EnquiriesModel, iJobId, sEmail)
    if (isApplied) _.throwError('jobAlreadyApply', context, 'jobPost')

    const insertEnquiryQuery = { iJobId, sFullName, sEmail, sPhone, sCurrentEmployer, sCurrentCTC, sExpectedCTC, sCurrentLocation, iPreferredLocationId, sTotalExperience, sUploadCV, sMessage }
    insertEnquiryQuery.iPreferredLocationId = _.mongify(iPreferredLocationId)
    insertEnquiryQuery.iJobId = _.mongify(iJobId)
    insertEnquiryQuery.sJobTitle = job.sTitle
    insertEnquiryQuery.eDesignation = job.eDesignation
    if (sUploadSample) insertEnquiryQuery.sUploadSample = sUploadSample
    if (sReference) insertEnquiryQuery.sReference = sReference

    await EnquiriesModel.create(insertEnquiryQuery)

    // Update job enquiry count
    let currentEnquiryCount = 1
    if (job.nEnquiryCount) {
      currentEnquiryCount = (job.nEnquiryCount + 1)
    }

    await jobPosts.updateOne({ _id: _.mongify(job._id) }, { nEnquiryCount: currentEnquiryCount })

    return _.resolve('jobApplySuccess', null, null, context)
  } catch (error) {
    return error
  }
}

controllers.getEnquiries = async (parent, { input }, context) => {
  try {
    const { nSkip, nLimit, sorting, sSearch } = getPaginationValues(input)
    let { eDesignation, aState } = input
    eDesignation = !eDesignation ? [] : eDesignation

    const query = {
      $or: [
        { sFullName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { sEmail: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { sJobTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      ]
    }

    if (aState && aState.length !== 0) query.eStatus = { $in: aState }
    else query.eStatus = { $ne: 'd' }

    if (eDesignation.length) query.eDesignation = { $in: eDesignation }

    const nTotal = await EnquiriesModel.countDocuments(query)
    const aResults = await EnquiriesModel.find(query)
      .populate([
        { path: 'oPreferredLocation', match: { eStatus: 'a' } },
        { path: 'oJobData', match: { eStatus: 'a' } }
      ])
      .sort(sorting).skip(nSkip).limit(nLimit).lean()

    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.getEnquiryById = async (parent, { input }, context) => {
  try {
    if (!input) _.throwError('requiredField', context)
    const enquiry = await EnquiriesModel.findById(input._id).populate([
      { path: 'oPreferredLocation', match: { eStatus: 'a' } },
      { path: 'oJobData', match: { eStatus: 'a' } }
    ]).lean()
    if (!enquiry) _.throwError('notFound', context, 'enquiry')

    if (enquiry.eStatus === 'ur') await EnquiriesModel.updateOne({ _id: enquiry._id }, { eStatus: 'r' })

    return enquiry
  } catch (error) {
    return error
  }
}

controllers.deleteEnquiry = async (parent, { input }, context) => {
  try {
    const { _id } = input

    const iProcessedBy = _.decodeToken(context.headers.authorization).iAdminId

    const deleteEnquiry = await EnquiriesModel.updateOne({ _id: _.mongify(_id) }, { eStatus: 'd', iProcessedBy })
    if (!deleteEnquiry.modifiedCount) return _.resolve('alreadyDeleted', null, 'enquiry', context)
    return _.resolve('deleteSuccess', null, 'enquiry', context)
  } catch (error) {
    return error
  }
}

controllers.bulkEnquiryUpdate = async (parent, { input }, context) => {
  try {
    const { aId, eStatus } = input
    const ids = aId.map(id => _.mongify(id))

    const iProcessedBy = _.decodeToken(context.headers.authorization).iAdminId

    const updateInquiries = await EnquiriesModel.updateMany({ _id: ids }, { eStatus, iProcessedBy })
    if (!updateInquiries.modifiedCount) _.throwError('notFound', context, 'enquiry')

    return _.resolve('updateSuccess', null, 'enquiry', context)
  } catch (error) {
    return error
  }
}

controllers.generateCVPreSignedUrl = async (parent, { input }, context) => {
  try {
    const data = []
    input.forEach((ele) => {
      const { sFileName, sContentType, sType } = ele
      let url
      switch (sType) {
        case 'jobApplyCV':
          url = s3.generatePreSignedUrl(sFileName, sContentType, config.S3_BUCKET_JOB_APPLY_CV_PATH)
          break
        case 'enqWorkSample': // enquiry work sample
          url = s3.generatePreSignedUrl(sFileName, sContentType, config.S3_BUCKET_WORK_SAMPLE_PATH)
          break
        default:
          _.throwError('invalid', context, 'type')
          break
      }
      data.push({ sType, sUploadUrl: url.url, sS3Url: url.key })
    })
    return data
  } catch (error) {
    return error
  }
}

module.exports = controllers
