const AWS = require('aws-sdk')

AWS.config.update({ accessKeyId: process.env.AWS_ACCESSKEYID, secretAccessKey: process.env.AWS_SECRETKEY, signatureVersion: 'v4', region: process.env.AWS_REGION })
const s3 = new AWS.S3()

const services = {}

services.generatePreSignedUrl = (sFileName, sContentType, s3Bucket) => {
  try {
    sFileName = sFileName.replace('/', '-')
    sFileName = sFileName.replace(/\s/gi, '-')

    const s3Path = s3Bucket
    const fileKey = `${Date.now()}_${sFileName}`

    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: s3Path + fileKey,
      Expires: 300,
      ContentType: sContentType
    }

    return { url: s3.getSignedUrl('putObject', s3Params), key: s3Path + fileKey }
  } catch (error) {
    return error
  }
}

services.deleteObject = (Key) => {
  console.log(process.env.S3_BUCKET_URL + Key)
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
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

module.exports = services
