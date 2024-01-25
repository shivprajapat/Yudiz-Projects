const { BlobServiceClient, StorageSharedKeyCredential, generateBlobSASQueryParameters, BlobSASPermissions } = require('@azure/storage-blob')
const config = require('../config/config')
const axios = require('axios')
const { handleCatchError, generateNumber } = require('../helper/utilities.services')
const sharedKeyCredential = new StorageSharedKeyCredential(config.AZURE_ACCOUNT_NAME, config.AZURE_ACCOUNT_KEY)
const blobServiceClient = new BlobServiceClient(`https://${config.AZURE_ACCOUNT_NAME}.blob.core.windows.net`, sharedKeyCredential)
const containerClient = blobServiceClient.getContainerClient(config.AZURE_STORAGE_CONTAINER_NAME)

function sasUrl(sFileName, path) {
  try {
    sFileName = sFileName.replace('/', '-')
    sFileName = sFileName.replace(/\s/gi, '-')

    let fileKey = ''

    fileKey = `${Date.now()}_${sFileName}`

    const dExpiry = new Date()
    dExpiry.setSeconds(dExpiry.getSeconds() + 300)

    const blockBlobClient = containerClient.getBlockBlobClient(fileKey)
    const blobSAS = generateBlobSASQueryParameters({
      containerName: config.AZURE_STORAGE_CONTAINER_NAME,
      blobName: path + fileKey,
      permissions: BlobSASPermissions.parse('w'),
      startsOn: new Date(),
      expiresOn: dExpiry
    },
    sharedKeyCredential
    ).toString()

    const sasUrl = `${blockBlobClient.url}?${blobSAS}`

    return { sUrl: sasUrl, sPath: path + fileKey }
  } catch (error) {
    handleCatchError(error)
    return error
  }
}

async function deleteBlob(params) {
  try {
    const { Key: sFileName, Bucket: sContainerName } = params
    const options = {
      deleteSnapshots: 'include'
    }

    const containerClient = blobServiceClient.getContainerClient(sContainerName)
    const blockBlobClient = await containerClient.getBlockBlobClient(sFileName)

    const data = await blockBlobClient.delete(options)
    return data
  } catch (error) {
    handleCatchError(error)
    return error
  }
}

async function uploadBlob(params) {
  try {
    let { sFileName, sContentType, fileStream } = params
    sFileName = sFileName.replace('/', '-')
    sFileName = sFileName.replace(/\s/gi, '-')
    let fileKey = ''

    fileKey = `${Date.now()}_${sFileName}`

    const blockBlobClient = containerClient.getBlockBlobClient(fileKey)

    const response = await blockBlobClient.uploadData(fileStream, {
      blobHTTPHeaders: {
        blobContentType: sContentType
      }
    })

    if (response._response.status !== 201) {
      throw new Error(`Error uploading document ${blockBlobClient.name} to container ${blockBlobClient.containerName}`)
    }

    return response
  } catch (error) {
    handleCatchError(error)
    return error
  }
}

/**
 * Gives a azure container file upload URL and relative path
 * @param {*} url URL of image to upload in container
 * @param {*} path container file upload path
 * @returns container image URL and relative path
 */
const getAzureImageURL = async (url, path) => {
  const response = { sSuccess: false, sUrl: '', sPath: '' }
  try {
    const imageURL = url

    let imageName = imageURL.substring(imageURL.lastIndexOf('/') + 1)
    imageName = (imageName.match(/[^.]+(\.[^?#]+)?/) || [])[0]

    const fileExtensionPattern = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi
    const fileExtension = imageName.match(fileExtensionPattern)[0]
    const fileName = generateNumber(100000, 999999).toString()
    const imagePath = path + fileName + fileExtension
    await UploadFromUrlToAzure(imageURL, imagePath)
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

const UploadFromUrlToAzure = (url, destPath) => {
  return new Promise((resolve, reject) => {
    try {
      axios.get(url, { responseType: 'arraybuffer', responseEncoding: 'binary' }).then(async (res) => {
        const containerClient = blobServiceClient.getContainerClient(config.AZURE_STORAGE_CONTAINER_NAME)

        const blockBlobClient = containerClient.getBlockBlobClient(destPath)

        const response = await blockBlobClient.uploadData(res.data, {
          blobHTTPHeaders: {
            blobContentType: res.headers['content-type']
          }
        })
        if (response._response.status !== 201) {
          reject(new Error(`Error uploading document ${blockBlobClient.name} to container ${blockBlobClient.containerName}`))
        }
        resolve(response)
      }).catch(function (err) {
        reject(err)
      })
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = {
  sasUrl,
  deleteBlob,
  uploadBlob,
  getAzureImageURL
}
