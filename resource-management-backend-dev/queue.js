const { queuePop, queuePush, getDataUsingScore, deleteByScore, queueLength } = require('./helper/redis')
const { pushTopicNotification, pushNotificationUsingTokens } = require('./helper/firebase.service')
const { handleCatchError } = require('./helper/utilities.services')
const NotificationModel = require('./models_routes_service/Notification/model')
const s3 = require('./helper/s3')

const CurrencyService = require('./models_routes_service/Currency/services')
const { excelProcess } = require('./models_routes_service/Logs/services')
// const path = require('path')
const config = require('./config/config')
const LogsModel = require('./models_routes_service/Logs/model')
const { ResourceManagementDB } = require('./database/mongoose')
// const { ifExists } = require('./helper/s3')

// const { uploadStream } = require('./helper/s3')

// async function sendNotifications() {
//   let data
//   try {
//     data = await queuePop('Welcome:Notification')
//     if (!data) {
//       setTimeout(() => { sendNotifications() }, 2000)
//       return
//     }

//     console.log(data)

//     data = JSON.parse(data)
//     await pushTopicNotification(data.sTopic, data.sTitle, data.sBody)
//     return data
//   } catch (error) {
//     console.log(error.message)
//     sendNotifications()
//   }
// }

async function sendNotifications() {
  let data
  try {
    data = await queuePop('Welcome:Notification')

    if (!data) {
      setTimeout(() => { sendNotifications() }, 1000)
      return
    }

    data = JSON.parse(data)

    if (data.isRecorded === 'Y') {
      await NotificationModel.create({
        sHeading: data.sTitle,
        sMessage: data.sBody
      })
    }
    if (data.isNotify === 'Y') { await pushTopicNotification(data.sTopic, data.sTitle, data.sBody, data.sIcon, data.sLink) }

    sendNotifications()
    return
  } catch (error) {
    console.log(error.message)
    await queuePush('dead:Welcome:Notification', data)
    handleCatchError(error)
  }
}

async function sendProjectNotifications() {
  let data
  try {
    data = await queuePop('Project:Notification')

    if (!data) {
      setTimeout(() => { sendProjectNotifications() }, 2000)
      return
    }

    data = JSON.parse(data)
    let notification = {}
    let iNotificationId = ''

    if (data?.isRecorded === 'Y') {
      notification = await NotificationModel.create({
        sHeading: data.sTitle,
        sMessage: data.sBody,
        iCreatedBy: data.iCreatedBy,
        sUrl: data.sUrl,
        sLogo: data.sLogo,
        sType: data.sType,
        metadata: data.metadata,
        aSenderId: data.aSenderId
      })
      iNotificationId = notification?._id || ''
    }

    if (data?.isNotify === 'Y') {
      if (iNotificationId) {
        const notificationFormateData = { ...data, iNotificationId }
        await pushNotificationUsingTokens(notificationFormateData)
      } else {
        const notificationFormateData = { ...data }
        await pushNotificationUsingTokens(notificationFormateData)
      }
    }
    data = ''
    sendProjectNotifications()
    return
  } catch (error) {
    await queuePush('dead:Project:Notification', data)
    handleCatchError(error)
  }
}

async function sendEmployeeNotifications() {
  let data
  try {
    data = await queuePop('Employee:Notification')

    if (!data) {
      setTimeout(() => { sendProjectNotifications() }, 1000)
      return
    }

    data = JSON.parse(data)
    let notification = {}
    let iNotificationId = ''

    if (data?.isRecorded === 'Y') {
      notification = await NotificationModel.create({
        sHeading: data.sTitle,
        sMessage: data.sBody,
        iCreatedBy: data.iCreatedBy,
        sLogo: data.sLogo,
        sType: data.sType,
        metadata: data.metadata,
        aSenderId: data.aSenderId
      })
      iNotificationId = notification?._id || ''
    }

    if (data?.isNotify === 'Y') {
      if (iNotificationId) {
        const notificationFormateData = { ...data, iNotificationId }
        await pushNotificationUsingTokens(notificationFormateData)
      } else {
        const notificationFormateData = { ...data }
        await pushNotificationUsingTokens(notificationFormateData)
      }
    }

    sendEmployeeNotifications()
    return
  } catch (error) {
    await queuePush('dead:Welcome:Notification', data)
    handleCatchError(error)
  }
}

async function sendTimedNotification() {
  let data
  const range = new Date().getTime()

  try {
    data = await getDataUsingScore('scheduler', range, range + (5000))
    await deleteByScore('scheduler', range, range + (5000))

    if (!data.length) {
      setTimeout(() => { sendTimedNotification() }, 2000)
      return
    }

    data.map(async (item) => {
      await queuePush('Welcome:Notification', JSON.parse(item))
    })

    sendTimedNotification()

    return
  } catch (error) {
    await queuePush('dead:scheduler', data)
    handleCatchError(error)
  }
}

// async function sendTimedNotifications() {
//   let data
//   try {
//     data = await queuePop('Welcome:Notification')

//     console.log(data)

//     if (!data) {
//       setTimeout(() => { sendNotifications() }, 1000)
//       return
//     }

//     data = JSON.parse(data)

//     console.log(data)

//     await NotificationModel.create({
//       sHeading: data.sTitle,
//       sMessage: data.sBody
//     })

//     await pushTopicNotification(data.sTopic, data.sTitle, data.sBody, data.sIcon, data.sLink)

//     sendNotifications()
//     return
//   } catch (error) {
//     await queuePush('dead:Welcome:Notification', data)
//     handleCatchError(error)
//   }
// }

async function downloadExcel() {
  let data
  try {
    data = await queuePop('file_excel1')
    if (!data) {
      setTimeout(() => { downloadExcel() }, 5000)
      return
    }

    data = JSON.parse(data)

    const params = {
      Bucket: config.S3_BUCKET_NAME,
      Key: data.file
    }

    // check if file exists
    const fileExist = await s3.getObjectDetails(params)

    console.log(fileExist, 'casc')

    if (!fileExist) {
      // queue for email sending
      await queuePush('file_excel1', data)
    }
    if (fileExist) {
      // get file from s3 with expiry time
      const params = {
        Bucket: config.S3_BUCKET_NAME,
        Key: data.Key,
        Expires: 60 * 5
      }
      const url = await s3.getUrlOfObject(params)

      console.log('url', url)

      console.log('data', data)

      await queuePush('email_excel', { ...data, flag: 1, EMAIL: data.email })
    }

    // const filePath = path.join(__dirname, data.file)
    // const stat = fs.statSync(filePath)

    // console.log(stat)

    downloadExcel()
  } catch (error) {
    console.log(error)
    handleCatchError(error)
    // downloadExcel()
  }
}

// async function preflightDownloadExcel() {
//   let data
//   try {
//     data = await queuePop('preflight_download_excel')
//     if (!data) {
//       setTimeout(() => { preflightDownloadExcel() }, 5000)
//       return
//     }

//     data = JSON.parse(data)

//     // if flag 1 then upload to s3 and delete file

//     // console.log(data)

//     // const filePath = `ExcelFile/${data.file}`
//     // const stat = fs.statSync(filePath)

//     // // console.log(stat)

//     // const readStream = fs.createReadStream(filePath)

//     // const uploadParams = {
//     //   Bucket: 'excel-file',
//     //   Key: data.file,
//     //   Body: readStream,
//     //   ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//     //   ContentLength: stat.size
//     // }

//     // const upload = await uploadStream(uploadParams)

//     // if (upload) {
//     //   fs.unlinkSync(filePath)
//     // }

//     // const file = await queuePop('preflight_download_excel_2')

//     const filePath = '/Users/yudiz/Documents/resource-management-node/ExcelFile/'

//     const fileName = data.file

//     if (!fileName) {
//       throw new Error('the fileName is empty')
//     }
//     if (!filePath) {
//       throw new Error('the file absolute path is empty')
//     }

//     const fileNameInS3 = `pranav/${fileName}` // the relative path inside the bucket
//     console.info(`file name: ${fileNameInS3} file path: ${filePath}`)

//     if (!fs.existsSync(filePath)) {
//       throw new Error(`file does not exist: ${filePath}`)
//     }

//     const statsFile = fs.statSync(filePath)
//     console.log(`file size: ${Math.round(statsFile.size / 1024 / 1024)}MB`)

//     let uploadId
//     try {
//       const params = {
//         Bucket: BucketName,
//         Key: fileNameInS3
//       }
//       const result = await s3.createMultipartUpload(params).promise()
//       uploadId = result.UploadId
//       console.info(`csv ${fileNameInS3} multipart created with upload id: ${uploadId}`)
//     } catch (e) {
//       throw new Error(`Error creating S3 multipart. ${e.message}`)
//     }

//     const chunkSize = 10 * 1024 * 1024 // 10MB
//     const readStream = fs.createReadStream(`${filePath}/${fileName}`)

//     console.log('readStream', readStream)

//     let partNumber = 0
//     const parts = []
//     let offset = 0

//     while (offset < statsFile.size) {
//       partNumber++
//       const end = Math.min(offset + chunkSize, statsFile.size)

//       const partParams = {
//         Body: readStream,
//         Bucket: BucketName,
//         Key: fileNameInS3,
//         PartNumber: partNumber,
//         UploadId: uploadId
//       }

//       const partResult = await s3.uploadPart(partParams).promise()
//       parts.push({
//         ETag: partResult.ETag,
//         PartNumber: partNumber
//       })
//       offset = end
//     }

//     const completeParams = {
//       Bucket: BucketName,
//       Key: fileNameInS3,
//       MultipartUpload: {
//         Parts: parts
//       },
//       UploadId: uploadId
//     }

//     const completeResult = await s3.completeMultipartUpload(completeParams).promise()
//     console.log(`csv ${fileNameInS3} multipart completed with upload id: ${uploadId}`)
//     // return completeResult

//     preflightDownloadExcel()

//     return
//   } catch (error) {
//     handleCatchError(error)
//   }
// }

async function sendEmailQueue() {
  let data
  try {
    data = await queuePop('email_excel')
    if (!data) {
      setTimeout(() => { sendEmailQueue() }, 5000)
      return
    }

    data = JSON.parse(data)

    const presigned = await s3.getSignedUrlForExcel(data.Key)

    const params = {
      Bucket: config.S3_BUCKET_NAME,
      Key: data.Key
    }

    const objectData = await s3.getObject(params)

    const attachments = [{
      type: 'application/xlsx',
      filename: 'resource.xlsx',
      content: objectData.Body
    }]

    await sendEmail({ ...data, url: presigned, attachments })

    sendEmailQueue()
  } catch (error) {
    handleCatchError(error)
    await queuePush('dead_email_excel', data)
    // sendEmailQueue()
  }
}

async function addCurrencyToEmployee() {
  let data
  try {
    data = await queuePop('Currency:Add')

    if (!data) {
      setTimeout(() => { addCurrencyToEmployee() }, 1000)
      return
    }

    data = JSON.parse(data)

    if (data.action === 'add') {
      try {
        CurrencyService.addNewCurrencyToEveryEmployee({ ...data })
      } catch (error) {
        console.log(error.message)
      }
    }
    if (data.action === 'delete') {
      try {
        CurrencyService.deleteCurrencyToEveryEmployee({ ...data })
      } catch (error) {
        console.log(error.message)
      }
    }
    // await NotificationModel.create({
    //   sHeading: data.sTitle,
    //   sMessage: data.sBody
    // })

    // await pushTopicNotification(data.sTopic, data.sTitle, data.sBody, data.sIcon, data.sLink)

    addCurrencyToEmployee()
    return
  } catch (error) {
    console.log(error.message)
    await queuePush('dead:Currency:Add', data)
    handleCatchError(error)
  }
}

//   // uplaod excel to s3 using stream
//   // delete file from local
//   // send notification to user

//   let data
//   try {
//     data = await queuePop('upload_excel')
//     if (!data) {
//       setTimeout(() => { uploadExcel() }, 5000)
//       return
//     }

//     data = JSON.parse(data)

//     // console.log(data)

//     return
//   } catch (error) {
//     handleCatchError(error)
//   }
// }

// const initqueue = async () => {
//   try {
//     await sendNotifications()
//     await sendTimedNotification()
//     await downloadExcel()
//     await sendEmailQueue()
//     await sendProjectNotifications()
//   } catch (error) {
//     handleCatchError(error)
//   }
// }

async function excelSenderProcess() {
  let data
  try {
    data = await queuePop('excelProcess')
    if (!data) {
      setTimeout(() => { excelSenderProcess() }, 10000)
      return
    }

    data = JSON.parse(data)

    await excelProcess(data)

    // await NotificationModel.create({
    //   sHeading: data.sTitle,
    //   sMessage: data.sBody
    // })

    // await pushTopicNotification(data.sTopic, data.sTitle, data.sBody, data.sIcon, data.sLink)

    excelSenderProcess()
  } catch (error) {
    console.log(error.message)
    await queuePush('dead:excelProcess', { data, error: error.message })
    handleCatchError(error)
  }
}

async function logCreation() {
  let data
  try {
    data = await queuePop('logs', 20)
    if (!data || data.length === 0) {
      setTimeout(() => { logCreation() }, 10000)
      return
    }

    data = data.map((item) => JSON.parse(item))

    console.log(data)

    for (let i = 0; i < data.length; i++) {
      const take = ResourceManagementDB.model(data[i].sDbName, LogsModel)
      await take.create(data[i])
    }

    logCreation()
  } catch (error) {
    console.log(error.message)
    await queuePush('dead:logs', { data, error: error.message })
    handleCatchError(error)
  }
}

class InitQueue {
  constructor() {
    this.initqueue()
  }

  async initqueue() {
    try {
      await sendNotifications()
      await sendTimedNotification()
      await downloadExcel()
      await sendEmailQueue()
      await sendProjectNotifications()
      await addCurrencyToEmployee()
      await excelSenderProcess()
      await sendEmployeeNotifications()
      await logCreation()
    } catch (error) {
      handleCatchError(error)
    }
  }
}

module.exports = new InitQueue()

// module.exports = { initqueue, sendNotifications, sendTimedNotification, downloadExcel, sendEmailQueue, sendProjectNotifications }
