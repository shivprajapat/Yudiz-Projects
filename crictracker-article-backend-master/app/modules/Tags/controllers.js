/* eslint-disable no-useless-escape */
const { tags, counts, articles } = require('../../model')
const { getPaginationValues, queuePush } = require('../../utils')
const _ = require('../../../global')
const { eTagType } = require('../../model/enums.js')
const config = require('../../../config')
const { CACHE_7 } = config
const cachegoose = require('cachegoose')
const { fixBrokenLinksWithAmp } = require('../Common/controllers')
const grpcControllers = require('../../grpc/client')

const controllers = {}

const updateTagCount = async (context) => {
  try {
    const { decodedToken } = context
    const iSubmittedBy = decodedToken.iAdminId

    const nRequest = await tags.countDocuments({ eStatus: 'r', eType: 'gt' })

    const nActiveTag = await tags.countDocuments({ eStatus: { $in: ['a', 'i'] }, eType: 'gt' })
    const nRequestedTag = await tags.countDocuments({ eStatus: { $in: ['r', 'a', 'dec'] }, eType: 'gt', iSubmittedBy: _.mongify(iSubmittedBy) })

    const params = { nRequest, nActiveTag, nRequestedTag }

    await counts.updateOne({ eType: 't' }, params, { upsert: true })
    return
  } catch (error) {
    return error
  }
}

controllers.addTag = async (parent, { input }, context) => {
  try {
    const { tagsInput } = input
    const { sName, sContent, eType } = tagsInput
    const { decodedToken } = context

    if (sName && _.isInvalidStr(sName)) _.throwError('invalid', context, 'tagName')
    if (sContent && _.isInvalidStr(sContent)) _.throwError('invalid', context, 'tagDescription')

    const iSubmittedBy = decodedToken.iAdminId

    const isExist = await tags.findOne({ sName, eStatus: { $ne: 'd' } }).lean()
    if (isExist) _.throwError('alreadyExists', context, 'tag')

    let sAmpContent
    if (sContent?.trim()) {
      sAmpContent = await fixBrokenLinksWithAmp(sContent)
    } else {
      sAmpContent = ''
    }

    const insertTagQuery = { sName, sContent, sAmpContent, eType, iSubmittedBy }

    const tag = await tags.create(insertTagQuery)
    updateTagCount()
    return _.resolve('addSuccess', { oData: tag }, 'tag', context)
  } catch (error) {
    return error
  }
}

controllers.getTags = async (parent, { input }, context) => {
  try {
    const { getTagsPaginationInput, aStatusFiltersInput } = input
    const { aType } = getTagsPaginationInput
    const { nSkip, nLimit, sorting, sSearch } = getPaginationValues(getTagsPaginationInput)

    const { decodedToken } = context

    const iSubmittedBy = decodedToken.iAdminId

    // super admin - iSubmittedBy
    // sub admin - iSubmittedBy

    // for active = ["i","a"]
    // for request = ["r"]
    // for requested = ["r","dec","a"]

    if (aStatusFiltersInput && !aStatusFiltersInput.length) _.throwError('requiredField', context)

    const query = {}

    if (!aType?.length) _.throwError('requiredField', context)
    query.eType = { $in: aType }

    if (aStatusFiltersInput?.length) {
      if (aStatusFiltersInput.find(ele => ele === 'a') && aStatusFiltersInput.find(ele => ele === 'i') && aStatusFiltersInput.length === 2) query.eStatus = { $in: aStatusFiltersInput }
      else if (aStatusFiltersInput.find(ele => ele === 'r') && aStatusFiltersInput.length === 1) query.eStatus = { $in: aStatusFiltersInput }
      else if (aStatusFiltersInput.find(ele => ele === 'a') && aStatusFiltersInput.length === 1) query.eStatus = { $in: aStatusFiltersInput }
      else if (aStatusFiltersInput.find(ele => ele === 'r') && aStatusFiltersInput.find(ele => ele === 'dec') && aStatusFiltersInput.find(ele => ele === 'a') && aStatusFiltersInput.length === 3) {
        query.eStatus = { $in: aStatusFiltersInput }
        query.iSubmittedBy = _.mongify(iSubmittedBy)
      }
    }

    const nTotal = await tags.countDocuments({
      $and: [{ sName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        query
      ]

    })
    const aResults = await tags.find({
      $and: [{ sName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        query
      ]
    }).sort(sorting).skip(nSkip).limit(nLimit).lean()

    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.getTagById = async (parent, { input }, context) => {
  try {
    if (!input) _.throwError('requiredField', context)

    const tag = await tags.findOne({ $or: [{ _id: input._id }, { iId: _.mongify(input._id) }] }).lean()
    if (!tag) _.throwError('notFound', context, 'tag')
    return tag
  } catch (error) {
    return error
  }
}

controllers.editTag = async (parent, { input }, context) => {
  try {
    const { _id, tagsInput } = input
    const { sName, sContent, eType, iId } = tagsInput

    if (sName && _.isInvalidStr(sName)) _.throwError('invalid', context, 'tagName')
    if (sContent && _.isInvalidStr(sContent)) _.throwError('invalid', context, 'tagDescription')

    const updateTagQuery = { sName, sContent, eType, iId }

    const tag = await tags.findOne({ _id }).lean()
    if (!tag) _.throwError('notFound', context, 'tag')

    if (tag.sName !== sName) {
      const tagNameExist = await tags.findOne({ sName, eStatus: { $ne: 'd' } }).lean()
      if (tagNameExist) _.throwError('tagNameExist', context)
    }

    const matchTagTypes = ['p', 'v', 't']
    if (matchTagTypes.includes(eType) && tag.eType === 'gt' && !iId) _.throwError('playerTeamVenueSelected', context)
    else if (eType === 'gt') {
      if (iId) _.throwError('invalidGeneralTagInputs', context)
      updateTagQuery.$unset = { iId: 1 }
    }

    cachegoose.clearCache(`tag:${tag.eType}:${_id}`)

    if (sContent?.trim()) {
      updateTagQuery.sAmpContent = await fixBrokenLinksWithAmp(sContent)
    } else {
      updateTagQuery.sAmpContent = ''
    }

    const newTag = await tags.findByIdAndUpdate(_id, updateTagQuery, { new: true })

    return _.resolve('updateSuccess', { oData: newTag }, 'tag', context)
  } catch (error) {
    return error
  }
}

controllers.updateTagStatus = async (parent, { input }, context) => {
  try {
    const { _id, eStatus } = input
    const updateStatus = eStatus === 'ap' ? 'a' : eStatus

    const { decodedToken } = context

    const iProcessedBy = decodedToken.iAdminId

    let cacheKey = _id // _id for general tag , iId for other tags
    const tag = await tags.findOne({ _id }).lean()
    if (!tag) _.throwError('notFound', context, 'tag')

    if (tag?.iId) cacheKey = tag?.iId?.toString()

    await tags.updateOne({ _id: _.mongify(_id) }, { eStatus: updateStatus, iProcessedBy })
    grpcControllers.updateEntitySeo({ iId: _id, eStatus: updateStatus })
    // queuePush('updateEntitySeo', { iId: _id, eStatus: updateStatus })
    cachegoose.clearCache(`tag:${tag.eType}:${cacheKey}`)

    updateTagCount()
    return _.resolve('updateSuccess', null, 'tag', context)
  } catch (error) {
    return error
  }
}

controllers.deleteTag = async (parent, { input }, context) => {
  try {
    const { _id } = input

    const tag = await tags.findOne({ _id }).lean()
    if (!tag) _.throwError('notFound', context, 'tag')

    if (tag.eStatus === 'd') _.throwError('alreadyDeleted', context, 'tag')

    let cacheKey = _id
    if (tag.eType !== 'gt') cacheKey = tag?.iId?.toString()
    else queuePush('updateSiteMap', { _id, eType: 'gt' })

    await tags.updateOne({ _id: _.mongify(_id) }, { eStatus: 'd' })

    await grpcControllers.updateEntitySeo({ iId: _id, eStatus: 'd' })
    // queuePush('updateEntitySeo', { iId: _id, eStatus: 'd' })

    cachegoose.clearCache(`tag:${tag.eType}:${cacheKey}`)

    updateTagCount()
    return _.resolve('deleteSuccess', null, 'tag', context)
  } catch (error) {
    return error
  }
}

controllers.bulkTagUpdate = async (parent, { input }, context) => {
  try {
    const { eStatus } = input
    let { aId } = input

    aId = aId.map(id => _.mongify(id))

    const { decodedToken } = context

    const iProcessedBy = decodedToken.iAdminId

    for (const _id of aId) {
      const tag = await tags.findOne({ _id }).lean()
      if (!tag) _.throwError('notFound', context, 'tag')

      if (eStatus === 'd' && tag.eType === 'gt') queuePush('updateSiteMap', { _id, eType: 'gt' })

      await tags.updateOne({ _id }, { eStatus, iProcessedBy })
      await grpcControllers.updateEntitySeo({ iId: _id, eStatus })
      // queuePush('updateEntitySeo', { iId: _id, eStatus })
      cachegoose.clearCache(`tag:${tag.eType}:${_id}`)
    }

    updateTagCount()

    return _.resolve('updateSuccess', null, 'tag', context)
  } catch (error) {
    return error
  }
}

controllers.getTagCounts = async (parent, { input }, context) => {
  try {
    updateTagCount(context)
    const oData = await counts.findOne({ eType: 't' }).lean()
    return oData || {}
  } catch (error) {
    return error
  }
}

controllers.resolveTag = async (_id) => {
  try {
    const oTag = await tags.findOne({ _id: _.mongify(_id), eStatus: 'a' }).lean()
    return oTag
  } catch (error) {
    return error
  }
}

controllers.updateOtherTags = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['eStatus', 'eType', 'sName'])

    if (body.eStatus === 'r') {
      body.eStatus = 'dec'
    }

    const { decodedToken } = context
    const { iAdminId } = decodedToken

    body.iProcessedBy = _.mongify(iAdminId)
    body.iSubmittedBy = _.mongify(iAdminId)
    body.iId = _.mongify(input.iId)

    await tags.updateOne({ iId: body.iId }, body, { upsert: true })

    return _.resolve('updateSuccess', null, 'tag', context)
  } catch (error) {
    return error
  }
}

controllers.getTagByIdFront = async (parent, { input }, context) => {
  try {
    const { _id, eType, bIsFav } = input
    if (!_id || !eType) _.throwError('requiredField', context)

    const query = { eType, eStatus: 'a' }

    if (eType === 'gt') query._id = _id
    if (['p', 't', 'v'].includes(eType)) query.$or = [{ _id }, { iId: _.mongify(_id) }]

    const tag = await tags.findOne(query).lean().cache(CACHE_7, `tag:${eType}:${_id}`)
    if (!tag) _.throwError('notFound', context, 'tag')
    Object.assign(tag, { bIsFav })

    return tag
  } catch (error) {
    return error
  }
}

controllers.getTagArticlesFront = async (parent, { input }, context) => {
  try {
    const { _id, eType } = input
    if (!_id || !eType) _.throwError('requiredField', context)

    if (!eTagType?.value.includes(eType)) _.throwError('invalidTagType', context)
    const { nSkip, nLimit, sorting } = getPaginationValues(input)

    const query = { eState: 'pub' }

    if (eType === 'gt') query.aTags = _id
    if (eType === 'p') {
      const playerTag = await tags.findOne({ iId: _.mongify(_id) }).lean().cache(CACHE_7, `tag:${eType}:${input._id}`)
      query.aPlayer = playerTag._id
    }
    if (eType === 't') {
      const teamTag = await tags.findOne({ iId: _.mongify(_id) }).lean().cache(CACHE_7, `tag:${eType}:${input._id}`)
      query.aTeam = teamTag._id
    }
    if (eType === 'v') {
      const venueTag = await tags.findOne({ iId: _.mongify(_id) }).lean().cache(CACHE_7, `tag:${eType}:${input._id}`)
      query.aVenue = venueTag._id
    }

    // const nTotal = await articles.countDocuments(query)
    const aResults = await articles.find(query)
      .populate([
        { path: 'aTags' },
        { path: 'aPlayer' },
        { path: 'aTeam' },
        { path: 'aVenue' },
        { path: 'aSeries' },
        { path: 'oCategory' }])
      .sort(sorting)
      .skip(nSkip)
      .limit(nLimit)
      .lean()

    return aResults?.length ? { aResults } : { aResults: [] }
  } catch (error) {
    return error
  }
}

module.exports = controllers
