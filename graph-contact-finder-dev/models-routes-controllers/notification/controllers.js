const { catchError, pick, removeNull, responseMessage, getPaginationValues, savePushNotification } = require('../../helpers/utilityServices')
const UserModel = require('../user/model')
const NotificationTypesModel = require('./notificationTypes.model')
const NotificationModel = require('./model')
const PushNotificationModel = require('./pushNotification.model')
const config = require('../../config')
const mongoose = require('mongoose')
// const { pushNotification, pushTopicNotification } = require('../../helpers/firebase.services')
const ObjectId = mongoose.Types.ObjectId
class Notification {
  async add (req, res) {
    try {
      req.body = pick(req.body, ['iUserId', 'sTitle', 'sMessage', 'iType'])
      removeNull(req.body)
      const { iUserId, iType, sTitle, sMessage } = req.body

      const userExist = await UserModel.findOne({ _id: iUserId, bIsUser: true }, { aJwtTokens: 1 }).lean()
      if (!userExist) return responseMessage(req, res, 'NotFound', 'NotFound', 'User')

      // adding notification type's id in notification if exists
      const notificationIdExist = await NotificationTypesModel.findOne({ _id: iType, eStatus: 'Y' }).lean()
      if (!notificationIdExist) return responseMessage(req, res, 'NotFound', 'NotFound', 'NotificationType')

      const data = await NotificationModel.create({ ...req.body, iAdminId: req.admin._id })

      const [registrationToken] = userExist.aJwtTokens.slice(-1)

      if (registrationToken && registrationToken.sPushToken) {
        // await pushNotification(registrationToken.sPushToken, sTitle, sMessage)
        await savePushNotification({ iAdminId: req.admin._id, sUserToken: registrationToken.sPushToken, sTitle, sDescription: sMessage })
      }

      return responseMessage(req, res, 'Success', 'CreatedSuccessfully', 'Notification', { data })
    } catch (error) {
      return catchError(req, res)
    }
  }

  async addGlobalNotification (req, res) {
    try {
      req.body = pick(req.body, ['sTitle', 'sMessage', 'iType', 'dExpTime'])
      removeNull(req.body)
      const { iType, dExpTime, sTitle, sMessage } = req.body

      const dTime = new Date(dExpTime)
      if (dTime < new Date()) return responseMessage(req, res, 'BadRequest', 'InvalidExpireTime', '')

      // adding notification type's id in notification if exists
      const notificationIdExist = await NotificationTypesModel.findById(iType).lean()
      if (!notificationIdExist) return responseMessage(req, res, 'NotFound', 'NotFound', 'NotificationType')

      const data = await NotificationModel.create({ ...req.body, iAdminId: req.admin._id })

      const sTopic = 'globalNotification'
      // await pushTopicNotification(sTopic, sTitle, sMessage)
      await savePushNotification({ iAdminId: req.admin._id, sTopic, sTitle, sDescription: sMessage })

      return responseMessage(req, res, 'Success', 'CreatedSuccessfully', 'Notification', { data })
    } catch (error) {
      return catchError(req, res)
    }
  }

  async deleteNotification (req, res) {
    try {
      const data = await NotificationModel.findByIdAndDelete(req.params.id).lean()
      if (!data) return responseMessage(req, res, 'NotFound', 'NotFound', 'Notification')
      return responseMessage(req, res, 'Success', 'DeletedSuccessfully', 'Notification')
    } catch (error) {
      return catchError(req, res)
    }
  }

  async changeMode (req, res) {
    try {
      const { eMode } = req.query
      const data = await NotificationModel.findByIdAndUpdate(req.params.id, { eMode }).lean()
      if (!data) return responseMessage(req, res, 'NotFound', 'NotFound', 'Notification')

      const str = eMode === '0' ? 'Zero' : 'One'

      if (data.eMode === eMode) return responseMessage(req, res, 'Success', 'NotificationModeAlready', str)

      if (eMode === 0) return responseMessage(req, res, 'Success', 'NotificationModeUpdatedSuccessfully', 'Disabled')

      return responseMessage(req, res, 'Success', 'NotificationModeUpdatedSuccessfully', 'Enabled')
    } catch (error) {
      return catchError(req, res)
    }
  }

  async notificationList (req, res) {
    try {
      const { iType, startDate, endDate } = req.query
      const { nPage, nLimit, oSorting, sSearch } = getPaginationValues(req.query)

      const iTypefilter = iType ? { iType } : {}
      const dateFilter = startDate && endDate ? { $and: [{ dExpTime: { $gte: (startDate) } }, { dExpTime: { $lte: (endDate) } }] } : {}
      const searchFilter = sSearch ? { sTitle: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } } : {}

      const query = { ...iTypefilter, ...dateFilter, ...searchFilter }

      const nTotalCount = await NotificationModel.countDocuments({ ...query })

      if (!nTotalCount) return responseMessage(req, res, 'NotFound', 'NotFound', 'Notifications')

      const data = await NotificationModel.find(query, { __v: 0 })
        .sort(oSorting)
        .skip((nPage - 1) * nLimit)
        .limit(nLimit)
        .lean()

      return responseMessage(req, res, 'Success', 'FetchedSuccessFully', 'Notifications', { total: nTotalCount, data })
    } catch (error) {
      return catchError(req, res)
    }
  }

  async listTypes (req, res) {
    try {
      const data = await NotificationTypesModel.find({ eStatus: 'Y' }).lean()
      return responseMessage(req, res, 'Success', 'FetchedSuccessFully', 'NotificationType', { total: data.length, data })
    } catch (error) {
      return catchError(req, res)
    }
  }

  async get (req, res) {
    try {
      const data = await NotificationModel.findById(req.params.id, { __v: 0 }).lean()
      if (!data) return responseMessage(req, res, 'NotFound', 'NotFound', 'Notification')

      return responseMessage(req, res, 'Success', 'FetchedSuccessFully', 'Notification', { data })
    } catch (error) {
      return catchError(req, res)
    }
  }

  async unreadCount (req, res) {
    const iCurrentUserId = ObjectId(req.iCurrentUserId)
    try {
      const data = await NotificationModel.aggregate([
        { $match: { $or: [{ iUserId: iCurrentUserId }, { dExpTime: { $gte: new Date() } }] } },
        {
          $project: {
            status: {
              $cond: [
                '$dExpTime',
                { $cond: [{ $in: [iCurrentUserId, '$aReadIds'] }, 1, 0] },
                '$eStatus'
              ]
            }
          }
        },
        { $match: { status: 0 } }
      ])

      return responseMessage(req, res, 'Success', 'FetchedSuccessFully', 'UnreadNotificationCount', { UnreadNotificationCount: data.length })
    } catch (error) {
      return catchError(req, res)
    }
  }

  async notificationListUser (req, res) {
    try {
      let { nLimit, nSkip } = req.body
      nLimit = parseInt(nLimit) || 20
      nSkip = parseInt(nSkip) || 0
      req.iCurrentUserId = ObjectId(req.iCurrentUserId)
      const oMatchQuery = { $or: [{ iUserId: req.iCurrentUserId, eMode: 1 }, { dExpTime: { $gte: new Date() }, eMode: 1 }] }

      const aNotifications = await NotificationModel.aggregate([
        { $match: oMatchQuery },
        {
          $project: {
            _id: 1,
            eStatus: {
              $cond: [
                '$dExpTime',
                { $cond: [{ $in: [req.iCurrentUserId, '$aReadIds'] }, 1, 0] },
                '$eStatus'
              ]
            },
            sTitle: 1,
            sMessage: 1,
            dExpTime: 1,
            dCreatedAt: 1
          }
        },
        { $sort: { dCreatedAt: -1 } },
        { $skip: nSkip },
        { $limit: nLimit }
      ]).allowDiskUse(config.MONGODB_ALLOW_DISK_USE).exec()
      const aUpdateIds = []
      const aTimeIds = []

      aNotifications.forEach(s => {
        if (s.dExpTime && !s.eStatus) {
          aTimeIds.push(s._id)
        } else if (!s.eStatus) {
          aUpdateIds.push(s._id)
        }
      })

      if (aUpdateIds.length) { await NotificationModel.updateMany({ _id: { $in: aUpdateIds } }, { $set: { eStatus: 1 } }) }
      if (aTimeIds.length) { await NotificationModel.updateMany({ _id: { $in: aTimeIds } }, { $addToSet: { aReadIds: req.iCurrentUserId } }) }
      return responseMessage(req, res, 'Success', 'FetchedSuccessFully', 'Notification', { data: aNotifications })
    } catch (error) {
      return catchError(req, res)
    }
  }

  async addPushNotification (req, res) {
    try {
      req.body = pick(req.body, ['sTitle', 'sMessage', 'sTopic', 'sUserToken'])

      const { sTitle, sMessage, sTopic, sUserToken } = req.body

      let data
      if (sTopic) {
        data = await PushNotificationModel.create({ sTitle, iAdminId: req.admin._id, sDescription: sMessage, dScheduledTime: new Date(), sTopic })
        // await pushTopicNotification(sTopic, sTitle, sMessage)
      } else {
        data = await PushNotificationModel.create({ sTitle, iAdminId: req.admin._id, sDescription: sMessage, dScheduledTime: new Date(), sUserToken })
        // await pushNotification(sUserToken, sTitle, sMessage)
      }

      return responseMessage(req, res, 'Success', 'SentSuccessfully', 'PushNotification', { PushNotification: data })
    } catch (error) {
      return catchError(req, res)
    }
  }

  async pushNotificationList (req, res) {
    try {
      const { nPage, nLimit, oSorting } = getPaginationValues(req.query)

      const nTotalCount = await PushNotificationModel.countDocuments({})

      if (!nTotalCount) return responseMessage(req, res, 'NotFound', 'NotFound', 'PushNotifications')

      const data = await PushNotificationModel.find({}, { dCreatedAt: 0, dUpdatedAt: 0, __v: 0 })
        .sort(oSorting)
        .skip((nPage - 1) * nLimit)
        .limit(nLimit)
        .lean()

      return responseMessage(req, res, 'Success', 'FetchedSuccessFully', 'PushNotifications', { Total: nTotalCount, PushNotifications: data })
    } catch (error) {
      return catchError(req, res)
    }
  }
}

module.exports = new Notification()
