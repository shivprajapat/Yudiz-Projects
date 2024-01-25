/* eslint-disable no-useless-call */
const { status, jsonStatus, messages } = require('../../helper/api.responses')
const { catchError, pick, SuccessResponseSender, ErrorResponseSender, interviewTime, timeValidation } = require('../../helper/utilities.services')
const Logs = require('../Logs/model')
const EmployeeModel = require('../Employee/model')
const ClientModel = require('../Client/model')
const ProjectModel = require('../Project/model')
const TechnologyModel = require('../Technology/model')
const projectWiseTagModel = require('../Project/projectwisetag.model')
const projectWiseTechnology = require('../Project/projectwisetechnology.model')
const projectWiseClient = require('../Project/projectwiseclient.model')
const { ResourceManagementDB } = require('../../database/mongoose')
const moment = require('moment')

const InterviewModel = require('./model')

const projectTag = require('../ProjectTag/model')

const { queuePush } = require('../../helper/redis')

async function notificationsender(req, params, sBody) {
  try {
    const data = await InterviewModel.findOne({ _id: params }).lean()
    const project = await ProjectModel.findOne({ _id: data.iProjectId }).lean()

    const allEmployee = await EmployeeModel.find({ _id: { $in: [project.iProjectManagerId, project.iBAId, project.iBDId, project.iCreatedBy, project.iLastUpdateBy, data.iLastUpdateBy, data.iCreatedBy] }, eStatus: 'Y' }).lean()

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
      iInterviewId: data._id,
      sName: project.sName,
      iCreatedBy: data.iLastUpdateBy,
      sType: 'interview',
      sLogo: project?.sLogo || 'Default/magenta_explorer-wallpaper-3840x2160.jpg'
    }

    const person = await EmployeeModel.findOne({ _id: data.iLastUpdateBy }, { sName: 1, sEmpId: 1 }).lean()
    const Employee = await EmployeeModel.findOne({ _id: data.iEmpId }, { sName: 1, sEmpId: 1 }).lean()
    const client = await ClientModel.findOne({ _id: data.iClientId }, { sName: 1 }).lean()

    const putData = { sPushToken, sTitle: 'Resource Management', sBody: `${sBody} for ${project.sName} on ${moment(data.dInterviewDate).format('DD-MM-YYYY')} at ${data.sInterviewTime} by ${person.sName}(${person.sEmpId}) with Employee ${Employee.sName}(${Employee.sEmpId}) to Client ${client.sName}`, sLogo: data?.sLogo || 'Default/magenta_explorer-wallpaper-3840x2160.jpg', sType: 'interview', metadata, aSenderId: ids }

    await queuePush('Project:Notification', putData)
  } catch (error) {
    console.log(error)
  }
}

class Interview {
  /**
   *
   * @param {*} req request data from client
   * @param {*} res send status code with response message
   * @returns
   */
  async addInterviews(req, res) {
    try {
      req.body = pick(req.body, ['iEmpId', 'iClientId', 'aTechnologyId', 'iProjectId', 'dInterviewDate', 'sInterviewTime', 'eInterviewStatus', 'sJobDescriptions', 'sInterviewRound'])
      const { iProjectId } = req.body
      const projectWiseTag = await projectWiseTagModel.find({ iProjectId, eStatus: 'Y' }, { iProjectTagId: 1, _id: 0 })
      const projectTagId = projectWiseTag.map(a => a.iProjectTagId)
      const ProjectTag = await projectTag.find({ _id: { $in: projectTagId }, eStatus: 'Y' }, { sName: 1, _id: 1, sBackGroundColor: 1, sTextColor: 1 })
      const data = await InterviewModel.create({ ...req.body, aProjectTag: ProjectTag, iCreatedBy: req.employee._id, iLastUpdateBy: req.employee._id })

      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)
      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Interview', sService: 'addInterviews', eAction: 'Create', oNewFields: data }
      await take.create(logs)
      // await notificationsender(req, data._id, 'Interview is create ')
      return SuccessResponseSender(res, status.Create, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].interview))
    } catch (error) {
      return catchError('Interview.addInterviews', error, req, res)
    }
  }

  async availabilityHours(req, res) {
    try {
      req.body = pick(req.body, ['iEmpId', 'iClientId', 'dInterviewDate', 'sInterviewTime'])
      const { iEmpId, dInterviewDate, sInterviewTime, iClientId } = req.body
      if (!timeValidation(sInterviewTime)) {
        return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].time))
      }
      const q = []
      const now = new Date()
      const userVal = new Date(dInterviewDate)
      const inputTime = (userVal.getMonth() + 1) + '/' + userVal.getDate() + '/' + userVal.getFullYear() + ' ' + sInterviewTime
      if (Date.parse(now) > Date.parse(inputTime)) {
        q.push('This Interview time Does not exist Do you want to continue with this time...')
      }
      if (!(new Date(dInterviewDate).getTime() > Date.now()) && !(new Date(dInterviewDate).toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10))) {
        q.push('Interview Date is Old Do you want to continue with this date...')
      }
      const [clientHoursData, employeeHoursData] = await Promise.all([
        InterviewModel.find({ iClientId, dInterviewDate }, { sInterviewTime: 1 }),
        InterviewModel.find({ iEmpId, dInterviewDate }, { sInterviewTime: 1 })
      ])
      const available = interviewTime(employeeHoursData.map(a => a.sInterviewTime), clientHoursData.map(a => a.sInterviewTime), sInterviewTime, '02:00')
      if (available !== 'OK') {
        q.push(available)
      }
      if (q.length === 0) {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].time, false)
      }
      return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: q })
    } catch (error) {
      return catchError('Interview.checkTimeAndDate', error, req, res)
    }
  }

  async updateInterviews(req, res) {
    try {
      const id = req.params.id
      const { permission = 'No' } = req.query
      req.body = pick(req.body, ['iEmpId', 'iClientId', 'aTechnologyId', 'iProjectId', 'eInterviewStatus', 'dInterviewDate', 'sInterviewTime', 'sInterviewDescriptions', 'sInterviewFeedback', 'sJobDescriptions', 'sInterviewRound'])
      const { iEmpId, iProjectId, dInterviewDate, eInterviewStatus, sInterviewTime, iClientId } = req.body
      const oldInterview = await InterviewModel.findOne({ _id: id, eStatus: 'Y' }).lean()
      if (!oldInterview) return res.status(status.NotFound).jsonp({ status: status.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].interview) })
      const q = []
      const now = new Date()
      const userVal = new Date(dInterviewDate)
      const nt = (userVal.getMonth() + 1) + '/' + userVal.getDate() + '/' + userVal.getFullYear() + ' ' + sInterviewTime
      if (Date.parse(now) > Date.parse(nt)) {
        q.push('This Interview time Does not exist Do you want to continue with this time...')
      }
      if (!(new Date(dInterviewDate).getTime() > Date.now()) && !(new Date(dInterviewDate).toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10))) {
        q.push('Interview Date is Old Do you want to continue with this date...')
      }
      const [clientHoursData, employeeHoursData] = await Promise.all([
        InterviewModel.find({ iClientId, dInterviewDate }, { sInterviewTime: 1 }),
        InterviewModel.find({ iEmpId, dInterviewDate }, { sInterviewTime: 1 })
      ])
      const eHours = employeeHoursData.map(a => a.sInterviewTime)
      const cHours = clientHoursData.map(a => a.sInterviewTime)
      const rHours = [oldInterview.sInterviewTime]

      const available = interviewTime(eHours.filter(n => !rHours.includes(n)), cHours.filter(n => !rHours.includes(n)), sInterviewTime, '01:00')
      if (available !== 'OK') {
        q.push(available)
      }
      const projectWiseTag = await projectWiseTagModel.find({ iProjectId, eStatus: 'Y' }, { iProjectTagId: 1, _id: 0 })
      const projectTagId = projectWiseTag.map(a => a.iProjectTagId)
      const ProjectTag = await projectTag.find({ _id: { $in: projectTagId }, eStatus: 'Y' }, { sName: 1, _id: 1, sBackGroundColor: 1, sTextColor: 1 })
      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)
      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: id, eModule: 'Interview', sService: 'updateInterviews', eAction: 'Update', oNewFields: { ...req.body }, oOldFields: oldInterview }
      if (permission === 'Yes' || !q.length) {
        const [data] = await Promise.all([
          InterviewModel.findByIdAndUpdate(id, { ...req.body, eInterviewStatus, aProjectTag: ProjectTag }, { new: true, runValidators: true }),
          take.create(logs)
        ])
        // await notificationsender(req, data._id, 'Interview is update ')
        return SuccessResponseSender(res, status.Create, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].interview))
      }

      return SuccessResponseSender(res, status.Create, messages[req.userLanguage].warning.replace('##', messages[req.userLanguage].interview), { Warning: q })
    } catch (error) {
      return catchError('Interview.updateInterviews', error, req, res)
    }
  }

  async interviewFind(req, res) {
    try {
      const id = req.params.id
      const data = await InterviewModel.findOne({ _id: id, eStatus: 'Y' }).populate({ path: 'iEmpId', eStatus: 'Y', select: 'sName' }).populate({ path: 'iClientId', eStatus: 'Y', select: 'sName' }).populate({ path: 'iProjectId', eStatus: 'Y', select: 'sName' }).populate({ path: 'aTechnologyId', eStatus: 'Y' }).lean()
      if (!data) return res.status(status.NotFound).jsonp({ status: status.NotFound, message: messages[req.userLanguage].notfound.replace('##', messages[req.userLanguage].interview) })
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].interview), data)
    } catch (error) {
      return catchError('Interview.interviewFind', error, req, res)
    }
  }

  async interviewSearch(req, res) {
    try {
      let { page = 0, limit = 5, search = '', Technology, eInterviewStatus, sort = 'dCreatedAt', order = 'asc' } = req.query
      const orderBy = order && order === 'asc' ? 1 : -1
      sort = ['sEmpName', 'sClientName', 'sProjectName', 'dInterviewDate', 'eInterviewStatus', 'dCreatedAt'].includes(sort) ? sort : 'dCreatedAt'
      let results
      const [data, count] = await Promise.all([InterviewModel.find({ eStatus: 'Y' }).populate({ path: 'iEmpId', eStatus: 'Y', select: 'sName' }).populate({ path: 'iClientId', eStatus: 'Y', select: 'sName' }).populate({ path: 'iProjectId', eStatus: 'Y', select: 'sName' }).populate({ path: 'aTechnologyId', eStatus: 'Y' }).skip(Number(page)).limit(Number(limit)).lean(),
      InterviewModel.countDocuments({ eStatus: 'Y' })])

      results = data.map(a => { return { _id: a._id, sEmpName: a.iEmpId.sName, sProjectName: a.iProjectId.sName, sClientName: a.iClientId.sName, eInterviewStatus: a.eInterviewStatus, dInterviewDate: a.dInterviewDate, sInterviewTime: a.sInterviewTime, aTechnologyId: a.aTechnologyId.map(b => b.sName), dCreatedAt: a.dCreatedAt } })
      if (Technology || eInterviewStatus) {
        results = results.filter(element => {
          if (Technology && eInterviewStatus) {
            return element.aTechnologyId.includes(Technology) && element.eInterviewStatus === eInterviewStatus
          } else if (Technology) {
            return element.aTechnologyId.includes(Technology)
          }
          return element.eInterviewStatus === eInterviewStatus
        })
      }
      if (search) {
        results = searching(results, search)
      }
      const sorter2 = (sortBy, flow) => (a, b) => a[sortBy] > b[sortBy] ? flow : flow
      results = results.sort(sorter2(sort, orderBy))

      if (req.path === '/DownloadExcel') {
        return results
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].interview), { results, count })
      }
    } catch (error) {
      return catchError('Interview.interviewSearch', error, req, res)
    }
  }

  async updateFeedBack(req, res) {
    try {
      const id = req.params.id
      req.body = pick(req.body, ['sInterviewDescriptions', 'sInterviewFeedback'])
      const interview = await InterviewModel.findById({ _id: id }, { eStatus: 'Y' })
      if (!interview) { return res.status(status.NotFound).jsonp({ status: status.NotFound, message: messages[req.userLanguage].notfound.replace('##', messages[req.userLanguage].interview) }) }
      const data = await InterviewModel.findByIdAndUpdate(id, { ...req.body })

      let take = `Logs${new Date().getFullYear()}`

      take = ResourceManagementDB.model(take, Logs)
      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Interview', sService: 'updateFeedBack', eAction: 'Create', oNewFields: data, oOldFields: interview }
      await take.create(logs)
      return SuccessResponseSender(res, status.Create, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].feedback))
    } catch (error) {
      return catchError('Interview.updateFeedBack', error, req, res)
    }
  }

  async deleteInterviews(req, res) {
    try {
      const id = req.params.id
      const interview = await InterviewModel.findOne({ _id: id, eStatus: 'Y' }).lean()
      if (!interview) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].interview))
      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: id, eModule: 'Interview', sService: 'deleteInterviews', eAction: 'Delete', oOldFields: interview }
      const [data] = await Promise.all([
        InterviewModel.findByIdAndUpdate({ _id: req.params.id }, { eStatus: 'N' }),
        Logs.create(logs)
      ])
      // await notificationsender(req, data._id, 'Interview is delete ')
      if (!data) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].interview))
      return SuccessResponseSender(res, status.Deleted, messages[req.userLanguage].delete_success.replace('##', messages[req.userLanguage].interview))
    } catch (error) {
      return catchError('Interview.deleteInterviews', error, req, res)
    }
  }

  async filterInterview(req, res) {
    try {
      const { aTechnologyId, iProjectId, iClientId } = req.body
      if (iProjectId) {
        const project = await ProjectModel.findById({ _id: iProjectId, eStatus: 'Y' })
        if (!project) { return res.status(status.NotFound).jsonp({ status: status.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project) }) }
        const client = await projectWiseClient.find({ iProjectId }, { iClientId: 1 })
        const clientId = client.map(a => a.iClientId)
        const [clientName, technology] = await Promise.all([
          ClientModel.find({ _id: { $in: clientId } }, { sName: 1, _id: 1 }),
          projectWiseTechnology.find({ iProjectId }, { iTechnologyId: 1 })
        ])
        const technologyId = technology.map(a => a.iTechnologyId)
        const technologyName = await TechnologyModel.find({ _id: { $in: technologyId } }, { sName: 1, _id: 1 })
        const data = { client: clientName, technology: technologyName }
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].project), data)
      }
      if (iClientId) {
        const client = await ClientModel.findById({ _id: iClientId, eStatus: 'Y' })
        if (!client) { return res.status(status.NotFound).jsonp({ status: status.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project) }) }
        const project = await projectWiseClient.find({ iClientId }, { iProjectId: 1 })
        const projectId = project.map(a => a.iProjectId)
        const [sProjectName, technology] = await Promise.all([
          ProjectModel.find({ _id: { $in: projectId } }, { sName: 1, _id: 1 }),
          projectWiseTechnology.find({ iProjectId: { $in: projectId } }, { iTechnologyId: 1 })
        ])
        const technologyId = technology.map(a => a.iTechnologyId)
        const technologyName = await TechnologyModel.find({ _id: { $in: technologyId } }, { sName: 1, _id: 1 })
        const data = { project: sProjectName, technology: technologyName }
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].client), data)
      }
      if (aTechnologyId.length) {
        const technology = await TechnologyModel.find({ _id: { $in: aTechnologyId }, eStatus: 'Y' })
        if (technology.length) { return res.status(status.NotFound).jsonp({ status: status.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project) }) }
        const project = await projectWiseTechnology.find({ iTechnologyId: { $in: aTechnologyId }, eStatus: 'Y' }, { iProjectId: 1 })
        const projectId = project.map(a => a.iProjectId)
        const [sProjectName, client] = await Promise.all([
          ProjectModel.find({ _id: { $in: projectId } }, { sName: 1, _id: 1 }),
          projectWiseClient.find({ iProjectId: { $in: projectId } }, { iClientId: 1 })
        ])
        const clientId = client.map(a => a.iClientId)
        const clientName = await ClientModel.find({ _id: { $in: clientId }, eStatus: 'Y' }, { sName: 1, _id: 1 })
        const data = { project: sProjectName, client: clientName }
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].technology), data)
      } else {
        return ErrorResponseSender(res, status.NotAcceptable, messages[req.userLanguage].invalid)
      }
    } catch (error) {
      return catchError('Interview.filterInterview', error, req, res)
    }
  }

  async employeeList(req, res) {
    try {
      let { page = 0, limit = 15, search = '', sort = 'sName', order = 'asc' } = req.query
      const orderBy = order && order === 'asc' ? 1 : -1
      const sorting = { [sort]: orderBy }
      const q = []
      if (search) {
        search = { $or: [{ sName: { $regex: new RegExp('^.*' + search + '.*', 'i') } }] }
        q.push(search)
      }
      q.push({ eStatus: 'Y' })
      const [employee, employeeCount] = await Promise.all([
        EmployeeModel.find({ $and: q }, { _id: 1, sName: 1 }).sort(sorting).skip(Number(page)).limit(Number(limit)).lean(),
        EmployeeModel.find({ $and: [...q] }).count()])
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].employee), { employee, count: employeeCount })
    } catch (error) {
      return catchError('Interview.employeeList', error, req, res)
    }
  }

  async ProjectList(req, res) {
    try {
      let { page = 0, limit = 15, search = '', sort = 'sName', order = 'asc' } = req.query
      const orderBy = order && order === 'asc' ? 1 : -1
      const sorting = { [sort]: orderBy }
      const q = []
      if (search) {
        search = { $or: [{ sName: { $regex: new RegExp('^.*' + search + '.*', 'i') } }] }
        q.push(search)
      }
      q.push({ eStatus: 'Y' })
      const project = await ProjectModel.find({ $and: q }, { _id: 1, sName: 1 }).sort(sorting).skip(Number(page)).limit(Number(limit)).lean()
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].project), project)
    } catch (error) {
      return catchError('Interview.ProjectList', error, req, res)
    }
  }

  async employeeInterviews(req, res) {
    try {
      const id = req.params.id
      let { page = 0, limit = 5, sort = 'dCreatedAt', order = 'asc' } = req.query
      const orderBy = order && order === 'asc' ? 1 : -1
      sort = ['sClientName', 'sProjectName', 'dInterviewDate', 'eInterviewStatus'].includes(sort) ? sort : 'dCreatedAt'
      const sorting = { [sort]: orderBy }
      const Employee = await EmployeeModel.findById({ _id: id, eStatus: 'Y' })
      if (!Employee) { return res.status(status.NotFound).jsonp({ status: status.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].employee) }) }
      const [interviews, interviewsCount] = await Promise.all([
        InterviewModel.find({ iEmpId: id, eStatus: 'Y' }).sort(sorting).skip(Number(page)).limit(Number(limit)).lean(),
        InterviewModel.find({ iEmpId: id, eStatus: 'Y' }).count()
      ])
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].employee), { interviews, count: interviewsCount })
    } catch (error) {
      return catchError('Interview.employeeInterviews', error, req, res)
    }
  }
}
function searching(Data, value) {
  const condition = new RegExp('^.*' + value + '.*', 'i')
  const client = Data.filter(function (el) {
    return condition.test(el.sClientName)
  })
  const project = Data.filter(function (el) {
    return condition.test(el.sProjectName)
  })
  const employee = Data.filter(function (el) {
    return condition.test(el.sEmpName)
  })
  const da = [].concat.apply([], [client, project, employee])
  return da
}
module.exports = new Interview()
