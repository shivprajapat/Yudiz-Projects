const { handleCatchError } = require('../../helper/utilities.services')
const ProjectModel = require('../Project/model')
const EmployeeModel = require('../Employee/model')
const NotificationModel = require('./model')
const { queuePush } = require('../../helper/redis')
const projectwiseemployeeModel = require('../Project/projectwiseemployee.model')
const config = require('../../config/config')
const InterviewModel = require('../Interview/model')
const CronJob = require('cron').CronJob
const ClientModel = require('../Client/model')
const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
const JobProfileModel = require('../JobProfile/model')
const DepartmentModel = require('../Department/model')
const { makeRandomeString } = require('../../helper/utilities.services')

async function notificationsenderInterview(req, params, sBody) {
  try {
    const data = await InterviewModel.findOne({ _id: params }).lean()
    const project = await ProjectModel.findOne({ _id: data.iProjectId }).lean()
    console.log('project', project)

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

    const putData = { sPushToken, sTitle: 'Resource Management', sBody: `interview will be in ${sBody} with client ${client.sName} and employee ${Employee.sName} for project ${project.sName} by ${person.sName}(${person.sEmpId})`, sLogo: data?.sLogo || 'Default/magenta_explorer-wallpaper-3840x2160.jpg', sType: 'interview', metadata, aSenderId: ids }

    await queuePush('Project:Notification', putData)
  } catch (error) {
    console.log(error)
  }
}

async function notificationsender(req, params, sTitle = 'Resource Management', sBody) {
  const data = await ProjectModel.findOne({ _id: params }).lean()
  console.log('data', data)

  const allEmployee = await EmployeeModel.find({ _id: { $in: [data.iProjectManagerId, data.iBAId, data.iBDId, data.iCreatedBy, data.iLastUpdateBy] }, eStatus: 'Y' }).lean()

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
    iProjectId: data._id,
    sProjectName: data.sName,
    iCreatedBy: '62a9c5afbe6064f125f3501f' || data.iLastUpdateBy,
    sType: 'project',
    sLogo: data.sLogo
  }

  const putData = { sPushToken, sTitle: 'Resource Management', sBody: `${data.sName}${sBody}`, sLogo: data.sLogo, sType: 'project', metadata, aSenderId: ids }

  console.log('putData', putData)
  await queuePush('Project:Notification', putData)
}

async function notificationsenderForEmployee(req, params, sTitle = 'Resource Management', sBody) {
  // const data = await ProjectModel.findOne({ _id: params }).lean()
  // console.log('data', data)

  const employeeDetails = await EmployeeModel.findOne({ _id: params, eStatus: 'Y' }).populate({
    path: 'iDepartmentId',
    select: '_id sName sKey eStatus',
    match: { eStatus: 'Y' }
  }).populate({
    path: 'iJobProfileId',
    select: '_id sName sKey eStatus',
    match: { eStatus: 'Y' }
  })

  if (employeeDetails.iJobProfileId.sKey && employeeDetails.iDepartmentId.sKey) {
    // find department head

    const jobProfile = await JobProfileModel.find({
      eStatus: 'Y',
      sPrefix: {
        $in: ['Superior', 'Head', 'Lead', 'Other', 'Manager']
      }
    }, { _id: 1 }).lean()

    const departmentId = await DepartmentModel.find({
      _id: employeeDetails.iDepartmentId._id,
      eStatus: 'Y'
    }, { _id: 1 }).lean()

    const otherEmployee = await EmployeeModel.find({
      eStatus: 'Y',
      $and: [
        { iDepartmentId: { $in: departmentId } },
        { iJobProfileId: { $in: jobProfile.map((item) => item._id) } }
      ]
    }, {
      _id: 1,
      aJwtTokens: 1
    }).lean()

    const allEmployee = [...otherEmployee]

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
      iEmployeeId: employeeDetails._id,
      sProjectName: employeeDetails.sName,
      iCreatedBy: employeeDetails.iLastUpdateBy,
      sType: 'employee',
      sLogo: employeeDetails?.sLogo
    }

    const putData = { sPushToken, sTitle: 'Resource Management', sBody, sLogo: employeeDetails?.sLogo || '', sType: 'employee', metadata, aSenderId: ids }

    console.log('putData', putData)
    await queuePush('Employee:Notification', putData)
  }
}

const getFreeProjects = async () => {
  try {
    const projectsFixed = await ProjectModel.find({ eStatus: 'Y', eProjectStatus: { $in: ['In Progress', 'On Hold', 'Pending'] }, dEndDate: { $gt: Date.now() }, eProjectType: 'Fixed' }).lean()
    const projectsDedicated = await ProjectModel.find({ eStatus: 'Y', eProjectStatus: { $in: ['In Progress', 'On Hold', 'Pending'] }, dEndDate: { $gt: Date.now() }, eProjectType: 'Dedicated' }).lean()
    const date = new Date()
    // const projectsQueue = []

    if (projectsFixed.length) {
      for (const project of projectsFixed) {
        const { dEndDate } = project
        const endDate = new Date(dEndDate)
        const diff = endDate.getTime() - date.getTime()
        const diffDays = Math.ceil(diff / (1000 * 3600 * 24))

        if (diffDays >= 30 && diffDays < 31) {
          notificationsender('req', project._id, project.sName, `${project.sName} will be completed in next month`)

          // const putData = { sTopic: 'All', sTitle: project.sName, sBody: `${project.sName} will be completed in next month` }
          // await queuePush('Welcome:Notification', putData)
          // projectsQueue.push(putData)
          await getFreeEmployees(project._id, project.sName, 'will be free from next month')
        }

        if (diffDays >= 7 && diffDays < 8) {
          notificationsender('req', project._id, project.sName, `${project.sName} will be completed in next week`)
          // const putData = { sTopic: 'All', sTitle: project.sName, sBody: `${project.sName} will be completed in next week` }
          // await queuePush('Welcome:Notification', putData)
          // projectsQueue.push(putData)
          await getFreeEmployees(project._id, project.sName, 'will be free from next week')
        }

        if (diffDays === 1) {
          notificationsender('req', project._id, project.sName, `${project.sName} will be completed in tomorrow`)
          // const putData = { sTopic: 'All', sTitle: project.sName, sBody: `${project.sName} will be completed tomorrow` }
          // await queuePush('Welcome:Notification', putData)
          // projectsQueue.push(putData)
          await getFreeEmployees(project._id, project.sName, 'will be free from tomorrow')
        }
      }
    }

    if (projectsDedicated.length) {
      for (const project of projectsDedicated) {
        const { dBillingCycleDate } = project
        const endDate = new Date(dBillingCycleDate)
        const diff = endDate.getTime() - date.getTime()
        const diffDays = Math.ceil(diff / (1000 * 3600 * 24))

        if (diffDays >= 30 && diffDays < 31) {
          notificationsender('req', project._id, project.sName, `${project.sName} project billing cycle will be completed in next month`)
          // const putData = { sTopic: 'All', sTitle: project.sName, sBody: `${project.sName} will be completed in next month` }
          // await queuePush('Welcome:Notification', putData)
          // projectsQueue.push(putData)
          // await getFreeEmployees(project._id, project.sName, 'will be free from next month')
          await getFreeEmployees(project._id, project.sName, 'will be free from next month')
        }

        if (diffDays >= 7 && diffDays < 8) {
          notificationsender('req', project._id, project.sName, `${project.sName} project billing cycle will be completed in next week`)
          // const putData = { sTopic: 'All', sTitle: project.sName, sBody: `${project.sName} will be completed in next week` }
          // await queuePush('Welcome:Notification', putData)
          // projectsQueue.push(putData)
          await getFreeEmployees(project._id, project.sName, 'will be free from next week')
        }

        if (diffDays === 1) {
          notificationsender('req', project._id, project.sName, `${project.sName} project billing cycle will be completed in tomorrow`)
          // const putData = { sTopic: 'All', sTitle: project.sName, sBody: `${project.sName} will be completed tomorrow` }
          // await queuePush('Welcome:Notification', putData)
          // projectsQueue.push(putData)
          await getFreeEmployees(project._id, project.sName, 'will be free from tomorrow')
        }
      }
    }

    return
  } catch (error) {
    handleCatchError(error)
  }
}

const PendingProjects = async () => {
  try {
    const projects = await ProjectModel.find({ eStatus: 'Y', eProjectStatus: 'Pending' }).lean()
    if (projects.length) {
      for (const project of projects) {
        const { dCreatedAt } = project.dCreatedAt
        const date = new Date(dCreatedAt)
        const diff = date.getTime() - Date.now()
        const diffDays = Math.ceil(diff / (1000 * 3600 * 24))

        if (diffDays === 7) {
          notificationsender('req', project._id, project.sName, `${project.sName} project is pending from last week`)
        }
        if (diffDays === 14) {
          notificationsender('req', project._id, project.sName, `${project.sName} project is pending from last two week`)
        }
        if (diffDays === 30) {
          notificationsender('req', project._id, project.sName, `${project.sName} project is pending from last month`)
        }
        const reminder = diffDays / 30
        if (Math.floor(reminder) === reminder) {
          notificationsender('req', project._id, project.sName, `${project.sName} project is on hold from last ${diffDays} month`)
        }
      }
    }
  } catch (error) {
    handleCatchError(error)
  }
}

const onHoldProjects = async () => {
  try {
    const projects = await ProjectModel.find({ eStatus: 'Y', eProjectStatus: 'On Hold' }).lean()
    if (projects.length) {
      for (const project of projects) {
        const { dUpdatedAt } = project.dUpdatedAt
        const date = new Date(dUpdatedAt)
        const diff = date.getTime() - Date.now()
        const diffDays = Math.ceil(diff / (1000 * 3600 * 24))

        if (diffDays === 1) {
          notificationsender('req', project._id, project.sName, `${project.sName} project is on hold from yesterday`)
        }
        if (diffDays === 7) {
          notificationsender('req', project._id, project.sName, `${project.sName} project is on hold from last week`)
        }
        if (diffDays === 14) {
          notificationsender('req', project._id, project.sName, `${project.sName} project is on hold from last two week`)
        }
        const reminder = diffDays / 30
        if (Math.floor(reminder) === reminder) {
          notificationsender('req', project._id, project.sName, `${project.sName} project is on hold from last ${diffDays} month`)
        }
      }
    }
  } catch (error) {
    handleCatchError(error)
  }
}

const getFreeEmployees = async (_id, sName, sBody) => {
  try {
    // const employees = await projectwiseemployeeModel.find({ eStatus: 'Y', iProjectId: _id }).populate('iEmployeeId').lean()

    const employees = await EmployeeModel.find({ eStatus: 'Y', eAvailabilityStatus: 'Available' }, {
      _id: 1, sName: 1, eAvailabilityStatus: 1, nAvailabilityHours: 1, sEmpId: 1
    }).lean()

    if (employees.length) {
      for (const employee of employees) {
        await notificationsenderForEmployee('req', employee._id, 'Resource Management', `${employee.sName}(${employee.sEmpId}) -> ${employee.nAvailabilityHours} Hours -> status ${employee.eAvailabilityStatus}`)
      }
    }

    // const Employee = []
    // if (employees.length) {
    //   employees.forEach(async(employee) => {
    //     Employee.push(`${employee.sName}(${employee.sEmpId}) -> ${employee.nAvailabilityHours} Hours `)
    //   })

    //   // await notificationsender('req', _id, sName, `${Employee.join(',')}` + ' ' + `${sBody}` + ' from Project ' + `${sName}`)
    //   // const putData = { sTopic: 'All', sTitle: sName, sBody: `${Employee.join(',')}` + ' ' + `${sBody}` + ' from Project ' + `${sName}` }
    //   // await queuePush('Welcome:Notification', putData)
    // }
    return
  } catch (error) {
    handleCatchError(error)
  }
}
const getScheduleInterview = async () => {
  try {
    const interviews = await InterviewModel.find({ eStatus: 'Y', dInterviewDate: { $gt: Date.now() } }).lean()
    console.log(interviews)
    const date = new Date()

    if (interviews.length) {
      for (const interview of interviews) {
        const { dInterviewDate } = interview
        const endDate = new Date(dInterviewDate)
        const diff = Math.abs(endDate.getTime() - date.getTime())
        console.log(diff)
        const diffDays = Math.ceil(diff / (1000 * 3600 * 24))
        console.log(diffDays)

        if (diffDays >= 30 && diffDays < 31) {
          notificationsenderInterview('req', interview._id, 'next month')
        }

        if (diffDays >= 7 && diffDays < 8) {
          notificationsenderInterview('req', interview._id, 'next week')
        }

        if (diffDays === 1) {
          notificationsenderInterview('req', interview._id, 'tomorrow')
        }

        if (diffDays === 0) {
          notificationsenderInterview('req', interview._id, 'today')
        }
      }
    }
  } catch (error) {
    handleCatchError(error)
  }
}

const isNotificationReadbyAll = async () => {
  try {
    const notifications = await NotificationModel.find({ eStatus: 'Y', isReadByAll: false }).lean()
    for (const notification of notifications) {
      const { aSenderIds, aReceiverIds } = notification
      const isReadByAll = aSenderIds.every((id) => aReceiverIds.includes(id))
      if (isReadByAll) {
        await NotificationModel.updateOne({ _id: notification._id }, { isReadByAll: true })
      }
    }
    return
  } catch (error) {
    handleCatchError(error)
  }
}

const billingCycleProjects = async () => {
  // projecdt startus should be in Progress and if possible then use flag
  const projects = await ProjectModel.find({ eStatus: 'Y', eProjectType: 'Dedicated' }).lean()

  const date = new Date()

  if (projects.length) {
    for (const project of projects) {
      const date1 = new Date(new Date().getFullYear(), new Date().getMonth(), project?.dBillingCycleDate || 1)

      if (!isNaN(date1.getTime())) {
        const diff = date1.getTime() - date.getTime()
        const diffDays = Math.ceil(diff / (1000 * 3600 * 24))

        if (diffDays === 0) {
          notificationsender('req', project._id, project.sName, `${project.sName} project billing cycle will be completed today`)
        }
        if (diffDays === 1) {
          notificationsender('req', project._id, project.sName, `${project.sName} project billing cycle will be completed tomorrow`)
        }
        if (diffDays === 7) {
          notificationsender('req', project._id, project.sName, `${project.sName} project billing cycle will be completed in next week`)
        }
        if (diffDays === 30) {
          notificationsender('req', project._id, project.sName, `${project.sName} project billing cycle will be completed in next month`)
        }
      }
    }
  }
}

async function init() {
  // await getFreeProjects()
  // await isNotificationReadbyAll()
  // await billingCycleProjects()
  // await noticePeriodProjects()
  // console.log('init cron working')
}

async function init1() {
  console.log('init1 cron working')
  // getScheduleInterview()
}

async function backUpdatabase(minutes, stringName) {
  console.log('---------------------------------start---------------------------------')
  try {
    // create a connection to database first target second source using mongoClient
    const MongoClient = require('mongodb').MongoClient
    // /first source
    const DB_URI = 'mongodb+srv://pranav:pranav123@cluster0.fpjwy.mongodb.net/resource_managementa'
    const DB_NAME = 'resource_managementa'
    const OUTPUT_DIR = 'output-directory'
    const client = new MongoClient(DB_URI)

    const data1 = await client.connect()
    console.log('data1', data1)

    const db = client.db()
    const collections = await db.admin().listDatabases()
    console.log(collections)

    // second target
    const DB_URI1 = `mongodb://localhost:27017/resource_managementa_${stringName}_${minutes}`
    const DB_NAME1 = `resource_managementa_${stringName}_${minutes}`
    const OUTPUT_DIR1 = 'output-directory'
    const client1 = new MongoClient(DB_URI1)

    // console.log('client1', client1)

    // await client1.connect()

    // // get Collection from first source
    // const db = client.db(DB_NAME)
    // const collections = await db.collections()
    // console.log(collections)

    // // get Collection from second target

    // const db1 = client1.db(DB_NAME1)
    // const collections1 = await db1.collections()
    // console.log(collections1)

    // // trasfer data from one db to other db
    // for (const c of collections) {
    //   const collectionName = c.s.namespace.collection
    //   const collectionData = await db.collection(c.s.namespace.collection).find({}).toArray()
    //   console.log(collectionName, collectionData.length)
    //   // console.log(collectionData)

    //   // check if c exist in db1
    //   const collectionExist = await db1.listCollections({ name: collectionName }).toArray()
    //   console.log('collectionExist', collectionExist)
    //   if (!collectionExist.length) {
    //     // create collection if not exist with same name and index which is in first source
    //     await db1.createCollection(collectionName)
    //     // index
    //     const indexes = await db.collection(collectionName).indexes()
    //     console.log('indexes', indexes)
    //     for (const i of indexes) {
    //       if (i.name !== '_id_') {
    //         await db1.collection(collectionName).createIndex(i.key)
    //       }
    //     }

    //     console.log('exist')

    //     // chunk data and insert
    //     const chunkSize = 10
    //     const chunkData = []
    //     for (let i = 0; i < collectionData.length; i += chunkSize) {
    //       chunkData.push(collectionData.slice(i, i + chunkSize))
    //     }

    //     for (const c of chunkData) {
    //       await db1.collection(collectionName).insertMany(c)
    //     }
    //   }
    //   console.log('done', collectionName)
    // }
    // console.log('---------------------------------done---------------------------------')
  } catch (error) {
    console.log(error)
  }
}

async function init2(minutes) {
  const stringName = new Date().toLocaleString('en-Us', { timeZone: 'Asia/Kolkata' })
  console.log('name', Date())

  // random number

  // await backUpdatabase(minutes, makeRandomeString(5))
  console.log(new Date().toLocaleString('en-Us', { timeZone: 'Asia/Kolkata' }))
  console.log('init2 cron working', minutes)
}

class CronInit {
  constructor() {
    // this.cronJob1 = new CronJob('0 33 17 * * *', init, null, true, 'Asia/Kolkata')
    // this.cronJob2 = new CronJob('*/2 * * * * *', init1, null, true, 'Asia/Kolkata')
    // this.cronJob3 = new CronJob('0 */1 * * * *', init2(3), null, true, 'Asia/Kolkata')
  }
}

module.exports = new CronInit()
