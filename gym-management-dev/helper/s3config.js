const { handleCatchError } = require('./utilities.services')
const { PutObjectCommand, S3Client, GetObjectCommand } = require('@aws-sdk/client-s3')
const config = require('../config/config')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const s3Client = new S3Client({ region: config.AWS_REGION, credentials: { accessKeyId: config.AWS_ACCESS_KEY, secretAccessKey: config.AWS_SECRET_KEY } })

async function putObj (sFileName, sContentType, path, fileStream, deposition) {
  try {
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
    if (deposition) params.ContentDisposition = deposition
    const command = new PutObjectCommand(params)
    const response = await s3Client.send(command)

    response.key = params.Key
    response.Key = params.Key
    response.fileName = fileKey
    return response
  } catch (error) {
    handleCatchError(error)
  }
}

async function s3GetObjSignedUrl (sFileName, path) {
  try {
    const params = {
      Bucket: config.S3_BUCKET_NAME,
      Key: path + sFileName
    }
    const command = new GetObjectCommand(params)
    const url = await getSignedUrl(s3Client, command, { expiresIn: 300 })
    return url
  } catch (error) {
    handleCatchError(error)
  }
}

module.exports = { putObj, s3GetObjSignedUrl }
