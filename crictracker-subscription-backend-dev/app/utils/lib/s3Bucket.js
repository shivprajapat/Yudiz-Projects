const AWS = require('aws-sdk')

AWS.config.update({ accessKeyId: process.env.AWS_ACCESSKEYID, secretAccessKey: process.env.AWS_SECRETKEY, signatureVersion: 'v4', region: process.env.AWS_REGION })
const s3 = new AWS.S3()

const services = {}

services.generateProfileUrl = (sFileName, sContentType) => {
  try {
    sFileName = sFileName.replace('/', '-')
    sFileName = sFileName.replace(/\s/gi, '-')

    const s3Path = process.env.S3_BUCKET_PROFILE_PATH
    const fileKey = `${Date.now()}_${sFileName}`

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Path + fileKey,
      Expires: 300,
      ContentType: sContentType
    }

    return s3.getSignedUrl('putObject', s3Params)
  } catch (error) {
    return error
  }
}

services.generatePanUrl = (sFileName, sContentType) => {
  try {
    sFileName = sFileName.replace('/', '-')
    sFileName = sFileName.replace(/\s/gi, '-')

    const s3Path = process.env.S3_BUCKET_KYC_PATH
    const fileKey = `${Date.now()}_${sFileName}`

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Path + fileKey,
      Expires: 300,
      ContentType: sContentType
    }

    return s3.getSignedUrl('putObject', s3Params)
  } catch (error) {
    return error
  }
}

services.generateFBUrl = (sFileName, sContentType) => {
  try {
    sFileName = sFileName.replace('/', '-')
    sFileName = sFileName.replace(/\s/gi, '-')

    const s3Path = process.env.S3_BUCKET_FB_PATH
    const fileKey = `${Date.now()}_${sFileName}`

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Path + fileKey,
      Expires: 300,
      ContentType: sContentType
    }

    return s3.getSignedUrl('putObject', s3Params)
  } catch (error) {
    return error
  }
}

services.generateTwitterUrl = (sFileName, sContentType) => {
  try {
    sFileName = sFileName.replace('/', '-')
    sFileName = sFileName.replace(/\s/gi, '-')

    const s3Path = process.env.S3_BUCKET_TWITTER_PATH
    const fileKey = `${Date.now()}_${sFileName}`

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Path + fileKey,
      Expires: 300,
      ContentType: sContentType
    }

    return s3.getSignedUrl('putObject', s3Params)
  } catch (error) {
    return error
  }
}

module.exports = services
