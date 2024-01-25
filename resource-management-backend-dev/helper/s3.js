const config = require('../config/config')
const aws = require('aws-sdk')
const { handleCatchError } = require('../helper/utilities.services')
const moment = require('moment')
// const path = require('path')
// const fs = require('fs')
// const { queuePush, queuePop } = require('../queue')

require('dotenv').config()

let s3

async function setProcessEnvUsingSecretManager() {
  try {
    if (process.env.NODE_ENV === 'production') {
      console.log('production', {
        region: process.env?.region,
        secretAccessKey: process.env.secretAccessKey,
        accessKeyId: process.env.accessKeyId,
        signatureVersion: process.env?.signatureVersion,
        sessionToken: process.env.sessionToken,
        Expiration: process.env.Expiration
      })

      const client = new aws.SecretsManager({
        region: process.env?.region || 'ap-south-1',
        secretAccessKey: process.env.secretAccessKey,
        accessKeyId: process.env.accessKeyId,
        signatureVersion: process.env?.signatureVersion || 'v4',
        sessionToken: process.env.sessionToken
      })

      const data = await client.getSecretValue({ SecretId: 'prod' }).promise()

      if ('SecretString' in data) {
        const secretData = JSON.parse(data.SecretString)
        console.log('*'.repeat(100))
        console.log('secretData', secretData)
        console.log('*'.repeat(100))
        for (const key in secretData) {
          process.env[key] = secretData[key]
        }

        s3 = new aws.S3({
          region: process.env?.region || 'ap-south-1',
          secretAccessKey: process.env.secretAccessKey,
          accessKeyId: process.env.accessKeyId,
          signatureVersion: process.env.signatureVersion,
          sessionToken: process.env.sessionToken
        })
      }
    } else {
      // Fallback to using config for non-production environment
      for (const key in config) {
        console.log('+'.repeat(100))
        process.env[key] = config[key]
        console.log('+'.repeat(100))
      }

      console.log('else', {
        region: process.env?.Region,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        signatureVersion: process.env?.signatureVersion || 'v4',
        sessionToken: process.env.sessionToken
      })
      s3 = new aws.S3({
        region: process.env.Region || 'ap-south-1',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        signatureVersion: 'v4'
      })
      // console.log(process.env)
    }
  } catch (error) {
    console.log('---------------------------', error)
    return handleCatchError('setProcessEnvUsingSecretManager', error)
  }
}

async function assumeRoleCheck() {
  try {
    aws.config.update({ region: 'ap-south-1' })

    // console.log('node_ENV', process.env.NODE_ENV)
    const s31 = await aws.config.credentialProvider.resolvePromise()

    console.log('s31', s31)

    process.env.region = 'ap-south-1'
    process.env.secretAccessKey = s31.metadata.SecretAccessKey
    process.env.accessKeyId = s31.metadata.AccessKeyId
    process.env.signatureVersion = 'v4'
    process.env.sessionToken = s31.metadata.Token
    process.env.Expiration = s31.metadata.Expiration
  } catch (error) {
    console.log('!'.repeat(100))
    console.log(error)
    console.log('!'.repeat(100))
  }
}

async function generateUploadUrl(sFileName = 'user', sContentType, path) {
  try {
    sFileName = sFileName.replace('/', '-')

    sFileName = sFileName.replace(/\s/gi, '-')

    let fileKey = ''
    const s3Path = path

    fileKey = `${Date.now()}_${sFileName}`

    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Path + fileKey,
      Expires: 300,
      ContentType: sContentType
    }

    console.log(process.env)

    console.log('region', process.env.region)
    console.log('secretAccessKey', process.env.secretAccessKey)
    console.log('accessKeyId', process.env.accessKeyId)
    console.log('signatureVersion', process.env?.signatureVersion || '')
    console.log('sessionToken', process.env?.sessionToken || '')

    console.log('params', params)

    const uploadURL = s3.getSignedUrl('putObject', params)

    const s3PathUrl = `${s3Path}${fileKey}`

    return { url: uploadURL, s3PathUrl }
  } catch (error) {
    handleCatchError('generateUploadUrl', error)
  }
}

async function generateUploadUrlForS3UsingPost(ContentType, fileName) {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Expires: 300,
      Conditions: [
        ['content-length-range', 100, 5242880],
        // ['starts-with', '$Content-Type', 'image/']
        // ['content-type', sContentType]
        ['starts-with', '$Content-Type', ContentType]
        // ['starts-with', '$success_action_redirect', '']

        // ['starts-with', '$key', 'user/user1/'],
        // { acl: 'public-read' },
        // { success_action_redirect: 'http://sigv4examplebucket.s3.amazonaws.com/successful_upload.html' },
        // ['starts-with', '$Content-Type', 'image/']
        // { 'x-amz-meta-uuid': '14365123651274' },
        // { 'x-amz-server-side-encryption': 'AES256' }
        // ['starts-with', '$x-amz-meta-tag', ''],
      ], // 100Byte - 10MB
      Fields: {
        key: `${Date.now()}_${fileName}`,
        'Content-Type': ContentType,
        success_action_status: '201'
      }
    }

    // console.log('params', params)

    const uploadURL = s3.createPresignedPost(params)

    // console.log('uploadURL', uploadURL)

    return { url: uploadURL }
  } catch (error) {
    handleCatchError('generateUploadUrl', error)
  }
}

async function deleteObject(s3Params) {
  return new Promise((resolve, reject) => {
    s3.deleteObject(s3Params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

async function deleteObjectsFromS3(s3Params) {
  return new Promise((resolve, reject) => {
    s3.deleteObjects(s3Params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  }
  )
}

async function deleteObjectFromS3(s3Params) {
  return new Promise((resolve, reject) => {
    s3.deleteObject(s3Params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  }
  )
}

async function findObjectFromS3(s3Params) {
  s3.listObjects({ Bucket: s3Params.Bucket }, function (err, data) {
    if (err) {
      handleCatchError('listS3.Object', err)
    } else {
      console.log('Success', data)
    }
  })
}

async function moveFromOneToOther(s3Params) {
  return new Promise((resolve, reject) => {
    s3.copyObject(s3Params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  }
  )
}

async function getObjectDetails(s3Params) {
  return new Promise((resolve, reject) => {
    s3.headObject(s3Params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  }
  )
}

async function getUrlOfObject(s3Params) {
  return new Promise((resolve, reject) => {
    s3.getSignedUrl('getObject', s3Params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  }
  )
}

async function s3BucketSize() {
  return new Promise((resolve, reject) => {
    s3.listObjects({ Bucket: process.env.S3_BUCKET_NAME }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  }
  )
}

// make a function for upload file to s3

async function uploadFileToS3(s3Params) {
  return new Promise((resolve, reject) => {
    s3.upload(s3Params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
        // console.log('data', data)
      }
    })
  }
  )
}

async function getObject(s3Params) {
  // console.log('s3Params', s3Params)
  return new Promise((resolve, reject) => {
    s3.getObject(s3Params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  }
  )
}

async function getSignedUrlForExcel(fileKey) {
  try {
    const params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileKey,
      Expires: 60 * 60 * 24
    }

    const url = s3.getSignedUrl('getObject', params)
    // console.log('url', url)

    return url
  } catch (error) {
    handleCatchError('generateUploadUrl', error)
  }
}

// async function retriveNewToken() {
//   try {
//     // if (process.env.NODE_ENV === 'production') {
//     // cehck expiation before 5 min

//     const expiration = moment(process.env.Expiration).subtract(5, 'minutes').format('YYYY-MM-DDTHH:mm:ss.SSSZ')

//     const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ')

//     console.log('expiration', expiration)
//     console.log('now', now)

//     // if (moment(now).isAfter(expiration)) {
//     console.log('expired')
//     const sts = new aws.STS({
//       region: 'ap-south-1',
//       secretAccessKey: process.env.secretAccessKey,
//       accessKeyId: process.env.accessKeyId,
//       signatureVersion: 'v4',
//       sessionToken: process.env.sessionToken
//     })

//     const data = await sts.getSessionToken({}).promise()
//     console.log('data', data)

//     s3 = new aws.S3({
//       region: process.env?.region || 'ap-south-1',
//       secretAccessKey: data.Credentials.SecretAccessKey,
//       accessKeyId: data.Credentials.AccessKeyId,
//       signatureVersion: process.env?.signatureVersion || 'v4',
//       sessionToken: data.Credentials.SessionToken
//     })

//     process.env.secretAccessKey = data.Credentials.SecretAccessKey
//     process.env.accessKeyId = data.Credentials.AccessKeyId
//     process.env.signatureVersion = 'v4'
//     process.env.sessionToken = data.Credentials.SessionToken
//     // } else {
//     //   console.log('not expired')
//     // }
//     // } else {
//     // console.log('not production')
//     // }
//   } catch (error) {
//     console.log(error)
//     handleCatchError('retriveNewToken', error)
//   }
// }

async function retriveNewToken() {
  try {
    if (process.env.NODE_ENV === 'production') {
      const expiration = moment(process.env.Expiration).subtract(5, 'minutes').format('YYYY-MM-DDTHH:mm:ss.SSSZ')

      const now = moment().format('YYYY-MM-DDTHH:mm:ss.SSSZ')

      console.log('expiration', expiration)
      console.log('now', now)
      if (moment(now).isAfter(expiration)) {
        await assumeRoleCheck()
        await setProcessEnvUsingSecretManager()
      }
    }
  } catch (error) {
    console.log('='.repeat(100))
    console.log(error)
    console.log('='.repeat(100))
  }
}

// return new Promise((resolve, reject) => {
//   s3.upload(s3Params, (err, data) => {
module.exports = {
  generateUploadUrl,
  deleteObject,
  findObjectFromS3,
  deleteObjectFromS3,
  getObjectDetails,
  getObject,
  deleteObjectsFromS3,
  moveFromOneToOther,
  uploadFileToS3,
  getSignedUrlForExcel,
  generateUploadUrlForS3UsingPost,
  s3BucketSize,
  s3,
  getUrlOfObject,
  setProcessEnvUsingSecretManager,
  assumeRoleCheck,
  retriveNewToken
  // uploadStream
  // ifExists,

}
