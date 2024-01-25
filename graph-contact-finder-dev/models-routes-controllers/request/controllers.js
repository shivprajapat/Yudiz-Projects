// @ts-check
const RequestModel = require('./model')
const UserModel = require('../user/model')
const { catchError, responseMessage, getPaginationValues } = require('../../helpers/utilityServices')
const driver = require('../../database/neo4j_driver')

class RequestController {
  async add (req, res) {
    try {
      const { iRequestTo } = req?.body
      const [isRequestExists, isUserExists] = await Promise.all([
        RequestModel.findOne({ iRequestTo, iRequestBy: req?.iCurrentUserId }),
        UserModel.findOne({ _id: iRequestTo, bIsUser: true }, { _id: 1 }).lean()
      ])
      if (isRequestExists) return responseMessage(req, res, 'ResourceExist', 'AlreadyExist', 'Request')
      if (!isUserExists) return responseMessage(req, res, 'NotFound', 'NotFound', 'User')
      await RequestModel.create({ ...req.body, iRequestBy: req?.iCurrentUserId })
      return responseMessage(req, res, 'Success', 'RequestSuccessfully')
    } catch (error) {
      return catchError(req, res)
    }
  }

  async list (req, res) {
    try {
      const { eOperationType, eStatus } = req?.query
      const { nPage, nLimit, oSorting } = getPaginationValues(req.query)
      const matchStage = { eStatus: { $ne: 'D' } }
      const currentUserId = req?.iCurrentUserId
      if (eOperationType === 'S') {
        matchStage.iRequestBy = currentUserId
      } else if (eOperationType === 'R') {
        matchStage.iRequestTo = currentUserId
      }
      if (eStatus) {
        matchStage.eStatus = eStatus
      }
      const projectStage = {
        eStatus: 1,
        'oRequestBy.sName': 1,
        'oRequestBy._id': 1,
        'oRequestTo.sName': 1,
        'oRequestTo._id': 1
      }
      const queryStage = [
        {
          $match: matchStage
        },
        {
          $lookup: {
            from: 'users',
            localField: 'iRequestBy',
            foreignField: '_id',
            as: 'oRequestBy'
          }
        },
        {
          $unwind: {
            path: '$oRequestBy',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'users',
            localField: 'iRequestTo',
            foreignField: '_id',
            as: 'oRequestTo'
          }
        },
        {
          $unwind: {
            path: '$oRequestTo',
            preserveNullAndEmptyArrays: true
          }
        }
      ]

      const response = await RequestModel.aggregate([
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
      return responseMessage(req, res, 'Success', 'FetchedSuccessFully', 'Request', data)
    } catch (error) {
      return catchError(req, res)
    }
  }

  async updateRequest (req, res) {
    const session = driver.session()
    try {
      const { id, eOperationType } = req?.body
      const requestInfo = await RequestModel.findOne({ _id: id, iRequestTo: req?.iCurrentUserId, eStatus: { $ne: 'D' } }).lean()
      if (!requestInfo) return responseMessage(req, res, 'NotFound', 'NotFound', 'Request')
      const graphQueryParams = {
        currentUserId: req?.iCurrentUserId?.toString(),
        targetUserId: requestInfo?.iRequestBy?.toString()
      }
      const updateResponse = await RequestModel.updateOne({ _id: id }, { eStatus: eOperationType })
      if (!updateResponse?.modifiedCount) return responseMessage(req, res, 'NotFound', 'NotFound', 'Request')
      if (eOperationType === 'A') {
        await session.run(`match (u:User{id:$currentUserId}),(v:User {id:$targetUserId})
          merge (u)-[:CONNECTED]->(v)`, graphQueryParams)
      }
      return responseMessage(req, res, 'Success', 'UpdatedSuccessfully', 'Request')
    } catch (error) {
      return catchError(req, res)
    } finally {
      await session.close()
    }
  }

  async delete (req, res) {
    try {
      const { id } = req?.params
      const updateResponse = await RequestModel.updateOne({ _id: id, eStatus: { $ne: 'D' }, iRequestBy: req?.iCurrentUserId }, { eStatus: 'D' })
      if (!updateResponse?.modifiedCount) return responseMessage(req, res, 'NotFound', 'NotFound', 'Request')
      return responseMessage(req, res, 'Success', 'DeletedSuccessfully', 'Request')
    } catch (error) {
      return catchError(req, res)
    }
  }
}

module.exports = new RequestController()
