/* eslint-disable no-useless-escape */
const { categories, counts, articles, VideosModel, gallery } = require('../../model')
const { getPaginationValues, s3 } = require('../../utils')
const { queuePush } = require('../../utils')
const { eCategoryType } = require('../../model/enums')
const _ = require('../../../global')
const { getSeriesMiniScorecard } = require('./common')
const { updateCategoryCount } = require('../../utils')
const { CACHE_7, MATCH_MANAGEMENT_SUBGRAPH_URL } = require('../../../config')
const cachegoose = require('cachegoose')
const { fixBrokenLinksWithAmp } = require('../Common/controllers')
const axios = require('axios')

const grpcControllers = require('../../grpc/client')

const controllers = {}

controllers.addCategory = async (parent, { input }, context) => {
  try {
    const { categoryInput } = input

    if (categoryInput.sContent === 'undefined') delete categoryInput.sContent

    const { sName, iSeriesId, sContent, eType, iParentId, oImg, bIsLeague, sSrtTitle, oSeo, isBlockedMini } = categoryInput
    const { decodedToken } = context
    const iSubmittedBy = decodedToken.iAdminId
    const insertCategoryQuery = { sName, sContent, eType, iSubmittedBy, iParentId, oImg, bIsLeague }

    if (eType === 'as') {
      if (!iSeriesId) _.throwError('requiredField', context)
      insertCategoryQuery.iSeriesId = iSeriesId
      const exist = await categories.countDocuments({ eType: 'as', iSeriesId: _.mongify(iSeriesId), eStatus: 'a' })
      if (exist) _.throwError('seriesCategoryAssigned', context)
    }

    const category = await categories.create(insertCategoryQuery)

    oSeo.iId = category._id

    const akg = await grpcControllers.insertSeo(oSeo)
    if (akg.nStatus !== 200) {
      await categories.findByIdAndDelete(category._id).lean()
      _.throwError(akg.sMessage, context, akg?.sPrefix)
    }

    if (iSeriesId) axios.post(`${MATCH_MANAGEMENT_SUBGRAPH_URL}/api/series-category-operations`, { iId: iSeriesId, eOpType: 'seriesIdUpdated', sSrtTitle, bIsLeague, category, isBlockedMini }, { headers: { 'Content-Type': 'application/json' } })

    const postAttachments = []

    if (oImg?.sUrl) postAttachments.push({ sUrl: oImg?.sUrl, sCaption: oImg?.sCaption, sTitle: oImg?.sText, sAttribute: oImg?.sAttribute, oMeta: oImg?.oMeta })

    for await (const photos of postAttachments) {
      Object.assign(photos, { iAuthorId: decodedToken.iAdminId })
      const image = await gallery.findOne({ sUrl: photos.sUrl })
      if (!image) {
        Object.assign(photos, { iAuthorId: decodedToken.iAdminId })
        await gallery.create({ aCategories: [category._id], ...photos, eStatus: 'a' })
      } else {
        if (!image?.aCategories?.includes(_.mongify(category._id))) await gallery.updateOne({ _id: image._id }, { $push: { aCategories: category._id } })
      }
    }

    return _.resolve('addSuccess', { oData: category }, 'category', context)
  } catch (error) {
    return error
  }
}

controllers.getCategory = async (parent, { input }, context) => {
  try {
    let { aType, eStatus, bForArticle } = input

    const { nSkip, nLimit, sorting, sSearch } = getPaginationValues(input)
    aType = !aType?.length ? eCategoryType.value : aType

    if (eStatus && eStatus === 'd') _.throwError('invalid', context, 'status')
    eStatus = !eStatus ? ['a', 'i'] : [eStatus]

    const query = {
      sName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') },
      eStatus: { $in: eStatus }
    }
    if (aType.includes('as')) {
      query.$or = [
        { eType: { $in: aType } },
        { bFutureSeries: true }
      ]
    } else {
      query.eType = { $in: aType }
    }

    if (bForArticle) query.bForArticle = true

    const nTotal = await categories.countDocuments(query)

    const aResults = await categories.find(query).populate({ path: 'oParentCategory' })
      .sort(sorting)
      .skip(nSkip)
      .limit(nLimit)
      .lean()

    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.getApiSeriesCategory = async (parent, { input }, context) => {
  try {
    const { nSkip, nLimit, sorting, sSearch } = getPaginationValues(input)

    const aResults = await categories.aggregate([{
      $match: {
        sName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') },
        $or: [{ eType: 'as' }, { eType: 'pct' }],
        eStatus: 'a'
      }
    }, {
      $lookup: {
        from: 'categories',
        localField: 'iParentId',
        foreignField: '_id',
        as: 'oParentCategory'
      }
    }, {
      $unwind: {
        path: '$oParentCategory',
        preserveNullAndEmptyArrays: true
      }
    }, {
      $match: {
        $or: [{ 'oParentCategory.eType': 'pct' }, { 'oParentCategory.eType': null }]
      }
    }, {
      $skip: nSkip
    }, {
      $limit: nLimit
    }, {
      $sort: sorting
    }
    ])

    return aResults || []
  } catch (error) {
    return error
  }
}

controllers.getCategoryById = async (parent, { input }, context) => {
  try {
    if (!input) _.throwError('requiredField', context)
    const category = await categories.findById(input._id).populate({ path: 'oParentCategory' }).lean().cache(CACHE_7, `category:${input._id}`)
    if (!category || category?.eStatus === 'd') _.throwError('notFound', context, 'category')
    return category
  } catch (error) {
    return error
  }
}

const assignParentCategory = async (iCategoryId, iParentId) => {
  try {
    await articles.updateMany({ iCategoryId: _.mongify(iCategoryId) }, { aSeries: _.mongify(iCategoryId) })
    await VideosModel.updateMany({ iCategoryId: _.mongify(iCategoryId) }, { iParentId: _.mongify(iParentId) })
  } catch (error) {
    return error
  }
}

controllers.editCategory = async (parent, { input }, context) => {
  try {
    const { _id, categoryInput } = input
    const body = _.pick(categoryInput, ['sName', 'iSeriesId', 'sContent', 'oImg', 'eType', 'iParentId', 'bIsLeague', 'sSrtTitle', 'oSeo', 'isBlockedMini'])

    const { decodedToken } = context

    const category = await categories.findById(_id).cache(CACHE_7, `categoryData:${input._id}`)
    if (!category) _.throwError('notFound', context, 'category')

    if (!body?.sName || !body?.eType) _.throwError('requiredField', context)

    if (body.eType === 's') body.iSeriesId = null

    if ((body.eType === 'as')) {
      if (!body.iSeriesId) _.throwError('requiredField', context)

      // if (body?.sSrtTitle) queuePush('modifySeriesTitle', { iSeriesId: body?.iSeriesId, sSrtTitle: body?.sSrtTitle })
      assignParentCategory(_id, body.iParentId)
    }

    if (body?.sContent?.trim()) {
      body.sAmpContent = await fixBrokenLinksWithAmp(body?.sContent)
    } else {
      body.sAmpContent = ''
    }

    const newCategory = await categories.findOneAndUpdate({ _id }, body, { new: true }).populate('oParentCategory').lean()

    body.oSeo.iId = _id

    const akg = await grpcControllers.editSeo(body?.oSeo)
    if (akg.nStatus !== 200) _.throwError(akg.sMessage, context, akg?.sPrefix)

    if (category.sUrl !== newCategory.sUrl) {
      s3.deleteObject(category.sUrl)
    }
    cachegoose.clearCache(`category:${_id}`)
    cachegoose.clearCache(`categoryData:${_id}`)

    if (newCategory.eType === 'as') {
      axios.post(`${MATCH_MANAGEMENT_SUBGRAPH_URL}/api/series-category-operations`, { iId: category?.iSeriesId?.toString(), iCategoryId: category._id, sSrtTitle: body.sSrtTitle, bIsLeague: body.bIsLeague, isBlockedMini: body?.isBlockedMini }, { headers: { 'Content-Type': 'application/json' } })
      if ((category?.iSeriesId && !body?.iSeriesId)) {
        axios.post(`${MATCH_MANAGEMENT_SUBGRAPH_URL}/api/series-category-operations`, { iId: category?.iSeriesId?.toString(), iCategoryId: category._id, eOpType: 'seriesDeleted', isBlockedMini: body?.isBlockedMini }, { headers: { 'Content-Type': 'application/json' } })
      } else if (((!category?.iSeriesId && body?.iSeriesId)) || (category?.iSeriesId?.toString() !== body?.iSeriesId?.toString())) {
        axios.post(`${MATCH_MANAGEMENT_SUBGRAPH_URL}/api/series-category-operations`, { iId: newCategory?.iSeriesId?.toString(), oldIId: category?.iSeriesId, newIId: body.iSeriesId, category, eOpType: 'seriesIdUpdated', sSrtTitle: body.sSrtTitle, bIsLeague: body.bIsLeague, isBlockedMini: body?.isBlockedMini }, { headers: { 'Content-Type': 'application/json' } })
      }
    }

    const postAttachments = []

    if (body?.oImg?.sUrl) postAttachments.push({ sUrl: body?.oImg?.sUrl, sCaption: body?.oImg?.sCaption, sTitle: body?.oImg?.sText, sAttribute: body?.oImg?.sAttribute, oMeta: body?.oImg?.oMeta })

    for await (const photos of postAttachments) {
      Object.assign(photos, { iAuthorId: decodedToken.iAdminId })
      const image = await gallery.findOne({ sUrl: photos.sUrl })
      if (!image) {
        Object.assign(photos, { iAuthorId: decodedToken.iAdminId })
        await gallery.create({ aCategories: [category._id], ...photos, eStatus: 'a' })
      } else {
        if (!image?.aCategories?.includes(_.mongify(category._id))) await gallery.updateOne({ _id: image._id }, { $push: { aCategories: category._id } })
      }
    }

    return _.resolve('updateSuccess', { oData: newCategory }, 'category', context)
  } catch (error) {
    return error
  }
}

controllers.updateCategoryStatus = async (parent, { input }, context) => {
  try {
    const { _id, eStatus } = input

    const iProcessedBy = _.decodeToken(context.headers.authorization).iAdminId

    const category = await categories.updateOne({ _id: _.mongify(_id) }, { eStatus, iProcessedBy })
    await grpcControllers.updateEntitySeo({ iId: _id, eStatus })
    // queuePush('updateEntitySeo', { iId: _id, eStatus })
    if (!category.modifiedCount) _.throwError('notFound', context, 'category')

    cachegoose.clearCache(`category:${_id}`)
    cachegoose.clearCache(`categoryData:${_id}`)

    return _.resolve('updateSuccess', null, 'category', context)
  } catch (error) {
    return error
  }
}

controllers.deleteCategory = async (parent, { input }, context) => {
  try {
    const { _id } = input
    const { iAdminId } = context.decodedToken
    const deleteCategory = await categories.findOneAndUpdate({ _id: _.mongify(_id), eStatus: { $ne: 'd' } }, { eStatus: 'd', iProcessedBy: _.mongify(iAdminId), iSeriesId: null })

    queuePush('updateSiteMap', { _id, eType: 'ct' })
    await grpcControllers.updateEntitySeo({ iId: _id, eStatus: 'd' })

    axios.post(`${MATCH_MANAGEMENT_SUBGRAPH_URL}/api/series-category-operations`, { iId: deleteCategory?.iSeriesId?.toString(), eOpType: 'seriesDeleted', category: deleteCategory }, { headers: { 'Content-Type': 'application/json' } })

    if (!deleteCategory._id) return _.resolve('alreadyDeleted', null, 'category', context)

    cachegoose.clearCache(`category:${_id}`)
    cachegoose.clearCache(`categoryData:${_id}`)
    return _.resolve('deleteSuccess', null, 'category', context)
  } catch (error) {
    return error
  }
}

controllers.bulkCategoryUpdate = async (parent, { input }, context) => {
  try {
    const { eStatus } = input
    let { aId } = input
    aId = aId.map(id => _.mongify(id))
    const { iAdminId } = context.decodedToken

    const category = await categories.updateMany({ _id: aId }, { eStatus, iProcessedBy: _.mongify(iAdminId) })
    if (!category.modifiedCount) _.throwError('notFound', context, 'category')
    for (const id of aId) {
      cachegoose.clearCache(`category:${id}`)
      cachegoose.clearCache(`categoryData:${id}`)
      if (eStatus === 'd') {
        queuePush('updateSiteMap', { _id: id, eType: 'ct' })
        await grpcControllers.updateEntitySeo({ iId: id, eStatus })
        // queuePush('updateEntitySeo', { iId: id, eStatus })
      }
    }

    return _.resolve('updateSuccess', null, 'category', context)
  } catch (error) {
    return error
  }
}

// resolver function
controllers.resolveCategory = async (_id) => {
  try {
    const oCategory = await categories.findOne({ _id: _.mongify(_id) }).lean()
    return oCategory
  } catch (error) {
    return error
  }
}

controllers.getCategoryByIdFront = async (parent, { input }, context) => {
  try {
    if (!input) _.throwError('inputRequired', context)
    const { _id, bIsFav } = input

    if (!_id) _.throwError('requiredField', context)
    const category = await categories.findOne({ _id: input._id, eStatus: 'a' }).populate({ path: 'oParentCategory' }).lean().cache(CACHE_7, `category:${input._id}`)
    if (!category) _.throwError('notFound', context, 'category')

    Object.assign(category, { bIsFav })
    return category
  } catch (error) {
    return error
  }
}

controllers.listSeriesCategoryMiniScorecard = async (parent, { input }, context) => {
  try {
    const { iSeriesCategoryId } = input
    if (!iSeriesCategoryId) _.throwError('requiredField', context)

    const category = await categories.findOne({ _id: iSeriesCategoryId, eType: 'as' }).lean().cache(CACHE_7, `categoryData:${iSeriesCategoryId}`)
    if (!category) _.throwError('notFound', context, 'seriesCategory')

    const resData = await getSeriesMiniScorecard(category?.iSeriesId)

    return resData?.data || []
  } catch (error) {
    console.log(error)
    return error
  }
}

controllers.getCategoryCount = async (parent, { input }, context) => {
  try {
    updateCategoryCount()
    const res = await counts.findOne({ eType: 'ct' }).lean()
    return res
  } catch (error) {
    return error
  }
}

// front serivice
controllers.listSeriesCTArchive = async (parent, { input }, context) => {
  try {
    const { iSeriesId, bIsParent, eSubType } = input

    context.eSubType = eSubType

    let seriesCat = await categories.findOne({ iSeriesId: _.mongify(iSeriesId), eStatus: 'a' }).lean()
    if (!seriesCat) _.throwError('notFound', context, 'seriesCategory')

    if (seriesCat.iParentId) {
      const parentCat = await categories.findOne({ _id: seriesCat.iParentId, eStatus: 'a' })
      if (parentCat.eType === 'as') seriesCat = parentCat
    }

    const archive = await categories.find({ iParentId: _.mongify(seriesCat?._id), eStatus: 'a', eType: 'as' }).lean()
    if (bIsParent) archive.push(seriesCat)
    return archive || []
  } catch (error) {
    return error
  }
}

controllers.listCategoryFront = async (parent, { input }, context) => {
  try {
    const { nLimit, nSkip, sSearch } = getPaginationValues(input)

    const query = {
      eStatus: 'a'
    }

    if (sSearch) Object.assign(query, { sName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } })

    const aResults = await categories.find(query).populate({ path: 'oParentCategory' })
      .sort({ dCreated: -1 })
      .skip(nSkip)
      .limit(nLimit)
      .lean()

    return aResults
  } catch (error) {
    return error
  }
}

module.exports = controllers
