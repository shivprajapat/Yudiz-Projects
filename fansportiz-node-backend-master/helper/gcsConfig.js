const config = require('../config/config')
const { handleCatchError, generateNumber } = require('../helper/utilities.services')
const { Storage } = require('@google-cloud/storage')
const path = require('path')
const axios = require('axios')
const stream = require('stream')
const storage = new Storage({ keyFilename: path.join(__dirname, './third-party-cred/gcsKey.json'), projectId: config.GCS_PROJECT_ID })

async function signedUrl(sFileName, sContentType, path) {
  try {
    sFileName = sFileName.replace('/', '-')
    sFileName = sFileName.replace(/\s/gi, '-')

    let fileKey = ''

    fileKey = `${Date.now()}_${sFileName}`

    const dExpiry = new Date()
    dExpiry.setSeconds(dExpiry.getSeconds() + 300)

    const options = {
      version: 'v4',
      action: 'write',
      expires: dExpiry,
      contentType: sContentType
    }

    const [url] = await storage
      .bucket(config.GCS_BUCKET_NAME)
      .file(path + fileKey)
      .getSignedUrl(options)

    return { sUrl: url, sPath: path + fileKey }
  } catch (error) {
    handleCatchError(error)
    return error
  }
}

async function deleteObject(s3Params) {
  try {
    const { Bucket, Key } = s3Params
    const data = await storage.bucket(Bucket).file(Key).delete()
    return data
  } catch (error) {
    handleCatchError(error)
    return error
  }
}

function putObj(sFileName, fileStream) {
  return new Promise((resolve, reject) => {
    sFileName = sFileName.replace('/', '-')
    sFileName = sFileName.replace(/\s/gi, '-')

    let fileKey = ''

    fileKey = `${Date.now()}_${sFileName}`
    const gcsBucket = storage.bucket(config.GCS_BUCKET_NAME)
    const file = gcsBucket.file(fileKey)

    const passthroughStream = new stream.PassThrough()
    passthroughStream.write(fileStream)
    passthroughStream.end()

    passthroughStream.pipe(file.createWriteStream()).on('finish', () => {
      resolve()
    }).on('error', () => {
      reject(new Error())
    })
  })
}

/**
 * Gives a s3 bukcket file upload URL and relative path
 * @param {*} url URL of image to upload in s3
 * @param {*} path s3 file upload path
 * @returns s3 image URL and relative path
 */
const getGCSImageURL = async (url, path) => {
  const response = { sSuccess: false, sUrl: '', sPath: '' }
  try {
    const imageURL = url

    let imageName = imageURL.substring(imageURL.lastIndexOf('/') + 1)
    imageName = (imageName.match(/[^.]+(\.[^?#]+)?/) || [])[0]

    const fileExtensionPattern = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi
    const fileExtension = imageName.match(fileExtensionPattern)[0]
    const fileName = generateNumber(100000, 999999).toString()
    const imagePath = path + fileName + fileExtension
    await UploadFromUrlToGCS(imageURL, imagePath)
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

const UploadFromUrlToGCS = async (url, destPath) => {
  return new Promise((resolve, reject) => {
    try {
      axios.get(url, { responseType: 'arraybuffer', responseEncoding: 'binary' }).then(async (res) => {
        const gcsBucket = storage.bucket(config.GCS_BUCKET_NAME)
        const file = gcsBucket.file(destPath)

        const passthroughStream = new stream.PassThrough()
        passthroughStream.write(res.data)
        passthroughStream.end()

        passthroughStream.pipe(file.createWriteStream()).on('finish', () => {
          resolve()
        }).on('error', () => {
          reject(new Error(`GCS file upload failed for ${destPath}`))
        })
      }).catch(function (err) {
        reject(err)
      })
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = {
  signedUrl,
  deleteObject,
  putObj,
  getGCSImageURL
}
