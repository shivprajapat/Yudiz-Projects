/* eslint-disable no-useless-escape */
const _ = require('../../../global')
const { redis, queuePush } = require('../../utils')
const moment = require('moment')
const { wptags: WpTagsModel, categories: CategoryModel, seo: SeoModel, homepages: HomePagesModel, articles, homepagemodels: HomePageModels, matches: MatchModel, tags: TagsModel, series: SeriesModel, StickyModel, HomePagePriorityModel } = require('../../../models-routes-services/models')
const controllers = {}

controllers.getPermissions = (context) => {
  try {
    const { authorization } = context.headers
    if (!authorization) _.throwError('requiredField', context)
    const { decodedToken } = context
    if (!decodedToken || decodedToken === 'jwt expired' || !decodedToken.iAdminId || decodedToken === 'invalid signature' || decodedToken === 'jwt malformed') _.throwError('authorizationError', context)
    return { data: decodedToken }
  } catch (error) {
    return { isError: true, error }
  }
}

controllers.mergeTag = async (parent, { input }, context) => {
  try {
    const { _id } = input
    const tags = await WpTagsModel.findOne({ _id: _.mongify(_id) }).lean()

    if (!tags) _.throwError('notFound', context, 'tag')
    const seo = await SeoModel.findOne({ sSlug: tags.slug, eType: 'ct', eStatus: 'a' }).lean()
    if (!seo) {
      const newCategory = {
        sName: tags?.name,
        eType: 's',
        eStatus: 'a',
        nCount: tags?.count,
        sContent: tags?.description
      }
      const category = await CategoryModel.create(newCategory)
      const newSeo = {
        sTitle: tags?.name,
        sSlug: tags?.slug,
        iId: category?._id,
        eType: 'ct',
        eStatus: 'a',
        sDescription: tags?.description
      }
      await SeoModel.create(newSeo)
    }
    await WpTagsModel.deleteOne({ _id })
    return _.resolve('successfully', null, 'mergeTag', context)
  } catch (error) {
    return error
  }
}

// controllers.makeHomePageArticle = async (parent, { input }, context) => {
//   try {
//     const noMatchesFoundCategoryQuery = {
//       eState: 'pub',
//       iCategoryId: { $ne: null }
//     }

//     const priorityArray = [
//       '635cb104ca5994a60a333282',
//       '633a8fea416004a3eeefd542',
//       '635fc3b1e3998a6ce3d63735',
//       '635f5a52b92e02d42b186fba',
//       '622dcc3609a36f4f3cc35d9f'
//     ]

//     const [getModel] = await HomePageModels.aggregate([{ $match: { eStatus: 'a' } }, { $sample: { size: 1 } }, { $project: { dCreated: 0, dUpdated: 0, _id: 0, __v: 0 } }])
//     const latestArticles = await articles.find(noMatchesFoundCategoryQuery).hint({ dPublishDate: -1 }).limit(getModel.nCount).populate('iCategoryId').lean()

//     const homepage = []

//     homepage.push({
//       sName: 'Latest Updates',
//       nPriority: 0,
//       aArticle: latestArticles
//     })

//     Object.keys(getModel).forEach((elem) => {
//       if (getModel[elem] > 0 && elem !== 'nCount') {
//         let spliceArticle = latestArticles.splice(0, getModel[elem])
//         spliceArticle = spliceArticle.map((ele) => {
//           SeoModel.findOne({ iId: _.mongify(ele._id) }).then((seo) => {
//             ele.oSeo = {}
//             ele.oSeo.sSlug = seo?.sSlug
//           })
//           ele.sType = elem
//           return ele
//         })
//         homepage[0].aArticle.push(...spliceArticle)
//       }
//     })

//     const excludedArticle = []
//     excludedArticle.push(...latestArticles.map((ele) => ele._id.toString()))

//     const startDate = moment.utc().subtract(1, 'days').toDate()
//     const endDate = moment.utc().add(1, 'days').toDate()

//     let lastMatches = await MatchModel.find({ dStartDate: { $gt: startDate, $lt: endDate } }, { iSeriesId: 1 }).sort({ dStartDate: -1 }).lean()
//     const aSeries = []

//     lastMatches = [...new Set(lastMatches.filter(ele => ele.iSeriesId).map((ele) => ele.iSeriesId.toString()))]

//     priorityArray.forEach((ele) => {
//       lastMatches = lastMatches.filter((elem) => elem !== ele)
//       lastMatches.unshift(ele)
//     })

//     const categories = []
//     const seriesCategoryArr = []

//     if (lastMatches.length) {
//       for await (const ele of lastMatches) {
//         const category = await CategoryModel.findOne({ iSeriesId: ele }).lean()
//         if (category) aSeries.push(category)
//       }

//       for (let index = 0; index < aSeries.length; index++) {
//         const ele = aSeries[index]
//         const seriesCategory = {
//           eState: 'pub',
//           aSeries: ele._id
//         }

//         const countArticle = await articles.countDocuments(seriesCategory)

//         if (countArticle) {
//           let temp = {}
//           const seo = await SeoModel.findOne({ iId: _.mongify(ele._id) }).lean()

//           const [getModel] = await HomePageModels.aggregate([{ $match: { eStatus: 'a' } }, { $sample: { size: 1 } }, { $project: { dCreated: 0, dUpdated: 0, _id: 0, __v: 0 } }])
//           const model = await articles.find({ ...seriesCategory, _id: { $nin: excludedArticle } }).sort({ dPublishDate: -1 }).limit(getModel.nCount).lean()
//           if (getModel.nCount > model.length) continue

//           temp = {
//             iCategoryId: ele._id,
//             sName: ele.sName,
//             nPriority: index + 1,
//             eType: ele.eType,
//             sSlug: seo?.sSlug,
//             aArticle: []
//           }

//           if (temp.eType === 'as') {
//             temp.iSeriesId = ele.iSeriesId
//             temp.bScoreCard = false
//             seriesCategoryArr.push(ele.iSeriesId)
//           }

//           for await (const elem of Object.keys(getModel)) {
//             if (getModel[elem] > 0 && elem !== 'nCount') {
//               let spliceArticle = model.splice(0, getModel[elem])
//               spliceArticle = spliceArticle.map((ele) => {
//                 SeoModel.findOne({ iId: _.mongify(ele._id) }).then((seo) => {
//                   ele.oSeo = {}
//                   ele.oSeo.sSlug = seo?.sSlug
//                 })
//                 ele.sType = elem
//                 return ele
//               })
//               temp.aArticle.push(...spliceArticle)
//             }
//           }
//           homepage.push(temp)
//           excludedArticle.push(...temp.aArticle.map((ele) => ele._id.toString()))
//         }
//       }
//     }

//     let article = await articles.find(noMatchesFoundCategoryQuery, { _id: 0, iCategoryId: 1 }).hint({ dPublishDate: -1 }).limit(500)

//     article = article.map((ele) => {
//       return ele.iCategoryId.toString()
//     })

//     const map = article.reduce((acc, e) => acc.set(e, (acc.get(e) || 0) + 1), new Map())
//     article = Array.from(map, ([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count)

//     for (let index = 0; index < article.length; index++) {
//       const ele = article[index]
//       const countArticle = await articles.countDocuments({ iCategoryId: _.mongify(ele.category), eStatus: 'a', eState: 'pub' })
//       const lastArticle = homepage[homepage.length - 1]
//       if (countArticle) {
//         categories.push({ ...ele, priority: lastArticle.nPriority + index + 1 })
//       }
//     }

//     for (let index = 0; index < categories.length; index++) {
//       const ele = categories[index]
//       let temp = {}
//       const getCategory = await CategoryModel.findOne({ _id: _.mongify(ele.category), eStatus: 'a' }).lean()
//       if (!getCategory) {
//         console.log(ele)
//       } else {
//         const seo = await SeoModel.findOne({ iId: _.mongify(ele.category) }).lean()

//         const [getModel] = await HomePageModels.aggregate([{ $match: { eStatus: 'a' } }, { $sample: { size: 1 } }, { $project: { dCreated: 0, dUpdated: 0, _id: 0, __v: 0 } }])
//         const model = await articles.find({ eStatus: 'a', iCategoryId: _.mongify(getCategory._id), eState: 'pub', _id: { $nin: excludedArticle } }).sort({ dPublishDate: -1 }).limit(getModel.nCount).populate('iCategoryId').lean()

//         if (getModel.nTotal > model.length) {
//           continue
//         }

//         temp = {
//           iCategoryId: getCategory._id,
//           sName: getCategory.sName,
//           nPriority: ele.priority,
//           eType: getCategory.eType,
//           sSlug: seo?.sSlug,
//           aArticle: []
//         }

//         if (temp.eType === 'as') {
//           temp.iSeriesId = getCategory.iSeriesId
//           temp.bScoreCard = true
//           seriesCategoryArr.push(getCategory.iSeriesId)
//         }

//         for await (const elem of Object.keys(getModel)) {
//           if (getModel[elem] > 0 && elem !== 'nCount') {
//             let spliceArticle = model.splice(0, getModel[elem])
//             spliceArticle = spliceArticle.map((ele) => {
//               SeoModel.findOne({ iId: _.mongify(ele._id) }).then((seo) => {
//                 ele.oSeo = {}
//                 ele.oSeo.sSlug = seo?.sSlug
//               })
//               ele.sType = elem
//               return ele
//             })
//             temp.aArticle.push(...spliceArticle)
//           }
//         }

//         homepage.push(temp)
//       }
//     }

//     const bIsHomepageData = await HomePagesModel.countDocuments({})
//     if (bIsHomepageData) await HomePagesModel.deleteMany({})
//     HomePagesModel.insertMany(homepage).then(async () => {
//       console.log('done')
//       seriesCategoryArr.forEach((ele) => {
//         queuePush('seriesCategory', { iSeriesId: ele })
//       })
//       await redis.redisArticleDb.setex('homepage', 3600, JSON.stringify(homepage))
//     })
//     return 'done'
//   } catch (error) {
//     return error
//   }
// }

controllers.makeHomePageArticle = async (parent, { input }, context) => {
  try {
    const prepareHomePageModel = async (property, query, excludedArticle, nPriority, seriesCategoryArr, PorT) => {
      let temp = {}
      const seo = await SeoModel.findOne({ iId: _.mongify(PorT ? property.iId : property._id), eType: { $ne: 'cu' }, eSubType: null }).lean()
      const [getModel] = await HomePageModels.aggregate([{ $match: { eStatus: 'a' } }, { $sample: { size: 1 } }, { $project: { dCreated: 0, dUpdated: 0, _id: 0, __v: 0 } }])
      const model = await articles.find({ ...query, _id: { $nin: excludedArticle } }).sort({ dPublishDate: -1 }).limit(getModel.nCount).lean()
      if (getModel.nCount > model.length) {
        return { seriesCategoryArr, temp: undefined, excludedArticle }
      }

      temp = {
        iCategoryId: PorT ? property.iId : property._id,
        sName: property.sName,
        nPriority,
        eType: property.eType,
        sSlug: seo?.sSlug,
        aArticle: []
      }

      if (temp.eType === 'as') {
        temp.iSeriesId = property.iSeriesId
        temp.bScoreCard = false
        seriesCategoryArr.push(property.iSeriesId)
      }

      for await (const elem of Object.keys(getModel)) {
        if (getModel[elem] > 0 && elem !== 'nCount') {
          let spliceArticle = model.splice(0, getModel[elem])
          spliceArticle = spliceArticle.map((ele) => {
            SeoModel.findOne({ iId: _.mongify(ele._id), eType: { $ne: 'cu' }, eSubType: null }).then((seo) => {
              ele.oSeo = {}
              ele.oSeo.sSlug = seo?.sSlug
            })
            ele.sType = elem
            return ele
          })
          temp.aArticle.push(...spliceArticle)
        }
      }
      excludedArticle.push(...temp.aArticle.map((ele) => ele._id.toString()))
      return { temp, seriesCategoryArr, excludedArticle }
    }

    const prepareCountModelArticle = async (articles, seriesCategoryArr) => {
      const countObj = []
      const seriesCategory = []
      for (const series of seriesCategoryArr) {
        const category = await SeriesModel.findOne({ _id: series }).lean()
        seriesCategory.push(category?.iCategoryId)
      }

      for (const article of articles) {
        // for (const series of article.aSeries) {
        //   if (seriesCategory.findIndex((ele) => ele.toString() === series.toString()) < 0) {
        //     const primaryIndex = countObj.findIndex((ele) => ele._id.toString() === series.toString())
        //     if (primaryIndex < 0) {
        //       countObj.push({ _id: series.toString(), eType: 'as', count: 0 })
        //     } else {
        //       countObj[primaryIndex].count += 1
        //     }
        //   }
        // }

        // for (const team of article.aTeam) {
        //   const primaryIndex = countObj.findIndex((ele) => ele._id.toString() === team.toString())
        //   if (primaryIndex < 0) {
        //     countObj.push({ _id: team.toString(), eType: 't', count: 0 })
        //   } else {
        //     countObj[primaryIndex].count += 1
        //   }
        // }

        // for (const venue of article.aVenue) {
        //   const primaryIndex = countObj.findIndex((ele) => ele._id.toString() === venue.toString())
        //   if (primaryIndex < 0) {
        //     countObj.push({ _id: venue.toString(), eType: 'v', count: 0 })
        //   } else {
        //     countObj[primaryIndex].count += 1
        //   }
        // }

        // for (const tags of article.aTags) {
        //   const primaryIndex = countObj.findIndex((ele) => ele._id.toString() === tags.toString())
        //   if (primaryIndex < 0) {
        //     countObj.push({ _id: tags.toString(), eType: 'gt', count: 0 })
        //   } else {
        //     countObj[primaryIndex].count += 1
        //   }
        // }

        const primaryIndex = countObj.findIndex((ele) => ele._id.toString() === article.iCategoryId.toString())
        if (primaryIndex < 0) {
          countObj.push({ _id: article.iCategoryId.toString(), eType: 'ct', count: 0 })
        } else {
          countObj[primaryIndex].count += 1
        }
      }
      return countObj.filter((ele) => ele.count > 5).sort((a, b) => b.count - a.count)
    }

    const noMatchesFoundCategoryQuery = {
      eState: 'pub',
      iCategoryId: { $ne: null }
    }

    const seriesCategoryArr = []

    const priorityArray = await HomePagePriorityModel.find({}, { _id: 0, iId: 1, eType: 1 }).sort({ nSort: 1 }).lean()

    const getHomePageStickyArticle = await StickyModel.find({ 'oSticky.bHome': true, iArticleId: { $exists: true } }).populate('oArticle').lean()
    let getHomePageStickyVideo = await StickyModel.find({ 'oSticky.bHome': true, iVideoId: { $exists: true } }).populate({ path: 'oVideo', populate: 'oCategory' }).lean()

    if (getHomePageStickyArticle.length) Object.assign(noMatchesFoundCategoryQuery, { _id: { $nin: getHomePageStickyArticle.map((ele) => ele.iArticleId) } })
    const [getModel] = await HomePageModels.aggregate([{ $match: { eStatus: 'a' } }, { $sample: { size: 1 } }, { $project: { dCreated: 0, dUpdated: 0, _id: 0, __v: 0 } }])
    const latestArticles = await articles.find(noMatchesFoundCategoryQuery).hint({ dPublishDate: -1 }).limit(getModel.nCount).populate('iCategoryId').lean()
    const oldLength = latestArticles.length
    const homepage = []

    if (getHomePageStickyArticle.length || getHomePageStickyVideo.length) {
      if (getHomePageStickyVideo.length) {
        getHomePageStickyVideo = getHomePageStickyVideo.map((ele) => {
          const video = ele.oVideo
          const category = ele.oVideo.oCategory
          console.log(video.sCaption)
          return {
            _id: video._id,
            sTitle: video.sTitle,
            sSrtTitle: video.sCaption === 'false' || !video.sCaption ? video.sTitle : video.sCaption,
            sDescription: video.sDescription,
            oImg: {
              sUrl: video.sThumbnailUrl,
              sText: video.sCaption,
              sCaption: video.sCaption,
              sAttribute: video.sCaption
            },
            nDuration: +video.nDurationSeconds,
            dPublishDate: video.dPublishDate,
            dPublishDisplayDate: video.dPublishDate,
            oCategory: {
              sName: category.sName,
              _id: category._id
            },
            oTImg: {
              sUrl: video.sThumbnailUrl,
              sText: video.sCaption,
              sCaption: video.sCaption,
              sAttribute: video.sCaption
            }
          }
        })
      }

      // a.oArticle.dPublishDisplayDate ? new Date(a.oArticle.dPublishDisplayDate).getTime() : new Date(a.oArticle.dPublishDate).getTime() - b.oArticle.dPublishDisplayDate ? new Date(b.oArticle.dPublishDisplayDate).getTime() : new Date(b.oArticle.dPublishDate).getTime()
      const articleAndVideos = [...getHomePageStickyVideo, ...getHomePageStickyArticle.map((ele) => ele.oArticle)].sort((b, a) => +new Date(a.dPublishDisplayDate || a.dPublishDate) - +new Date(b.dPublishDisplayDate || b.dPublishDate))

      latestArticles.unshift(...articleAndVideos)

      latestArticles.splice(oldLength)
    }

    homepage.push({
      sName: 'Latest Updates',
      nPriority: 0,
      aArticle: latestArticles
    })

    Object.keys(getModel).forEach((elem) => {
      if (getModel[elem] > 0 && elem !== 'nCount') {
        let spliceArticle = latestArticles.splice(0, getModel[elem])
        spliceArticle = spliceArticle.map((ele) => {
          SeoModel.findOne({ iId: _.mongify(ele._id), eType: { $ne: 'cu' }, eSubType: null }).then((seo) => {
            ele.oSeo = {}
            ele.oSeo.sSlug = seo?.sSlug
          })
          ele.sType = elem
          return ele
        })
        homepage[0].aArticle.push(...spliceArticle)
      }
    })

    const excludedArticle = []
    excludedArticle.push(...latestArticles.map((ele) => ele._id.toString()))

    for (const priorities of priorityArray) {
      let homeObj = {}
      if (priorities.eType === 'as') {
        const category = await CategoryModel.findOne({ _id: _.mongify(priorities.iId), eStatus: 'a' }).lean()
        if (category?.iSeriesId) {
          const seriesQuery = {
            aSeries: _.mongify(priorities.iId),
            eState: 'pub'
          }
          const allArticlesCount = await articles.countDocuments(seriesQuery)
          if (allArticlesCount) {
            homeObj = await prepareHomePageModel(category, seriesQuery, excludedArticle, homepage.length + 1, seriesCategoryArr)
            if (homeObj.temp) homepage.push(homeObj.temp)
            if (homeObj.seriesCategoryArr.length !== seriesCategoryArr.length) seriesCategoryArr.push(...homeObj.seriesCategoryArr)
            if (homeObj.excludedArticle.length !== excludedArticle.length) excludedArticle.push(...homeObj.excludedArticle)
          }
        }
      }

      if (priorities.eType === 'ct') {
        const category = await CategoryModel.findOne({ _id: _.mongify(priorities.iId), eStatus: 'a' }).lean()
        const seriesQuery = {
          iCategoryId: _.mongify(priorities.iId),
          eState: 'pub'
        }
        const allArticlesCount = await articles.countDocuments(seriesQuery)
        if (allArticlesCount) {
          homeObj = await prepareHomePageModel(category, seriesQuery, excludedArticle, homepage.length + 1, seriesCategoryArr)
          if (homeObj.temp) homepage.push(homeObj.temp)
          if (homeObj.seriesCategoryArr.length !== seriesCategoryArr.length) seriesCategoryArr.push(...homeObj.seriesCategoryArr)
          if (homeObj.excludedArticle.length !== excludedArticle.length) excludedArticle.push(...homeObj.excludedArticle)
        }
      }

      if (priorities.eType === 'p') {
        const playerTag = await TagsModel.findOne({ _id: _.mongify(priorities.iId), eType: 'p', eStatus: 'a' }).lean()
        const playerQuery = {
          aPlayer: _.mongify(priorities?.iId),
          eState: 'pub'
        }
        const allArticlesCount = await articles.countDocuments(playerQuery)
        if (allArticlesCount) {
          homeObj = await prepareHomePageModel(playerTag, playerQuery, excludedArticle, homepage.length + 1, seriesCategoryArr, 'player')
          if (homeObj.temp) homepage.push(homeObj.temp)
          if (homeObj.seriesCategoryArr?.length !== seriesCategoryArr.length) seriesCategoryArr.push(...homeObj.seriesCategoryArr)
          if (homeObj.excludedArticle?.length !== excludedArticle.length) excludedArticle.push(...homeObj.excludedArticle)
        }
      }

      if (priorities.eType === 't') {
        const team = await TagsModel.findOne({ _id: _.mongify(priorities.iId), eType: 't', eStatus: 'a' }).lean()
        const teamQuery = {
          aTeam: _.mongify(priorities?.iId),
          eState: 'pub'
        }
        const allArticlesCount = await articles.countDocuments(teamQuery)
        if (allArticlesCount) {
          homeObj = await prepareHomePageModel(team, teamQuery, excludedArticle, homepage.length + 1, seriesCategoryArr, 'team')
          if (homeObj.temp) homepage.push(homeObj.temp)
          if (homeObj.seriesCategoryArr?.length !== seriesCategoryArr.length) seriesCategoryArr.push(...homeObj.seriesCategoryArr)
          if (homeObj.excludedArticle?.length !== excludedArticle.length) excludedArticle.push(...homeObj.excludedArticle)
        }
      }

      if (priorities.eType === 'v') {
        const venue = await TagsModel.findOne({ _id: _.mongify(priorities.iId), eType: 'v', eStatus: 'a' }).lean()
        const venueQuery = {
          aVenue: _.mongify(priorities?.iId),
          eState: 'pub'
        }
        const allArticlesCount = await articles.countDocuments(venueQuery)
        if (allArticlesCount) {
          homeObj = await prepareHomePageModel(venue, venueQuery, excludedArticle, homepage.length + 1, seriesCategoryArr, 'venue')
          if (homeObj.temp) homepage.push(homeObj.temp)
          if (homeObj.seriesCategoryArr?.length !== seriesCategoryArr.length) seriesCategoryArr.push(...homeObj.seriesCategoryArr)
          if (homeObj.excludedArticle?.length !== excludedArticle.length) excludedArticle.push(...homeObj.excludedArticle)
        }
      }

      if (priorities.eType === 'gt') {
        const tag = await TagsModel.findOne({ _id: _.mongify(priorities.iId), eStatus: 'a' }).lean()
        const tagQuery = {
          aTags: _.mongify(priorities?.iId),
          eState: 'pub'
        }
        const allArticlesCount = await articles.countDocuments(tagQuery)
        if (allArticlesCount) {
          homeObj = await prepareHomePageModel(tag, tagQuery, excludedArticle, homepage.length + 1, seriesCategoryArr)
          if (homeObj.temp) homepage.push(homeObj.temp)
          if (homeObj.seriesCategoryArr?.length !== seriesCategoryArr.length) seriesCategoryArr.push(...homeObj.seriesCategoryArr)
          if (homeObj.excludedArticle?.length !== excludedArticle.length) excludedArticle.push(...homeObj.excludedArticle)
        }
      }
    }

    // For matches of series category not added in homepagearticle
    const startDate = moment.utc().subtract(1, 'days').toDate()
    const endDate = moment.utc().add(1, 'days').toDate()

    let lastMatches = await MatchModel.find({ dStartDate: { $gt: startDate, $lt: endDate }, iSeriesId: { $nin: seriesCategoryArr } }, { iSeriesId: 1 }).sort({ dStartDate: -1 }).lean()
    lastMatches = [...new Set(lastMatches.filter(ele => ele.iSeriesId).map((ele) => ele.iSeriesId.toString()))]
    if (lastMatches.length) {
      for (let index = 0; index < lastMatches.length; index++) {
        let homeObj = {}
        const ele = lastMatches[index]
        const series = await SeriesModel.findOne({ _id: _.mongify(ele) })
        if (series?.iCategoryId) {
          const category = await CategoryModel.findOne({ _id: series?.iCategoryId }).lean()
          if (category) {
            const seriesCategory = {
              eState: 'pub',
              aSeries: _.mongify(category._id)
            }

            const countArticle = await articles.countDocuments(seriesCategory)
            if (countArticle) {
              homeObj = await prepareHomePageModel(category, seriesCategory, excludedArticle, homepage.length + 1, seriesCategoryArr)
              if (homeObj.temp) homepage.push(homeObj.temp)
              if (homeObj.seriesCategoryArr?.length !== seriesCategoryArr.length) seriesCategoryArr.push(...homeObj.seriesCategoryArr)
              if (homeObj.excludedArticle?.length !== excludedArticle.length) excludedArticle.push(...homeObj.excludedArticle)
            }
          }
        }
      }
    }

    // For Tags and categories not added in homepage
    const leftArticles = await articles.find({ eState: 'pub', dPublishDate: { $gt: startDate, $lt: endDate } }).lean()
    const countAccArticles = await prepareCountModelArticle(leftArticles, seriesCategoryArr)

    for (let index = 0; index < countAccArticles.length; index++) {
      const leftArticle = countAccArticles[index]
      let homeObj = {}
      if (leftArticle.eType === 'ct') {
        const category = await CategoryModel.findOne({ _id: _.mongify(leftArticle._id), eStatus: 'a' }).lean()
        const seriesQuery = {
          iCategoryId: _.mongify(leftArticle?._id),
          eState: 'pub'
        }
        const allArticlesCount = await articles.countDocuments(seriesQuery)
        if (allArticlesCount) homeObj = await prepareHomePageModel(category, seriesQuery, excludedArticle, homepage.length + 1, seriesCategoryArr)
        if (homeObj.temp) homepage.push(homeObj.temp)
        if (homeObj.seriesCategoryArr?.length !== seriesCategoryArr.length) seriesCategoryArr.push(...homeObj.seriesCategoryArr)
        if (homeObj.excludedArticle?.length !== excludedArticle.length) excludedArticle.push(...homeObj.excludedArticle)
      }

      if (leftArticle.eType === 'as') {
        const category = await CategoryModel.findOne({ _id: _.mongify(leftArticle._id), eStatus: 'a' }).lean()
        if (category?.iSeriesId) {
          const seriesQuery = {
            aSeries: _.mongify(leftArticle?._id),
            eState: 'pub'
          }
          const allArticlesCount = await articles.countDocuments(seriesQuery)
          if (allArticlesCount) homeObj = await prepareHomePageModel(category, seriesQuery, excludedArticle, homepage.length + 1, seriesCategoryArr)
          if (homeObj.temp) homepage.push(homeObj.temp)
          if (homeObj.seriesCategoryArr?.length !== seriesCategoryArr.length) seriesCategoryArr.push(...homeObj.seriesCategoryArr)
          if (homeObj.excludedArticle?.length !== excludedArticle.length) excludedArticle.push(...homeObj.excludedArticle)
        }
      }

      if (leftArticle.eType === 'p') {
        const playerTag = await TagsModel.findOne({ _id: _.mongify(leftArticle._id), eType: 'p', eStatus: 'a' }).lean()
        const playerQuery = {
          aPlayer: _.mongify(leftArticle?._id),
          eState: 'pub'
        }
        const allArticlesCount = await articles.countDocuments(playerQuery)
        if (allArticlesCount) homeObj = await prepareHomePageModel(playerTag, playerQuery, excludedArticle, homepage.length + 1, seriesCategoryArr, 'player')
        if (homeObj.temp) homepage.push(homeObj.temp)
        if (homeObj.seriesCategoryArr?.length !== seriesCategoryArr.length) seriesCategoryArr.push(...homeObj.seriesCategoryArr)
        if (homeObj.excludedArticle?.length !== excludedArticle.length) excludedArticle.push(...homeObj.excludedArticle)
      }

      if (leftArticle.eType === 't') {
        const team = await TagsModel.findOne({ _id: _.mongify(leftArticle._id), eType: 't', eStatus: 'a' }).lean()
        const teamQuery = {
          aTeam: _.mongify(leftArticle?._id),
          eState: 'pub'
        }
        const allArticlesCount = await articles.countDocuments(teamQuery)
        if (allArticlesCount) homeObj = await prepareHomePageModel(team, teamQuery, excludedArticle, homepage.length + 1, seriesCategoryArr, 'team')
        if (homeObj.temp) homepage.push(homeObj.temp)
        if (homeObj.seriesCategoryArr?.length !== seriesCategoryArr.length) seriesCategoryArr.push(...homeObj.seriesCategoryArr)
        if (homeObj.excludedArticle?.length !== excludedArticle.length) excludedArticle.push(...homeObj.excludedArticle)
      }

      if (leftArticle.eType === 'v') {
        const venue = await TagsModel.findOne({ _id: _.mongify(leftArticle._id), eType: 'v', eStatus: 'a' }).lean()
        const venueQuery = {
          aVenue: _.mongify(leftArticle?._id),
          eState: 'pub'
        }
        const allArticlesCount = await articles.countDocuments(venueQuery)
        if (allArticlesCount) homeObj = await prepareHomePageModel(venue, venueQuery, excludedArticle, homepage.length + 1, seriesCategoryArr, 'venue')
        if (homeObj.temp) homepage.push(homeObj.temp)
        if (homeObj.seriesCategoryArr?.length !== seriesCategoryArr.length) seriesCategoryArr.push(...homeObj.seriesCategoryArr)
        if (homeObj.excludedArticle?.length !== excludedArticle.length) excludedArticle.push(...homeObj.excludedArticle)
      }

      if (leftArticle.eType === 'gt') {
        const tag = await TagsModel.findOne({ _id: _.mongify(leftArticle._id), eStatus: 'a' }).lean()
        const seriesQuery = {
          aTags: _.mongify(leftArticle?._id),
          eState: 'pub'
        }
        const allArticlesCount = await articles.countDocuments(seriesQuery)
        if (allArticlesCount) homeObj = await prepareHomePageModel(tag, seriesQuery, excludedArticle, homepage.length + 1, seriesCategoryArr)
        if (homeObj.temp) homepage.push(homeObj.temp)
        if (homeObj.seriesCategoryArr?.length !== seriesCategoryArr.length) seriesCategoryArr.push(...homeObj.seriesCategoryArr)
        if (homeObj.excludedArticle?.length !== excludedArticle.length) excludedArticle.push(...homeObj.excludedArticle)
      }
    }

    const bIsHomepageData = await HomePagesModel.countDocuments({})
    if (bIsHomepageData) await HomePagesModel.deleteMany({})
    HomePagesModel.insertMany(homepage).then(async () => {
      console.log('done')
      seriesCategoryArr.forEach((ele) => {
        queuePush('seriesCategory', { iSeriesId: ele })
      })
      await redis.redisArticleDb.setex('homepage', 3600, JSON.stringify(homepage))
    })
    return 'done'
  } catch (error) {
    return error
  }
}

module.exports = controllers
