const AWS = require('aws-sdk')
const axios = require('axios')

AWS.config.update({ accessKeyId: process.env.AWS_ACCESSKEYID, secretAccessKey: process.env.AWS_SECRETKEY, signatureVersion: 'v4', region: process.env.AWS_REGION })
const s3 = new AWS.S3()
const config = require('../../../config')

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

services.deleteObject = (Key) => {
  console.log(config.S3_BUCKET_URL + Key)
  const params = {
    Bucket: config.S3_BUCKET_NAME,
    Key: Key
  }
  s3.deleteObject(params, function (err, data) {
    if (data) {
      console.log('File deleted successfully')
    } else {
      console.log(`Check if you have sufficient permissions : ${err}`)
    }
  })
}

services.uploadS3Image = async (obj) => {
  try {
    const objectParams = {
      ContentType: obj?.ContentType,
      // ContentLength: obj?.ContentLength,
      Key: obj?.Key,
      Body: obj?.Body,
      Bucket: process.env.S3_BUCKET_NAME
      // ACL: obj?.ACL
    }
    console.log(objectParams)
    s3.putObject(objectParams, function (perr, pres) {
      if (perr) {
        console.log('Error uploading data: ', perr)
      } else {
        console.log('Successfully uploaded data to myBucket/myKey')
      }
    })
  } catch (error) {
    console.log(error)
    return error
  }
}

services.UploadFromUrlToS3 = (url, destPath) => {
  return new Promise((resolve, reject) => {
    try {
      axios.get(url, { responseType: 'arraybuffer', responseEncoding: 'binary' }).then(async (res) => {
        const objectParams = {
          ContentType: res.headers['content-type'],
          ContentLength: res.headers['content-length'],
          Key: destPath,
          Body: res.data,
          Bucket: process.env.S3_BUCKET_NAME
        }
        resolve(s3.putObject(objectParams).promise())
      }).catch(function (err) {
        reject(err)
      })
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = services
