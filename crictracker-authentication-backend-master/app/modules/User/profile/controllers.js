const { users, countries } = require('../../../model')
const _ = require('../../../../global')
const { s3 } = require('../../../utils')
const config = require('../../../../config')
const moment = require('moment')
const { getPaginationValues } = require('../../../utils')

const controllers = {}

controllers.updateProfile = async (parent, { input }, context) => {
  try {
    const { sFullName, eGender, dDOB, sCountryId, sCity, sBio } = input

    if (!context.headers?.authorization) _.throwError('badRequest', context)

    const { decodedToken } = context
    if (!decodedToken.iUserId) _.throwError('authorizationError', context)

    const user = await users.findOne({ _id: decodedToken.iUserId }).lean()
    if (!user) _.throwError('notFound', context, 'profile')

    if (!sFullName) _.throwError('requiredField', context)
    const data = { sFullName, sCountryId, sCity, sBio, eGender }

    if (input.dDOB) {
      const formatDate = dDOB
      const formatedDate = moment(formatDate).format('YYYY-MM-DD')
      data.dDOB = formatedDate
    }

    if (input.sProPic) {
      data.sProPic = input.sProPic
    }

    const updatedUser = await users.findOneAndUpdate({ _id: decodedToken.iUserId }, data, { returnOriginal: false }).populate(
      [{ path: 'oCountry' }
      ]).lean()

    return _.resolve('updateSuccess', { oData: updatedUser }, 'profile', context)
  } catch (error) {
    return error
  }
}

controllers.updateProfileImage = async (parent, { input }, context) => {
  try {
    const { sProPic } = input

    if (!context.headers?.authorization) _.throwError('badRequest', context)

    const { decodedToken } = context
    if (!decodedToken.iUserId) _.throwError('authorizationError', context)

    const user = await users.findOne({ _id: decodedToken.iUserId }).lean()
    if (!user) _.throwError('notFound', context, 'user')

    const updateUser = await users.updateOne({ _id: decodedToken.iUserId }, { sProPic })
    if (!updateUser.modifiedCount) _.throwError('notFound', context, 'user')

    return _.resolve('updateSuccess', { sProPic }, 'profilePicture', context)
  } catch (error) {
    return error
  }
}

controllers.getUser = async (parent, input, context) => {
  try {
    if (!context.headers?.authorization) _.throwError('badRequest', context)

    const { decodedToken } = context
    const user = await users.findById(decodedToken.iUserId).populate(
      [{ path: 'oCountry' }
      ]).lean()
    if (!user) _.throwError('notFound', context, 'profile')

    return _.resolve('addSuccess', user, 'profile', context)
  } catch (error) {
    return error
  }
}

controllers.generateProfilePreSignedUrl = async (parent, { input }, context) => {
  try {
    const data = []
    input.forEach((ele) => {
      const { sFileName, sContentType, sType } = ele
      let url
      switch (sType) {
        case 'profile':
          url = s3.generatePreSignedUrl(sFileName, sContentType, config.S3_BUCKET_PROFILE_PATH)
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

controllers.listFrontCountry = async (parent, { input }, context) => {
  try {
    const { nSkip, nLimit, sorting, sSearch } = getPaginationValues(input)
    const sSort = input?.sSortBy ? sorting : 'sName'
    const query = {}
    if (sSearch) Object.assign(query, { $or: [{ sName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }, { sSortName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }] })
    const nTotal = await countries.countDocuments(query).lean()
    const aResults = await countries.find(query).sort(sSort).skip(nSkip).limit(nLimit).lean()
    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

module.exports = controllers
