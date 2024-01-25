/* eslint-disable camelcase */
const config = require('../config/config-file')
const { handleCatchError } = require('../helper/utilities.services')
const AWS = require('aws-sdk')
const fs = require('fs')

let option
if (process.env.NODE_ENV === 'staging') {
  option = {
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY,
    signatureVersion: 'v4',
    region: 'ap-south-1'
  }
} else {
  option = {
    signatureVersion: 'v4',
    region: 'ap-south-1'
  }
}

AWS.config.update(option)
const s3 = new AWS.S3()

async function signedUrl(sFileName, sContentType, path) {
  return new Promise((resolve, reject) => {
    sFileName = sFileName.replace()
    sFileName = sFileName.replace(/\s/gi, '-')

    let fileKey = ''
    const s3Path = path

    fileKey = `${sFileName}_${Date.now()}`

    const params = {
      Bucket: config.S3_BUCKET_NAME,
      Key: s3Path + fileKey,
      Expires: 300,
      ContentType: sContentType
    }

    s3.getSignedUrl('putObject', params, function (error, url) {
      if (error) {
        reject(error)
      } else {
        resolve({ sUrl: url, sPath: s3Path + fileKey })
      }
    })
  })
}
async function getObjectPresignedUrl(path) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: config.S3_PUBLIC_BUCKET_NAME,
      Key: path
    }

    s3.getSignedUrl('getObject', params, function (error, url) {
      if (error) {
        reject(error)
      } else {
        resolve({ sUrl: url })
      }
    })
  })
}

async function getObjectPresignedUrlForPrivate(path) {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: config.S3_BUCKET_NAME,
      Key: path
    }

    s3.getSignedUrl('getObject', params, function (error, url) {
      if (error) {
        reject(error)
      } else {
        resolve(url)
      }
    })
  })
}

async function deleteObject(s3Params) {
  let data
  await s3.headObject(s3Params, function (err) {
    if (err) {
      console.log('err', err)
    } else {
      s3.deleteObject(s3Params, function (errDel, d) {
        if (errDel) console.log(errDel, errDel.stack)
        data = d
      })
    }
  })
  return data
}

async function putObj(sFileName, sContentType, filePath) {
  try {
    const fileStream = fs.createReadStream(filePath)

    const params = {
      Bucket: config.S3_PUBLIC_BUCKET_NAME,
      Key: `uploads/reports/${sFileName}`,
      Body: fileStream,
      ContentType: sContentType
    }

    const data = await s3.putObject(params).promise()
    return data
  } catch (error) {
    handleCatchError(error)
  }
}

module.exports = {
  signedUrl,
  deleteObject,
  putObj,
  getObjectPresignedUrl,
  getObjectPresignedUrlForPrivate
}
