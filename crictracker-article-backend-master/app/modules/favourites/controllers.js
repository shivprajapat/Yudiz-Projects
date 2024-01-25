const { userfavourites: UserFavouritesModel, tags: TagsModel, categories: CategoryModel } = require('../../model')
const _ = require('../../../global')
const { getPaginationValues } = require('../../utils/lib/services')
const { CACHE_7 } = require('../../../config')

const controllers = {}

controllers.addFavourite = async (parent, { input }, context) => {
  try {
    if (!input) _.throwError('inputRequired', context)

    const { iId, eType } = input
    if (!iId || !eType) _.throwError('requiredField', context)

    const { decodedToken } = context
    if (!decodedToken?.iUserId) _.throwError('invalidToken', context)

    const pageExist = await UserFavouritesModel.findOne({ iUserId: _.mongify(decodedToken?.iUserId), iId: _.mongify(iId), eType })

    if (pageExist) _.throwError('alreadyAddedToFavourite', context)

    let dataExist
    if (['as', 's', 'pct'].includes(eType)) {
      dataExist = await CategoryModel.findOne({ _id: _.mongify(iId) }).lean().cache(CACHE_7, `categoryData:${iId}`)
    } else {
      dataExist = await TagsModel.findOne({ $or: [{ _id: _.mongify(iId) }, { iId: _.mongify(iId) }] }).lean().cache(CACHE_7, `tag:${eType}:${iId}`)
    }

    if (!dataExist) _.throwError('invalidPage', context)

    await UserFavouritesModel.create({ iId, eType, iUserId: _.mongify(decodedToken?.iUserId) })
    return _.resolve('pageAddedToFavourite', null, null, context)
  } catch (error) {
    return error
  }
}

controllers.deleteFavourite = async (parent, { input }, context) => {
  try {
    if (!input) _.throwError('inputRequired', context)

    const { iPageId } = input
    if (!iPageId) _.throwError('requiredField', context)

    const { decodedToken } = context
    if (!decodedToken?.iUserId) _.throwError('invalidToken', context)

    const pageExist = await UserFavouritesModel.findOne({ iUserId: _.mongify(decodedToken?.iUserId), iId: _.mongify(iPageId) })

    if (!pageExist) _.throwError('notFound', context, 'favourite')

    await UserFavouritesModel.deleteOne({ iId: _.mongify(iPageId), iUserId: _.mongify(decodedToken?.iUserId) })
    return _.resolve('favouriteDeleted', { oData: { _id: pageExist?.iId } }, null, context)
  } catch (error) {
    return error
  }
}

controllers.listFavourite = async (parent, { input }, context) => {
  try {
    const { decodedToken } = context
    if (!decodedToken?.iUserId) _.throwError('invalidToken', context)

    const { nLimit, nSkip } = getPaginationValues(input, context)

    const query = { iUserId: _.mongify(decodedToken?.iUserId) }

    const nTotal = await UserFavouritesModel.countDocuments(query)
    const aResults = await UserFavouritesModel.aggregate(
      [
        {
          $match: query
        }, {
          $facet: {
            categories: [
              {
                $lookup: {
                  from: 'categories',
                  localField: 'iId',
                  foreignField: '_id',
                  as: 'category'
                }
              }, {
                $unwind: {
                  path: '$category'
                }
              }, {
                $project: {
                  sName: '$category.sName',
                  iId: '$iId',
                  eType: '$category.eType',
                  dCreated: '$dCreated',
                  iPageId: '$iId'
                }
              }
            ],
            tags: [
              {
                $lookup: {
                  from: 'tags',
                  let: {
                    tagId: '$iId'
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $or: [{ $eq: ['$iId', '$$tagId'] }, { $eq: ['$_id', '$$tagId'] }]
                        }
                      }
                    }
                  ],
                  as: 'tag'
                }
              }, {
                $unwind: {
                  path: '$tag'
                }
              }, {
                $project: {
                  iId: { $cond: { if: { $eq: ['$eType', 'gt'] }, then: '$iId', else: '$tag.iId' } },
                  eType: '$tag.eType',
                  sName: '$tag.sName',
                  dCreated: '$dCreated',
                  iPageId: '$iId'
                }
              }
            ]
          }
        }, {
          $project: {
            data: {
              $concatArrays: [
                '$categories', '$tags'
              ]
            }
          }
        },
        {
          $unwind: {
            path: '$data'
          }
        }, {
          $replaceRoot: {
            newRoot: '$data'
          }
        },
        {
          $sort: {
            dCreated: -1
          }
        }, {
          $skip: nSkip
        }, {
          $limit: nLimit
        }
      ]
    )

    return aResults?.length ? { aResults: aResults, nTotal } : { aResults: [], nTotal: 0 }
  } catch (error) {
    return error
  }
}

module.exports = controllers
