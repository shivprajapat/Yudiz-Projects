const config = require('../config/config')
const { UploadFromUrlToS3, handleCatchError, generateNumber } = require('../helper/utilities.services')
const { AWS_REGION } = require('../config/common')
const AWS = require('aws-sdk')
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

function putObj(sFileName, sContentType, path, fileStream) {
  return new Promise((resolve, reject) => {
    sFileName = sFileName.replace('/', '-')
    sFileName = sFileName.replace(/\s/gi, '-')

    let fileKey = ''
    const s3Path = path

    fileKey = `${Date.now()}_${sFileName}`

    const params = {
      Bucket: config.S3_BUCKET_NAME,
      Key: s3Path + fileKey,
      ContentType: sContentType,
      Body: fileStream
    }
    s3.upload(params, function (err, data) {
      if (err) reject(err)

      resolve(data)
    })
  })
}

function putFile(sFileName, sContentType, path, fileStream, deposition) {
  return new Promise((resolve, reject) => {
    sFileName = sFileName.replace('/', '-')
    sFileName = sFileName.replace(/\s/gi, '-')
    const s3Path = path
    const params = {
      Bucket: config.S3_BUCKET_NAME,
      Key: s3Path + sFileName,
      ContentType: sContentType,
      Body: fileStream,
      ContentDisposition: deposition
    }
    s3.upload(params, function (err, data) {
      if (err) return reject(err)
      return resolve(data)
    })
  })
}

/**
 * Gives a s3 bukcket file upload URL and relative path
 * @param {*} url URL of image to upload in s3
 * @param {*} path s3 file upload path
 * @returns s3 image URL and relative path
 */
const getS3ImageURL = async (url, path) => {
  const response = { sSuccess: false, sUrl: '', sPath: '' }
  try {
    const imageURL = url

    let imageName = imageURL.substring(imageURL.lastIndexOf('/') + 1)
    imageName = (imageName.match(/[^.]+(\.[^?#]+)?/) || [])[0]

    const fileExtensionPattern = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi
    const fileExtension = imageName.match(fileExtensionPattern)[0]
    const fileName = generateNumber(100000, 999999).toString()
    const imagePath = path + fileName + fileExtension
    await UploadFromUrlToS3(imageURL, imagePath)
      .then(function (res) {
        response.sSuccess = true
        response.sPath = imagePath
        response.sUrl = config.S3_BUCKET_URL + imagePath
      }).catch(function (err) {
        response.error = err
      })
    return response
  } catch (error) {
    handleCatchError(error)
    response.error = error
    return response
  }
}

module.exports = {
  signedUrl,
  deleteObject,
  putObj,
  getS3ImageURL,
  putFile
}
