const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')

const config = require('../../../config')

const s3 = new S3Client({ accessKeyId: config.AWS_ACCESSKEYID, secretAccessKey: config.AWS_SECRETKEY, signatureVersion: 'v4', region: config.AWS_REGION })

const services = {}

services.generatePreSignedUrl = async (sFileName, sContentType, s3Bucket, isAdd) => {
  try {
    sFileName = sFileName.replace('/', '-')
    sFileName = sFileName.replace(/\s/gi, '-')

    const s3Path = s3Bucket
    const fileKey = isAdd ? `${Date.now()}_${encodeURI(sFileName)}` : encodeURI(sFileName)
    const s3Params = {
      Bucket: config.S3_BUCKET_NAME,
      Key: s3Path + fileKey + `.${sContentType.split('/')[1]}`,
      ContentType: sContentType
    }

    return { url: await getSignedUrl(s3, new PutObjectCommand(s3Params), { expiresIn: 300 }), key: s3Path + fileKey + `.${sContentType.split('/')[1]}` }
  } catch (error) {
    return error
  }
}

services.deleteObject = (Key) => {
  const params = {
    Bucket: config.S3_BUCKET_NAME,
    Key: Key
  }
  const command = new DeleteObjectCommand(params)

  s3.send(command).then((data) => {
    if (data) console.log('File deleted successfully')
  }).catch((err) => {
    console.log(`Check if you have sufficient permissions : ${err}`)
  })
}

module.exports = services
