/* eslint-disable indent */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
const DepartmentModel = require('../Department/model')
const JobProfileModel = require('../JobProfile/model')
const SkillModel = require('./model')
const Logs = require('../Logs/model')
const { status, messages } = require('../../helper/api.responses')
const { catchError, keygen, ErrorResponseSender, SuccessResponseSender, paginationValue, searchValidate, getRandomColor, checkcolor, generateConfig } = require('../../helper/utilities.services')
const mongoose = require('mongoose')
// const { subscribeUsers, pushNotification, pushTopicNotification, unsubscribeUsers } = require('../../helper/firebase.service')
const { queuePush } = require('../../helper/redis')
const EmployeeModel = require('../Employee/model')

const axios = require('axios')

const config = require('../../config/config')
const jwt = require('jsonwebtoken')

const moment = require('moment')
const OneSignal = require('@onesignal/node-onesignal')
// const OneSignal = require('onesignal-node')

const { ResourceManagementDB } = require('../../database/mongoose')

const ObjectId = mongoose.Types.ObjectId

async function notificationsender(req, params, sBody, isRecorded, isNotify, iLastUpdateBy, url) {
  try {
    const data = await SkillModel.findOne({ _id: params._id }, { _id: 1, sName: 1, sLogo: 1 }).lean()

    // console.log('data', data)

    const department = await DepartmentModel.find({
      eStatus: 'Y',
      bIsSystem: true,
      sKey: {
        $in: ['HR', 'ADMIN', 'BUSINESSANALYST', 'PRODUCTDEVELOPMENT', 'OPERATION', 'MANAGEMENT', 'MARKETING', 'SALES']
      }
    }, { _id: 1 }).lean()

    const jobProfile = await JobProfileModel.find({
      eStatus: 'Y',
      sPrefix: {
        $in: ['Superior', 'Head', 'Lead', 'Other', 'Manager']
      }
    }, { _id: 1 }).lean()

    const allEmployee = await EmployeeModel.find({
      eStatus: 'Y',
      $or: [
        { iDepartmentId: { $in: department.map((item) => item._id) } },
        { iJobProfileId: { $in: jobProfile.map((item) => item._id) } }
      ]
    }, {
      _id: 1,
      aJwtTokens: 1
    }).lean()

    const sPushToken = []
    const ids = []

    if (allEmployee.length > 0) {
      for (const employee of allEmployee) {
        if (ids.indexOf(employee._id) === -1) {
          ids.push(employee._id)
        }
        if (employee.aJwtTokens.length) {
          for (const pushtoken of employee.aJwtTokens) {
            if (pushtoken?.sPushToken && sPushToken.indexOf(pushtoken.sPushToken) === -1) {
              sPushToken.push(pushtoken.sPushToken)
            }
          }
        }
      }
    }

    const metadata = {
      iSkillId: data._id,
      sName: data.sName,
      iCreatedBy: iLastUpdateBy,
      sType: 'skill',
      sUrl: url,
      sLogo: '',
      isRecorded: isRecorded === true ? 'Y' : 'N',
      isNotify: isNotify === true ? 'Y' : 'N'
    }

    const person = await EmployeeModel.findOne({ _id: iLastUpdateBy }, { sName: 1, sEmpId: 1 })
    const putData = {
      sPushToken,
      sTitle: 'Resource Management',
      sBody: `${params.sName}${sBody}by ${person.sName}(${person.sEmpId})`,
      sUrl: url,
      sLogo: '',
      sType: 'skill',
      metadata,
      aSenderId: ids,
      isRecorded: isRecorded === true ? 'Y' : 'N',
      isNotify: isNotify === true ? 'Y' : 'N'
    }

    await queuePush('Project:Notification', putData)
  } catch (error) {
    console.log(error)
  }
}
class Skill {
  async addSkills(req, res) {
    try {
      const { sName } = req.body
      const skill = await SkillModel.findOne({ sKey: keygen(sName), eStatus: 'Y' }).lean()
      if (skill) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].skill))
      const sColor = await SkillModel.find({ eStatus: 'Y' }).lean()
      let s = getRandomColor()
      if (sColor.length) {
        s = checkcolor(s, sColor)
      }
      const data = await SkillModel.create({ sName, sKey: keygen(sName), sProgressColor: s.sBackGroundColor, iCreatedBy: req.employee?._id ? ObjectId('62a9c5afbe6064f125f3501f') : ObjectId('62a9c5afbe6064f125f3501f'), iLastUpdateBy: req.employee._id })
      // let take = `Logs${new Date().getFullYear()}`

      // take = ResourceManagementDB.model(take, Logs)
      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Skill', sService: 'addSkills', eAction: 'Create', oNewFields: data, oBody: req.body, oParams: req.params, oQuery: req.query, sDbName: `Logs${new Date().getFullYear()}` }
      await queuePush('logs', logs)
      // await take.create(logs)
      // await notificationsender(req, data, ' skill is create ', true, true, req.employee._id, `${config.urlPrefix}skill-management`)

      return SuccessResponseSender(res, status.Create, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].skill), {
        id: data._id
      })
    } catch (error) {
      return catchError('Skill.addSkills', error, req, res)
    }
  }

  async deleteSkills(req, res) {
    try {
      const skill = await SkillModel.findById({ _id: req.params.id, eStatus: 'Y' }).lean()
      if (!skill) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].skill))

      const employeeProfile = await EmployeeModel.findOne({ 'aSkills.iSkillId': { $in: [req.params.id] }, eStatus: 'Y' }).lean()

      if (employeeProfile) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].in_used_employee.replace('##', messages[req.userLanguage].skill))

      if (skill && skill.eStatus === 'Y') {
        const data = await SkillModel.findByIdAndUpdate({ _id: req.params.id }, { eStatus: 'N', iLastUpdateBy: req.employee._id }, { runValidators: true, new: true })
        if (!data) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].skill))
        const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Skill', sService: 'deleteSkills', eAction: 'Delete', oOldFields: data, oBody: req.body, oParams: req.params, oQuery: req.query, sDbName: `Logs${new Date().getFullYear()}` }

        // await Logs.create(logs)
        await queuePush('logs', logs)

        // await notificationsender(req, data, ' skill is delete ', true, true, req.employee._id, `${config.urlPrefix}skill-management`)
        return SuccessResponseSender(res, status.Deleted, messages[req.userLanguage].delete_success.replace('##', messages[req.userLanguage].skill))
      }

      return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].skill))
    } catch (error) {
      return catchError('Skill.deleteSkills', error, req, res)
    }
  }

  async updateSkills(req, res) {
    try {
      const { sName } = req.body
      const skill = await SkillModel.findById({ _id: req.params.id }).lean()
      if (!skill) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].skill))
      if (skill && skill.eStatus === 'Y') {
        const skillKey = await SkillModel.findOne({ sKey: keygen(sName), eStatus: 'Y', _id: { $ne: req.params.id } }).lean()
        if (skillKey) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].skill))
        const data = await SkillModel.findByIdAndUpdate({ _id: req.params.id }, { sName, sKey: keygen(sName), iLastUpdateBy: req.employee._id }, { runValidators: true, new: true })
        if (!data) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].skill))
        // let take = `Logs${new Date().getFullYear()}`

        // take = ResourceManagementDB.model(take, Logs)
        const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Skill', sService: 'updateSkills', eAction: 'Update', oOldFields: skill, oNewFields: data, oBody: req.body, oParams: req.params, oQuery: req.query, sDbName: `Logs${new Date().getFullYear()}` }

        await queuePush('logs', logs)
        // await take.create(logs)
        // await notificationsender(req, data, ' skill is update ', true, true, req.employee._id, `${config.urlPrefix}skill-management`)
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].skill))
      }

      return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].skill))
    } catch (error) {
      return catchError('Skill.updateSkills', error, req, res)
    }
  }

  async getSkills(req, res) {
    try {
      let { page, limit, sorting, search = '' } = paginationValue(req.query)
      search = searchValidate(search)
      const query = search && search.length
        ? {
          $or: [{ sKey: { $regex: new RegExp('^.*' + search + '.*', 'i') } },
          { sName: { $regex: new RegExp('^.*' + search + '.*', 'i') } }
          ],
          eStatus: 'Y'
        }
        : { eStatus: 'Y' }

      let skills = []; let total = 0
      if (limit !== 'all') {
        [skills, total] = await Promise.all([SkillModel.find(query).sort(sorting).skip(Number(page)).limit(Number(limit)).lean(), SkillModel.countDocuments({ ...query }).lean()])
      } else {
        [skills, total] = await Promise.all([SkillModel.find(query).sort(sorting).lean(), SkillModel.countDocuments({ ...query }).lean()])
      }

      if (req.path === '/DownloadExcel') {
        return skills
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].skill), { skills, count: total })
      }
    } catch (error) {
      return catchError('Skill.getSkills', error, req, res)
    }
  }

  async getSkillsById(req, res) {
    try {
      const skills = await SkillModel.findOne({ _id: req.params.id, eStatus: 'Y' }).lean()
      if (!skills) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].skill))

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].skill), skills)
    } catch (error) {
      return catchError('Skill.getSkills', error, req, res)
    }
  }

  async sendPushNotificationUsingOneSignal1(req, res) {
    try {
      const ONESIGNAL_APP_ID = 'd231d9d1-8145-47d0-8694-333473c635d9'

      const configuration = OneSignal.Configuration({
        apiKey: 'YWViZWRkY2EtYjA4Mi00YTc3LTljYzMtMWM1ZjZhZGRjNTZl',
        appId: ONESIGNAL_APP_ID
      })

      // console.log(configuration)

      const client = new OneSignal.DefaultApi(configuration)
      // console.log(client)

      // const notification = new OneSignal.Notification({
      //   contents: {
      //     en: 'English Message',
      //     tr: 'Türkçe Mesaj',
      //     de: 'Deutsche Nachricht',
      //     fr: 'Message français'
      //   },
      //   included_segments: ['All'],
      //   data: {
      //     foo: 'bar',
      //     baz: 'qux'
      //   },
      //   headings: {
      //     en: 'English Title'
      //   },
      //   subtitle: {
      //     en: 'English Subtitle'
      //   },
      //   url: 'http://127.0.0.1:5500',
      //   buttons: [
      //     {
      //       id: 'id1',
      //       text: 'button1'
      //     }
      //   ],
      //   web_buttons: [
      //     {
      //       id: 'id1',
      //       text: 'button1'
      //     }
      //   ],
      //   big_picture: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg',
      //   chrome_web_icon: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg',
      //   chrome_web_image: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg',
      //   chrome_web_badge: 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'

      // })

      // const response = await OneSignal.
      // console.log(response)

      const notification = new OneSignal.Notification()
      notification.app_id = ONESIGNAL_APP_ID
      notification.included_segments = ['Subscribed Users']
      notification.contents = {
        en: 'Hello OneSignal!'
      }
      const { id } = await client.createNotification(notification)
      // console.log(id)

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].skill), client)
    } catch (error) {
      catchError('Skill.sendPushNotificationUsingOneSignal', error, req, res)
    }
  }

  async sendPushNotificationUsingOneSignal(req, res) {
    try {
      const ONESIGNAL_APP_ID = 'd231d9d1-8145-47d0-8694-333473c635d9'
      /*
 * CREATING ONESIGNAL KEY TOKENS
 */
      const app_key_provider = {
        getToken() {
          return 'YWViZWRkY2EtYjA4Mi00YTc3LTljYzMtMWM1ZjZhZGRjNTZl'
        }
      }
      // console.log('app_key_provider', app_key_provider.getToken())
      /**
  * CREATING ONESIGNAL CLIENT
  */
      const configuration = OneSignal.createConfiguration({
        authMethods: {
          app_key: {
            tokenProvider: app_key_provider
          }
        }
      })
      const client = new OneSignal.DefaultApi(configuration)

      /**
 * CREATE NOTIFICATION
 */
      const notification = new OneSignal.Notification()
      notification.app_id = ONESIGNAL_APP_ID
      notification.included_segments = ['Subscribed Users']
      // notification.included_segments = ['All']
      // notification.include_player_ids = ['fe37a83e-57b0-459d-9699-dc5d9aff2494', '14a8c7f9-4764-4777-a1b1-6183505629bf']
      notification.contents = {
        en: 'Hello OneSignal!'
      }
      notification.headings = {
        en: 'English Title'
      }
      notification.subtitle = {
        en: 'English Subtitle'
      }
      notification.url = 'http://127.0.0.1:5500'
      // notification.buttons = [
      //   {

      //   }
      // ]
      notification.icon = 'https://onesignal.com/images/notification_logo.png'
      notification.buttons = [{ /* Buttons */
        /* Choose any unique identifier for your button. The ID of the clicked button            is passed to you so you can identify which button is clicked */
        id: 'like-button',
        /* The text the button should display. Supports emojis. */
        text: 'Like',
        /* A valid publicly reachable URL to an icon. Keep this small because it's               downloaded on each notification display. */
        icon: 'http://i.imgur.com/N8SN8ZS.png',
        /* The URL to open when this action button is clicked. See the sections below            for special URLs that prevent opening any window. */
        url: 'https://example.com/?_osp=do_not_open'
      },
      {
        id: 'read-more-button',
        text: 'Read more',
        icon: 'http://i.imgur.com/MIxJp1L.png',
        url: 'https://example.com/?_osp=do_not_open'
      }]

      // notification.web_buttons = [{ /* Buttons */
      //   /* Choose any unique identifier for your button. The ID of the clicked button            is passed to you so you can identify which button is clicked */
      //   id: 'like-button',
      //   /* The text the button should display. Supports emojis. */
      //   text: 'Like',
      //   /* A valid publicly reachable URL to an icon. Keep this small because it's               downloaded on each notification display. */
      //   icon: 'http://i.imgur.com/N8SN8ZS.png',
      //   /* The URL to open when this action button is clicked. See the sections below            for special URLs that prevent opening any window. */
      //   url: 'https://example.com/?_osp=do_not_open'
      // },
      // {
      //   id: 'read-more-button',
      //   text: 'Read more',
      //   icon: 'http://i.imgur.com/MIxJp1L.png',
      //   url: 'https://example.com/?_osp=do_not_open'
      // }]

      // pass metaData to notification
      notification.data = {
        foo: 'bar',
        abc: 123,
        url: 'https://example.com/?_osp=do_not_open',
        url2: 'https://example.com/?_osp=do_not_open'
      }

      notification.big_picture = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'
      notification.chrome_web_icon = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'
      notification.chrome_web_image = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'
      notification.chrome_web_badge = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'

      notification.small_icon = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'
      notification.large_icon = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'

      // safari web push
      notification.safari_web_icon = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'
      notification.safari_web_image = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'
      notification.safari_web_badge = 'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg'

      // notification.

      const { id } = await client.createNotification(notification)
      // console.log(id)

      /**
 * VIEW NOTIFICATION
 */
      const response = await client.getNotification(ONESIGNAL_APP_ID, id)
      // console.log(response)
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].skill), client)
    } catch (error) {
      catchError('Skill.sendPushNotificationUsingOneSignal', error, req, res)
    }
  }

  async removeSubscribeUsersWithOneSignal(req, res) {
    try {
      const { player_id } = req.body
      const ONESIGNAL_APP_ID = 'd231d9d1-8145-47d0-8694-333473c635d9'
      /*
 * CREATING ONESIGNAL KEY TOKENS
 */
      const app_key_provider = {
        getToken() {
          return 'YWViZWRkY2EtYjA4Mi00YTc3LTljYzMtMWM1ZjZhZGRjNTZl'
        }
      }
      // console.log('app_key_provider', app_key_provider.getToken())
      /**
  * CREATING ONESIGNAL CLIENT
  */
      const configuration = OneSignal.createConfiguration({
        authMethods: {
          app_key: {
            tokenProvider: app_key_provider
          }
        }
      })

      // console.log('configuration', JSON.stringify(configuration))

      const client = new OneSignal.DefaultApi(configuration)

      // get all players from onesignal app id
      const players = await client.deletePlayer(ONESIGNAL_APP_ID, player_id)
      // console.log('players', players)

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].skill), client)
    } catch (error) {
      console.log('error', JSON.stringify(error.body))
      catchError('Skill.removeSubscribeUsersWithOneSignal', error, req, res)
    }
  }

  // async subscribeUsersWithOneSignal(req, res) {
  //   try {
  //     const { player_id } = req.body
  //     const ONESIGNAL_APP_ID = 'd231d9d1-8145-47d0-8694-333473c635d9'
  //     const app_key_provider = {
  //       getToken() {
  //         return 'YWViZWRkY2EtYjA4Mi00YTc3LTljYzMtMWM1ZjZhZGRjNTZl'
  //       }
  //     }
  //     console.log('app_key_provider', app_key_provider.getToken())

  //     const configuration = OneSignal.createConfiguration({
  //       authMethods: {
  //         app_key: {
  //           tokenProvider: app_key_provider
  //         }
  //       }
  //     })
  //     const client = new OneSignal.DefaultApi(configuration)

  //     // add user to segment
  //     const player = new OneSignal.Player()
  //     // select device_type 0 for iOS, 1 for Android, 2 for Amazon, 3 for Windows Phone, 4 for Windows Phone WNS, 5 for Chrome App, 6 for Chrome Website, 7 for Safari, 8 for Firefox, 9 for Mac OS, 10 for Windows, 11 for Adroid Fire OS
  //     player.app_id = ONESIGNAL_APP_ID
  //     player.identifier = player_id

  //     player.tags = {
  //       e: 'Subscribed Users'
  //     }

  //     player.device_type = 5

  //     const player1 = await client.createPlayer(player)
  //     console.log('player1', player1)

  //     console.log('client', client)
  //     return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].skill), client)
  //   } catch (error) {
  //     catchError('Skill.addPlayerToSegmentWithSubscription', error, req, res)
  //   }
  // }

  // async subscribeToNotification(req, res) {
  //   try {
  //     const { player_id } = req.body

  //     const ONESIGNAL_APP_ID = 'd231d9d1-8145-47d0-8694-333473c635d9'

  //     const app_key_provider = {
  //       getToken() {
  //         return 'YWViZWRkY2EtYjA4Mi00YTc3LTljYzMtMWM1ZjZhZGRjNTZl'
  //       }
  //     }
  //     console.log('app_key_provider', app_key_provider.getToken())

  //     const configuration = OneSignal.createConfiguration({
  //       authMethods: {
  //         app_key: {
  //           tokenProvider: app_key_provider
  //         }
  //       }
  //     })

  //     const client = new OneSignal.DefaultApi(configuration)

  //     // add user to segment
  //     const player = {
  //       app_id: ONESIGNAL_APP_ID,
  //       identifier: player_id,
  //       id: player_id,
  //       tags: {
  //         e: 'Subscribed Users'
  //       },
  //       device_type: 5,
  //       language: 'en'
  //     }

  //     // const player1 = await client.createPlayer(player)
  //     // console.log('player1', player1)

  //     return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].skill), client)
  //   } catch (error) {
  //     catchError('Skill.subscribeToNotification', error, req, res)
  //   }
  // }

  async subscribeUserWithOneSignal(req, res) {
    try {
      const { player_id } = req.body
      const ONESIGNAL_APP_ID = 'd231d9d1-8145-47d0-8694-333473c635d9'
      const ONESIGNAL_REST_API_KEY = 'YWViZWRkY2EtYjA4Mi00YTc3LTljYzMtMWM1ZjZhZGRjNTZl'
      const USER_ID = player_id
      const SEGMENT_NAME = 'Subscribed Users'

      const apiUrl = `https://onesignal.com/api/v1/players/${USER_ID}/on_session`
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Basic ${ONESIGNAL_REST_API_KEY}`
      }

      // const data = await axios.post(apiUrl, {
      //   app_id: ONESIGNAL_APP_ID,
      //   segmentation: {
      //     device_type: 'web',
      //     [SEGMENT_NAME]: 'true'
      //   },
      //   tags: {
      //     [SEGMENT_NAME]: 'true'
      //   },
      //   device_type: 5,
      //   language: 'en',
      //   email_auth_hash: '',
      //   test_type: 1,
      //   device_model: 'web',
      //   device_os: 'web',
      //   timezone: 0,
      //   game_version: '1.0'

      // }, { headers })

      // const client = new OneSignal.Client({
      //   app: {
      //     appAuthKey: 'YWViZWRkY2EtYjA4Mi00YTc3LTljYzMtMWM1ZjZhZGRjNTZl',
      //     appId: 'd231d9d1-8145-47d0-8694-333473c635d9'
      //   }
      // })

      // const player = new OneSignal.Player()

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].skill))
    } catch (error) {
      catchError('Skill.subscribeUserWithOneSignal', error, req, res)
    }
  }

  async getNotifications1(req, res) {
    try {
      // const { player_id } = req.body //get notifications

      // https://documentation.onesignal.com/reference/view-notifications

      const ONESIGNAL_APP_ID = 'd231d9d1-8145-47d0-8694-333473c635d9'

      const app_key_provider = {
        getToken() {
          return 'YWViZWRkY2EtYjA4Mi00YTc3LTljYzMtMWM1ZjZhZGRjNTZl'
        }
      }
      // console.log('app_key_provider', app_key_provider.getToken())

      const configuration = OneSignal.createConfiguration({
        authMethods: {
          app_key: {
            tokenProvider: app_key_provider
          }
        }
      })

      // console.log('configuration', JSON.stringify(configuration))

      const client = new OneSignal.DefaultApi(configuration)

      const all_allnotifications = await client.getNotifications({
        app_id: ONESIGNAL_APP_ID,
        limit: 50,
        offset: 0
      })

      // console.log('all_allnotifications', all_allnotifications)

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].skill), all_allnotifications)
    } catch (error) {
      catchError('Skill.getNotifications', error, req, res)
    }
  }

  async getNotifications(req, res) {
    try {
      const options = {
        method: 'GET',
        url: 'https://onesignal.com/api/v1/notifications?app_id=d231d9d1-8145-47d0-8694-333473c635d9&limit=50&offset=0&kind=all',
        headers: {
          accept: 'application/json',
          Authorization: 'Basic YWViZWRkY2EtYjA4Mi00YTc3LTljYzMtMWM1ZjZhZGRjNTZl'
        }
      }

      const all_allnotifications = await axios(options)

      // console.log('all_allnotifications', all_allnotifications.data.notifications[0])

      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].skill), 'all_allnotifications')
    } catch (error) {
      catchError('Skill.getNotifications', error, req, res)
    }
  }
}

module.exports = new Skill()
