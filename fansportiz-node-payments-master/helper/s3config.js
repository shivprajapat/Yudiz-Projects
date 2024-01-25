const config = require('../config/config')
const { handleCatchError } = require('../helper/utilities.services')
const { AWS_REGION } = require('../config/common')
const AWS = require('aws-sdk')
// const { Buffer } = require('buffer')
AWS.config.update({ accessKeyId: config.AWS_ACCESS_KEY, secretAccessKey: config.AWS_SECRET_KEY, signatureVersion: 'v4', region: AWS_REGION })
const s3 = new AWS.S3()
// const { imageExtensions, imageMimeTypes } = require('../data')
// const { messages } = require('./api.responses')

async function signedUrl(sFileName, sContentType, path) {
  return new Promise((resolve, reject) => {
    sFileName = sFileName.replace('/', '-')
    sFileName = sFileName.replace(/\s/gi, '-')

    // if (!imageExtensions.includes(sFileName.split('.').pop()) || !imageMimeTypes.includes(sContentType)) {
    //   return reject(new Error(messages.English.invalid.replace('##', messages.English.image)))
    // }

    let fileKey = ''
    const s3Path = path

    fileKey = `${Date.now()}_${sFileName}`

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

  /* Post signed url demo
    const params = {
      Bucket: config.S3_BUCKET_NAME,
      Fields: {
        Key: s3Path + fileKey
      },
      Expires: 30000,
      Conditions: [
        ['content-length-range', 0, 1000000],
        ['eq', '$Content-Type', sContentType],
        ['eq', '$key', s3Path + fileKey]
      ]
    }

    s3.createPresignedPost(params, function (error, data) {
      if (error) {
        return reject(error)
      } else {
        return resolve({ sUrl: data.url, sPath: s3Path + fileKey, oFields: data.fields })
      }
    }) */
  })
}

async function deleteObject(s3Params) {
  let data
  await s3.headObject(s3Params, function (err) {
    if (err) {
      handleCatchError(err)
    } else {
      s3.deleteObject(s3Params, function (errDel, d) {
        if (errDel) console.log(errDel, errDel.stack)
        data = d
      })
    }
  })
  return data
}

module.exports = {
  signedUrl,
  deleteObject

}
