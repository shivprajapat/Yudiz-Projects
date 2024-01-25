// @ts-check
const ReviewModel = require('./model')
const UserModel = require('../user/model')
const { catchError, responseMessage, getPaginationValues } = require('../../helpers/utilityServices')
const { default: mongoose } = require('mongoose')
const driver = require('../../database/neo4j_driver')

class ReviewController {
  async add (req, res) {
    const session = driver.session()
    try {
      const { iReviewTo } = req?.body
      const [isUserExists] = await Promise.all([
        UserModel.findOne({ _id: iReviewTo }, { _id: 1 }).lean()
      ])
      const graphQueryParams = {
        id: iReviewTo
      }
      const iReviewedBy = req?.iCurrentUserId
      if (iReviewedBy === iReviewTo) return responseMessage(req, res, 'BadRequest', 'ReviewError')
      if (!isUserExists) return responseMessage(req, res, 'NotFound', 'NotFound', 'User')
      await ReviewModel.create({ ...req.body, iReviewedBy })
      const avgReview = await ReviewModel.aggregate(
        [
          {
            $match: {
              iReviewTo: new mongoose.Types.ObjectId(iReviewTo),
              eStatus: { $ne: 'D' }
            }
          },
          {
            $group:
            {
              _id: '$iReviewTo',
              avgReview: { $avg: '$nRating' },
              total: { $sum: 1 }
            }
          }
        ]
      )
      await UserModel.updateOne({ _id: iReviewTo }, { nAvgRating: avgReview?.[0]?.avgReview, nTotalReview: avgReview?.[0]?.total })
      await session.run(`match (u:User {id:$id}) set u.nAvgRating = ${avgReview?.[0]?.avgReview},u.nTotalReview=${avgReview?.[0]?.total}`, graphQueryParams)
      return responseMessage(req, res, 'Success', 'AddedSuccessfully', 'Review')
    } catch (error) {
      return catchError(req, res)
    } finally {
      await session.close()
    }
  }

  async list (req, res) {
    try {
      const { eOperationType } = req?.query
      const { nPage, nLimit, oSorting } = getPaginationValues(req.query)
      const matchStage = { eStatus: { $ne: 'D' } }
      const currentUserId = req?.iCurrentUserId
      if (eOperationType === 'G') {
        matchStage.iReviewedBy = currentUserId
      } else if (eOperationType === 'R') {
        matchStage.iRequestTo = currentUserId
      }
      const projectStage = {
        sDescription: 1,
        nRating: 1,
        'oReviewBy.sName': 1,
        'oReviewBy._id': 1,
        'oReviewTo.sName': 1,
        'oReviewTo._id': 1
      }
      const queryStage = [
        {
          $match: matchStage
        },
        {
          $lookup: {
            from: 'users',
            localField: 'iReviewTo',
            foreignField: '_id',
            as: 'oReviewTo'
          }
        },
        {
          $unwind: {
            path: '$oReviewTo',
            preserveNullAndEmptyArrays: true
          }
        }
      ]

      const response = await ReviewModel.aggregate([
        {
          $facet: {
            aRequestList: [
              ...queryStage,
              {
                $sort: oSorting
              },
              {
                $skip: (nPage - 1) * nLimit
              },
              { $limit: nLimit },
              {
                $project: projectStage
              }
            ],
            total: [
              ...queryStage,
              { $count: 'total' }
            ]
          }
        }
      ])
      const data = { aRequestList: response[0].aRequestList, count: response[0].total[0]?.total || 0 }
      return responseMessage(req, res, 'Success', 'FetchedSuccessFully', 'Review', data)
    } catch (error) {
      return catchError(req, res)
    }
  }

  async update (req, res) {
    const session = driver.session()
    try {
      const { id } = req?.params
      const reviewInfo = await ReviewModel.findOne({ _id: id, iReviewedBy: req?.iCurrentUserId, eStatus: { $ne: 'D' } }).lean()
      if (!reviewInfo) return responseMessage(req, res, 'NotFound', 'NotFound', 'Review')
      const updateResponse = await ReviewModel.updateOne({ _id: id }, req?.body)
      if (!updateResponse?.modifiedCount) return responseMessage(req, res, 'NotFound', 'NotFound', 'Review')
      const avgReview = await ReviewModel.aggregate(
        [
          {
            $match: {
              iReviewTo: new mongoose.Types.ObjectId(reviewInfo?.iReviewTo),
              eStatus: { $ne: 'D' }
            }
          },
          {
            $group:
            {
              _id: '$iReviewTo',
              avgReview: { $avg: '$nRating' },
              total: { $sum: 1 }
            }
          }
        ]
      )
      const graphQueryParams = {
        id: reviewInfo?.iReviewTo
      }
      await session.run(`match (u:User {id:$id}) set u.nAvgRating = ${avgReview?.[0]?.avgReview},u.nTotalReview=${avgReview?.[0]?.total}`, graphQueryParams)
      return responseMessage(req, res, 'Success', 'UpdatedSuccessfully', 'Review')
    } catch (error) {
      return catchError(req, res)
    } finally {
      await session.close()
    }
  }

  async delete (req, res) {
    const session = driver.session()
    try {
      const { id } = req?.params
      const reviewInfo = await ReviewModel.findOne({ _id: id, eStatus: { $ne: 'D' }, iReviewedBy: req?.iCurrentUserId }, { iReviewTo: 1 }).lean()
      if (!reviewInfo) return responseMessage(req, res, 'NotFound', 'NotFound', 'Review')
      const graphQueryParams = {
        id: reviewInfo?.iReviewTo
      }
      await ReviewModel.updateOne({ _id: id, eStatus: { $ne: 'D' }, iReviewedBy: req?.iCurrentUserId }, { eStatus: 'D' })
      const avgReview = await ReviewModel.aggregate(
        [
          {
            $match: {
              iReviewTo: new mongoose.Types.ObjectId(reviewInfo?.iReviewTo),
              eStatus: { $ne: 'D' }
            }
          },
          {
            $group:
            {
              _id: '$iReviewTo',
              avgReview: { $avg: '$nRating' },
              total: { $sum: 1 }
            }
          }
        ]
      )
      await UserModel.updateOne({ _id: reviewInfo?.iReviewTo }, { nAvgRating: avgReview?.[0]?.avgReview, nTotalReview: avgReview?.[0]?.total })
      await session.run(`match (u:User {id:$id}) set u.nAvgRating = ${avgReview?.[0]?.avgReview},u.nTotalReview=${avgReview?.[0]?.total}`, graphQueryParams)
      return responseMessage(req, res, 'Success', 'DeletedSuccessfully', 'Review')
    } catch (error) {
      return catchError(req, res)
    } finally {
      await session.close()
    }
  }
}

module.exports = new ReviewController()
