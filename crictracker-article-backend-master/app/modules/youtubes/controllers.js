const moment = require('moment')
const { PlayListsModel, VideosModel, categories: CategoriesModel, homepagemodels: HomePageModels } = require('../../model')
const { getPaginationValues } = require('../../utils/index')
const { redis } = require('../../utils')
const enums = require('../../model/enums')
const _ = require('../../../global')
const { videoViews } = require('../../../global/lib/video-view')
const { ALLOW_DISK_USE, CACHE_2H } = require('../../../config')
const grpcControllers = require('../../grpc/client')

const controllers = {}

controllers.getVideos = async (parent, { input }, context) => {
  try {
    const { oGetVideosPaginationInput, iPlaylistId, eStatus } = input
    const { nSkip, nLimit, sorting, sSearch } = getPaginationValues(oGetVideosPaginationInput)

    const query = {}
    if (iPlaylistId) query.iPlaylistId = iPlaylistId
    query.eStatus = (!eStatus || (eStatus === 'all')) ? { $in: enums.eStatus.value } : eStatus

    const total = await VideosModel.countDocuments({
      $and: [{ sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        query
      ]

    })
    const data = await VideosModel.find({
      $and: [{ sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        query
      ]
    }).populate({ path: 'oPlaylist' }).sort(sorting).skip(nSkip).limit(nLimit).lean()

    return { nTotal: total, aResults: data }
  } catch (error) {
    return error
  }
}

controllers.getSingleVideo = async (parent, { input }, context) => {
  try {
    if (!input) _.throwError('requiredField', context)
    const video = await VideosModel.findById(input._id).populate({ path: 'oPlaylist' }).lean()
    if (!video) _.throwError('notFound', context, 'video')

    // set articale view count
    const { ip } = context
    videoViews(video, ip)

    return video
  } catch (error) {
    return error
  }
}

controllers.listCategoryRelatedVideos = async (parent, { input }, context) => {
  try {
    const { oGetVideosPaginationInput } = input
    const { nSkip, nLimit } = getPaginationValues(oGetVideosPaginationInput)

    let nTotal = 0
    let aResults = []
    const videos = await VideosModel.findById(input._id).populate({ path: 'oPlaylist' }).lean()
    if (!videos?.iCategoryId) {
      nTotal = await VideosModel.countDocuments({ iPlaylistId: videos.oPlaylist._id, _id: { $ne: input._id } }).lean()
      aResults = await VideosModel.find({ iPlaylistId: videos.oPlaylist._id, _id: { $ne: input._id } }).hint({ dCreated: -1 }).skip(nSkip).limit(nLimit).lean()
    } else {
      nTotal = await VideosModel.countDocuments({ iCategoryId: videos.iCategoryId, _id: { $ne: input._id } }).lean()
      aResults = await VideosModel.find({ iCategoryId: videos.iCategoryId, _id: { $ne: input._id } }).hint({ dCreated: -1 }).skip(nSkip).limit(nLimit).lean()
    }

    return { nTotal, aResults }
  } catch (error) {
    console.log(error)
    return error
  }
}

controllers.getPlaylists = async (parent, { input }, context) => {
  try {
    const { oGetPlaylistsPaginationInput, eStatus } = input
    const { nSkip, nLimit, sorting, sSearch } = getPaginationValues(oGetPlaylistsPaginationInput)

    const query = {}
    query.eStatus = (!eStatus || (eStatus === 'all')) ? { $in: enums.eStatus.value } : eStatus

    const total = await PlayListsModel.countDocuments({
      $and: [{ sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      ],
      ...query
    })
    const data = await PlayListsModel.find({
      $and: [{ sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      ],
      ...query
    }).populate({ path: 'oCategory' }).sort(sorting).skip(nSkip).limit(nLimit).lean()

    return { nTotal: total, aResults: data }
  } catch (error) {
    return error
  }
}

controllers.topPlaylists = async (parent, { input }, context) => {
  try {
    const { oTopPlaylistsPaginationInput } = input
    const { nSkip, nLimit, sorting, sSearch } = getPaginationValues(oTopPlaylistsPaginationInput)

    const nTotal = await PlayListsModel.countDocuments({
      $and: [{ sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }],
      eStatus: 'a'
    })
    const aResults = await PlayListsModel.find({
      $and: [{ sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }],
      eStatus: 'a'
    }).populate({ path: 'oCategory' }).sort(sorting).skip(nSkip).limit(nLimit).lean()

    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

/**
 * This service is in used for website user category wise and without category wise video list.
 * @param {*} param1 { input } for pagination filter
 * @returns This service will return category wise and without category wise video list.
 */
controllers.listCategoryWiseVideo = async (parent, { input }, context) => {
  try {
    const { nSkip, nLimit, sorting } = getPaginationValues(input)
    const sSortBy = !input?.sSortBy ? 'dCreated' : input.sSortBy
    const sSorting = !sorting ? { dCreated: -1 } : sorting

    const [data] = await VideosModel.aggregate([
      {
        $group: { _id: '$iCategoryId' }
      }, {
        $count: 'nTotal'
      }]).allowDiskUse(ALLOW_DISK_USE)
    const aResults = await VideosModel.aggregate([
      {
        $lookup: {
          from: 'playlists',
          localField: 'iPlaylistId',
          foreignField: '_id',
          as: 'playlist'
        }
      },
      { $sort: sSorting }, {
        $group: {
          _id: '$iCategoryId',
          sName: {
            $first: '$playlist.sTitle'
          },
          [sSortBy]: {
            $first: `$${sSortBy}`
          },
          iPlaylistId: {
            $first: '$playlist._id'
          },
          dNewVideoDate: {
            $first: '$playlist.dNewVideoDate'
          },
          aVideos: {
            $push: '$$ROOT'
          }
        }
      },
      { $sort: { dNewVideoDate: -1 } },
      { $skip: parseInt(nSkip) },
      { $limit: parseInt(nLimit) },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'oCategory'
        }
      }, {
        $unwind: {
          path: '$oCategory',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,
          nTotal: 1,
          sName: { $arrayElemAt: ['$sName', 0] },
          iPlaylistId: { $arrayElemAt: ['$iPlaylistId', 0] },
          aVideos: { $slice: ['$aVideos', 4] },
          oCategory: 1
        }
      }
    ]).allowDiskUse(ALLOW_DISK_USE)

    return { nTotal: data?.nTotal || 0, aResults }
  } catch (error) {
    return error
  }
}

/**
 * This service is in used for website user to get without category wise video list(playlist wise video list).
 * @param {*} param1 { input } for pagination filter
 * @returns This service will return without category wise video list(playlist wise video list) and particular playlist details.
 */
controllers.listWithoutCategoryVideo = async (parent, { input }, context) => {
  try {
    const { oInput, iPlaylistId } = input
    const { nSkip, nLimit, sorting, sSearch } = getPaginationValues(oInput)

    const query = { iPlaylistId, eStatus: 'a' }

    const oPlaylist = await PlayListsModel.findById(iPlaylistId, { sTitle: 1, sDescription: 1, sEmbedUrl: 1, dPublishDate: 1 }).lean()
    const nTotal = await VideosModel.countDocuments({
      $and: [
        { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        query
      ]
    })
    const aResults = await VideosModel.find({
      $and: [
        { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        query
      ]
    }).sort(sorting).skip(nSkip).limit(nLimit).lean()

    return { nTotal, aResults, oPlaylist }
  } catch (error) {
    return error
  }
}

controllers.bulkPlaylistUpdate = async (parent, { input }, context) => {
  try {
    const { eStatus } = input
    let { aId } = input
    aId = aId.map(id => _.mongify(id))

    const category = await PlayListsModel.updateMany({ _id: aId }, { eStatus })
    const categories = await PlayListsModel.find({ _id: aId })

    for (const ele of categories) {
      await grpcControllers.updateEntitySeo({ iId: ele, eStatus })
      // queuePush('updateEntitySeo', { iId: ele, eStatus })
    }

    if (!category.modifiedCount) _.throwError('notFound', context, 'playList')
    await VideosModel.updateMany({ iPlaylistId: { $in: aId } }, { eStatus })
    const videos = await VideosModel.find({ iPlaylistId: { $in: aId } })

    for (const ele of videos) {
      await grpcControllers.updateEntitySeo({ iId: ele, eStatus })
      // queuePush('updateEntitySeo', { iId: ele, eStatus })
    }

    return _.resolve('updateSuccess', null, 'playList', context)
  } catch (error) {
    return error
  }
}

controllers.updatePlaylist = async (parent, { input }, context) => {
  try {
    const { _id, eStatus, iCategoryId } = input

    const updateQuery = {}
    if (eStatus) updateQuery.eStatus = eStatus
    updateQuery.iCategoryId = iCategoryId

    const playlist = await PlayListsModel.updateOne({ _id }, updateQuery)
    await grpcControllers.updateEntitySeo({ iId: _id, eStatus })
    // queuePush('updateEntitySeo', { iId: _id, eStatus })
    if (!playlist.modifiedCount) _.throwError('notFound', context, 'playList')
    if (iCategoryId) {
      await VideosModel.updateMany({ iPlaylistId: _.mongify(_id) }, updateQuery)
      const latestVideo = await VideosModel.find({ iPlaylistId: _.mongify(_id) }).sort({ dPublishDate: -1 }).limit(1)
      await PlayListsModel.updateOne({ _id }, { dNewVideoDate: latestVideo.dPublishDate })
    }

    return _.resolve('updateSuccess', null, 'playList', context)
  } catch (error) {
    return error
  }
}

controllers.listSeriesVideos = async (parent, { input }, context) => {
  try {
    const { iSeriesId, oVideoInput } = input

    const { nSkip, nLimit, sorting } = getPaginationValues(oVideoInput)

    const category = await CategoriesModel.find({ iSeriesId }, { _id: 1 }).lean()
    const categoryIds = category.map(({ _id }) => _id)

    const nTotal = await VideosModel.countDocuments({ iCategoryId: { $in: categoryIds } })
    const aResults = await VideosModel.find({ iCategoryId: { $in: categoryIds } }).sort(sorting).skip(nSkip).limit(nLimit).lean()

    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.listSimpleCategoryVideos = async (parent, { input }, context) => {
  try {
    const { iId, oVideoInput } = input
    const { nSkip, nLimit, sorting } = getPaginationValues(oVideoInput)

    let aResults
    let nTotal = await VideosModel.countDocuments({ iCategoryId: iId })
    if (!nTotal) {
      nTotal = await VideosModel.countDocuments({ eStatus: 'a' })
      aResults = await VideosModel.find({ eStatus: 'a' }).sort(sorting).skip(nSkip).limit(nLimit).lean()
    } else {
      aResults = await VideosModel.find({ iCategoryId: iId }).sort(sorting).skip(nSkip).limit(nLimit).lean()
    }

    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.getVideoSearch = async (parent, { input }, context) => {
  try {
    const { nSkip, nLimit, sSearch } = getPaginationValues(input)
    if (!sSearch) return []

    const query = { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') }, eStatus: 'a' }

    const aResults = await VideosModel.find(query).sort({ dCreated: -1 }).skip(nSkip).limit(nLimit)
    return { aResults }
  } catch (error) {
    return error
  }
}

controllers.getTrendingVideos = async (parent, { input }, context) => {
  try {
    const { nSkip, nLimit } = getPaginationValues(input)
    const sort = !input?.sSortBy ? { 'oStats.nViewCount': -1 } : { dCreated: -1 }
    let aResults2 = []
    const aResults1 = await VideosModel.find({ eStatus: 'a', dPublishDate: { $gte: new Date(moment().subtract(10, 'days')) } }).sort(sort).skip(nSkip).limit(nLimit).lean()

    if (aResults1.length < nLimit) {
      aResults2 = await VideosModel.aggregate([
        { $match: { eStatus: 'a' } },
        { $sort: sort },
        { $limit: 1000 },
        { $sample: { size: nLimit - aResults1.length } }
      ])
    }

    return { aResults: [...aResults1, ...aResults2] }
  } catch (error) {
    return error
  }
}

controllers.makeHomePageVideo = async (parent, { input }, context) => {
  try {
    const activeVideoQuery = {
      eStatus: 'a',
      iCategoryId: { $ne: null }
    }
    const $sort = { dNewVideoDate: -1 }
    const nLimit = 100

    let homepage = []
    const aResults = await PlayListsModel.aggregate([{
      $match: activeVideoQuery
    }, {
      $lookup: {
        from: 'categories',
        localField: 'iCategoryId',
        foreignField: '_id',
        as: 'oCategory'
      }
    }, {
      $unwind: {
        path: '$oCategory'
      }
    }, {
      $project: {
        _id: '$oCategory._id',
        sName: '$sTitle',
        iPlaylistId: '$_id',
        oCategory: '$oCategory',
        dNewVideoDate: 1
      }
    }, {
      $sort
    }]).allowDiskUse(ALLOW_DISK_USE)
    const nCategoriesLength = aResults.length
    for (let index = 0; index < nCategoriesLength; index++) {
      const ele = aResults[index]
      let temp = {}
      temp = {
        _id: ele._id,
        sName: ele.sName,
        nPriority: index + 1,
        iPlaylistId: ele.iPlaylistId,
        oCategory: ele.oCategory,
        aVideos: []
      }

      const [getModel] = await HomePageModels.aggregate([{ $sample: { size: 1 } }, { $project: { dCreated: 0, dUpdated: 0, _id: 0, __v: 0 } }])
      const model = await VideosModel.find({ ...activeVideoQuery, iCategoryId: ele._id }).limit(nLimit).sort({ dPublishDate: -1 }).populate('oCategory').lean()
      if (getModel.nTotal <= model.length) continue
      Object.keys(getModel).forEach((elem) => {
        if (getModel[elem] > 0 && elem !== 'nCount') {
          let spliceVideo = model.splice(0, getModel[elem])
          spliceVideo = spliceVideo.map((ele) => {
            ele.sType = elem
            return ele
          })
          temp.aVideos.push(...spliceVideo)
        }
      })

      homepage.push(temp)
    }

    const customSort = ['IPL 2023']

    homepage = homepage.sort((a, b) => {
      if (customSort.includes(a.sName)) return -1
      else return 1
    })

    const isExist = await redis.redisArticleDb.get('homePageVideo')
    if (isExist) await redis.redisArticleDb.del('homePageVideo')
    await redis.redisArticleDb.setex('homePageVideo', CACHE_2H, JSON.stringify(homepage))
    return homepage
  } catch (error) {
    return error
  }
}

controllers.getHomePageVideo = async (parent, { input }, context) => {
  try {
    if (!input) input = {}

    if (!input?.nSkip) input.nSkip = 0
    if (!input?.nLimit) input.nLimit = 10

    const { nSkip, nLimit } = getPaginationValues(input)

    let homepage = await redis.redisArticleDb.get('homePageVideo')
    if (homepage) {
      homepage = _.parse(homepage)
      const aResults = homepage.slice(nSkip, (nSkip + nLimit))
      const nTotal = homepage.length
      return { aResults, nTotal }
    }

    const data = await controllers.makeHomePageVideo(null, {}, null)
    const nTotal = data.length
    const aResults = data.slice(nSkip, (nSkip + nLimit))
    return { aResults, nTotal }
  } catch (error) {
    return error
  }
}

controllers.getVideoByPlaylist = async (parent, { input }, context) => {
  try {
    const { iPlaylistId } = input
    const [video] = await VideosModel.find({ iPlaylistId: _.mongify(iPlaylistId) }).populate('oPlaylist').sort({ dCreated: -1 }).limit(1).lean()
    if (!video) _.throwError('notFound', context, 'video')
    return video
  } catch (error) {
    return error
  }
}

controllers.getPlaylistByIdFront = async (parent, { input }, context) => {
  try {
    if (!input?._id) _.throwError('requiredField', context)

    const playlist = await PlayListsModel.findById(input._id).lean()
    if (!playlist) _.throwError('notFound', context, 'Playlist')

    return playlist
  } catch (error) {
    return error
  }
}

module.exports = controllers
