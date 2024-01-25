const s3Bucket = require('./s3config')
const gcsBucket = require('./gcsConfig')
const azureContainer = require('./azureConfig')
const config = require('../config/config')
const { handleCatchError } = require('../helper/utilities.services')

async function getSignedUrl(params) {
  try {
    const { sFileName, sContentType, path } = params

    let data
    switch (config.CLOUD_STORAGE_PROVIDER) {
      case 'AWS':
        data = await s3Bucket.signedUrl(sFileName, sContentType, path)
        break
      case 'GC':
        data = await gcsBucket.signedUrl(sFileName, sContentType, path)
        break
      case 'AZURE':
        data = await azureContainer.sasUrl(sFileName, path)
        break
      default:
        data = await s3Bucket.signedUrl(sFileName, sContentType, path)
    }
    return data
  } catch (error) {
    handleCatchError(error)
    return error
  }
}

async function deleteObject(params) {
  try {
    let data
    switch (config.CLOUD_STORAGE_PROVIDER) {
      case 'AWS':
        data = await s3Bucket.deleteObject(params)
        break
      case 'GC':
        data = await gcsBucket.deleteObject(params)
        break
      case 'AZURE':
        data = await azureContainer.deleteBlob(params)
        break
      default:
        data = await s3Bucket.deleteObject(params)
    }
    return data
  } catch (error) {
    handleCatchError(error)
    return error
  }
}

async function putObject(params) {
  try {
    const { sFileName, sContentType, path, fileStream, sDeposition } = params

    let data
    switch (config.CLOUD_STORAGE_PROVIDER) {
      case 'AWS':
        data = await s3Bucket.putObj(sFileName, sContentType, path, fileStream, sDeposition)
        break
      case 'GC':
        data = await gcsBucket.putObj(sFileName, fileStream)
        break
      case 'AZURE':
        data = await azureContainer.uploadBlob(params)
        break
      default:
        data = await s3Bucket.putObj(sFileName, sContentType, path, fileStream, sDeposition)
    }
    return data
  } catch (error) {
    handleCatchError(error)
    return error
  }
}

async function getCloudImageURL(params) {
  try {
    const { url, path } = params

    let data
    switch (config.CLOUD_STORAGE_PROVIDER) {
      case 'AWS':
        data = await s3Bucket.getS3ImageURL(url, path)
        break
      case 'GC':
        data = await gcsBucket.getGCSImageURL(url, path)
        break
      case 'AZURE':
        data = await azureContainer.getAzureImageURL(url, path)
        break
      default:
        data = await s3Bucket.getS3ImageURL(url, path)
    }
    return data
  } catch (error) {
    handleCatchError(error)
    return error
  }
}

module.exports = {
  getSignedUrl,
  deleteObject,
  putObject,
  getCloudImageURL
}
