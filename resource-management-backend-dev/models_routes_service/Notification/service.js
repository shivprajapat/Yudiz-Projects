/* eslint-disable camelcase */
const NotificationsModel = require('./model')
const { status, messages } = require('../../helper/api.responses')
const { catchError } = require('../../helper/utilities.services')

const { searchValidate, SuccessResponseSender } = require('../../helper/utilities.services')

// const { getFreeProjects, isNotificationReadbyAll } = require('./common')

// const { subscribeUsers, pushTopicNotification } = require('../../helper/firebase.service')
const { queuePush } = require('../../helper/redis')
// const { sendNotifications } = require('../../queue')

const NotificationModel = require('../Notification/model')

const mongoose = require('mongoose')

const { redisClient } = require('../../helper/redis')

const ObjectId = mongoose.Types.ObjectId

class Notification {
  async updateNotification(req, res) {
    try {
      const id = req.params.id
      const notification = await NotificationsModel.findById({ _id: id }).lean()
      if (!notification) { res.status(status.NotFound).jsonp({ status: status.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].notification) }) }
      const data = await NotificationsModel.findByIdAndUpdate({ _id: id }, {
        $addToSet: { aReadIds: req.employee._id }
      }).lean()
      if (!data) return res.status(status.NotFound).jsonp({ status: status.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].notification) })
      return res.status(status.NotFound).jsonp({ status: status.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].notification) })
    } catch (error) {
      return catchError('Notification.updateNotification', error, req, res)
    }
  }

  async markAllAsRead(req, res) {
    try {
      const { aNotificationIds = [] } = req.body

      if (Array.isArray(aNotificationIds) && aNotificationIds.length) {
        for (const notification of aNotificationIds) {
          const notificationExist = await NotificationModel.findById({ _id: ObjectId(notification), eStatus: 'Y', aSenderId: { $in: [req.employee._id] } }).lean()
          if (notificationExist) {
            await NotificationModel.updateOne({ _id: ObjectId(notification) }, { $addToSet: { aReadIds: req.employee._id } })
          }
        }
      }
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].isRead.replace('##', messages[req.userLanguage].notification))
    } catch (error) {
      return catchError('Notification.markAllAsRead', error, req, res)
    }
  }

  async deleteNotification(req, res) {
    try {
      const { aNotificationIds } = req.body

      if (Array.isArray(aNotificationIds) && aNotificationIds.length) {
        await Promise.all(aNotificationIds.map(async (notification) => {
          const notificationExist = await NotificationModel.findById({ _id: ObjectId(notification), eStatus: 'Y', aSenderId: { $in: [req.employee._id] } }).lean()
          if (notificationExist) {
            await NotificationModel.updateOne({ _id: ObjectId(notification) }, {
              $pull: {
                aReadIds: [notification]
              }
            })
          }
        }))
      }
    } catch (error) {
      catchError('Notification.deleteNotification', error, req, res)
    }
  }

  async getNotifications(req, res) {
    try {
      let { page = 0, limit = 5, search = '', sort = 'dCreatedAt', order } = req.query
      const orderBy = order && order === 'asc' ? 1 : -1

      search = searchValidate(search)

      const sorting = { [sort]: orderBy }

      const q = [
        { $match: { dCreatedAt: { $gte: req.employee.dCreatedAt } } },
        {
          $addFields: {
            aReadIds: { $ifNull: ['$aReadIds', []] },
            aSenderId: { $ifNull: ['$aSenderId', []] }
          }
        },
        {
          $addFields: {
            aReadIds: { $cond: { if: { $or: [{ $eq: ['$aReadIds', []] }] }, then: [], else: '$aReadIds' } },
            aSenderId: { $cond: { if: { $or: [{ $eq: ['$aSenderId', []] }] }, then: [], else: '$aSenderId' } }
          }
        },
        {
          $project: {
            isRead: { $cond: [{ $in: [req.employee._id, '$aReadIds'] }, true, false] },
            _id: 1,
            sHeading: 1,
            sMessage: 1,
            dCreatedAt: 1,
            iCreatedBy: 1,
            eEmpType: 1,
            eStatus: 1,
            aSenderId: 1,
            sType: 1,
            aReadIds: 1,
            redirectUrl: 1
          }
        },
        {
          $lookup: {
            from: 'employees',
            let: { aReadIds: '$aReadIds' },
            pipeline: [
              { $match: { $expr: { $in: ['$_id', '$$aReadIds'] } } },
              { $project: { sName: 1, sEmail: 1, sProfilePic: 1 } }
            ],
            as: 'aReadIds'
          }
        },
        {
          $lookup: {
            from: 'employees',
            let: { aSenderId: '$aSenderId' },
            pipeline: [
              { $match: { $expr: { $in: ['$_id', '$$aSenderId'] } } },
              { $project: { sName: 1, sEmail: 1, sProfilePic: 1 } }
            ],
            as: 'aSenderId'
          }
        }
      ]

      sort = ['sHeading', 'sMessage'].includes(sort) ? sort : 'dCreatedAt'

      if (search) {
        q.push({
          $match: {
            $or: [
              { sHeading: { $regex: new RegExp('^.*' + search + '.*', 'i') } },
              { sMessage: { $regex: new RegExp('^.*' + search + '.*', 'i') } }
            ]
          }
        })
      }

      const count_query = [...q]

      count_query.push({ $count: 'count' })

      q.push({ $sort: sorting })
      q.push({ $skip: parseInt(page) })
      q.push({ $limit: parseInt(limit) })

      const notifications = await NotificationsModel.aggregate(q)

      const query = ['search']

      let count = 0

      if (query.some(item => Object.keys(req.query).includes(item))) {
        count = await NotificationsModel.aggregate(count_query)
        count = count[0]?.count || 0
      } else {
        count = await NotificationsModel.countDocuments({ dCreatedAt: { $gte: req.employee.dCreatedAt } }).lean()
      }

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].notification), { notifications, count })
    } catch (error) {
      return catchError('Notification.getNotifications', error, req, res)
    }
  }

  async getNotificationCount(req, res) {
    try {
      const data = await NotificationsModel.countDocuments({ dCreatedAt: { $gte: req.employee.dCreatedAt }, aReadIds: { $nin: [req.employee._id] } }).lean()
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].notification), { count: data })
    } catch (error) {
      return catchError('Notification.getNotificationCount', error, req, res)
    }
  }

  async addNotification(req, res) {
    try {
      const { sTitle, sBody, sTopic } = req.body
      // console.log(sTitle, sBody, sTopic)

      const putData = { sTopic: 'All', sTitle: 'Resource Management', sBody, sIcon: 'https://jr-web-developer.s3.ap-south-1.amazonaws.com/Default/90px-CC_some_rights_reserved.jpg', sLink: 'https://jr-web-developer.s3.ap-south-1.amazonaws.com/Default/90px-CC_some_rights_reserved.jpg' }
      await queuePush('Welcome:Notification', putData)

      await NotificationModel.create({ sHeading: putData.sTitle, sMessage: putData.sBody, iCreatedBy: req.employee?._id ? ObjectId('62a9c5afbe6064f125f3501f') : ObjectId('62a9c5afbe6064f125f3501f') })

      // pushTopicNotification('All', 'Resource Management', `${employee.sName} is logged in`)

      return res.status(status.OK).jsonp({ status: status.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].notification) })
    } catch (error) {
      return catchError('Notification.addNotification', error, req, res)
    }
  }

  async addTimedNotification(req, res) {
    try {
      const { sTitle, sBody, sTopic, dExpTime } = req.body

      const localDateInMiliseconds = new Date(dExpTime).getTime()

      if (localDateInMiliseconds < new Date().getTime()) return res.status(status.BadRequest).jsonp({ status: status.BadRequest, message: messages[req.userLanguage].invalid_date })

      // const data = await redisClient.zadd('scheduler', Number(+localDateInMiliseconds), JSON.stringify({ sTopic, sTitle, sBody, queueName: 'NOTIFY', generateAt: localDateInMiliseconds }))
      const data = 0
      if (!data) {
        return res.status(status.BadRequest).jsonp({ status: status.BadRequest, message: messages[req.userLanguage].not_success.replace('##', messages[req.userLanguage].notification) })
      }
      return res.status(status.OK).jsonp({ status: status.OK, message: messages[req.userLanguage].set_success.replace('##', messages[req.userLanguage].notification) })
    } catch (error) {
      return catchError('Notification.addTimedNotification', error, req, res)
    }
  }
}

// const CronJob = require('cron').CronJob

// const job = new CronJob(
//   '00 30 10 * * *',
//   function() {
//     getFreeProjects()
//   },
//   null,
//   true,
//   'Asia/Kolkata'
// )

// const job2 = new CronJob(
//   '00 30 10 * * *',
//   function() {
//     isNotificationReadbyAll()
//   },
//   null,
//   true,
//   'Asia/Kolkata'
// )

// job.start()
// job2.start()

module.exports = new Notification()
