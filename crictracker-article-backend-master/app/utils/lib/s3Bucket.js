const { S3Client, PutObjectCommand, DeleteObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3')
const axios = require('axios')
const config = require('../../../config')

const s3 = new S3Client({ accessKeyId: config.AWS_ACCESSKEYID, secretAccessKey: config.AWS_SECRETKEY, signatureVersion: 'v4', region: config.AWS_REGION })

const services = {}

services.s3 = s3

services.UploadFromUrlToS3 = (url, destPath) => {
  return new Promise((resolve, reject) => {
    try {
      axios.get(url, { responseType: 'arraybuffer', responseEncoding: 'binary' }).then(async (res) => {
        const objectParams = {
          ContentType: res.headers['content-type'],
          ContentLength: res.headers['content-length'],
          Key: destPath,
          Body: res.data,
          Bucket: config.S3_BUCKET_NAME
        }

        const command = new PutObjectCommand(objectParams)

        const akg = await s3.send(command)
        if (akg) resolve('Success')
        else reject({ err: 'Something went wrong with image upload' }) // eslint-disable-line
      }).catch(function (err) {
        reject(err)
      })
    } catch (error) {
      reject(error)
    }
  })
}

services.deleteObject = async (Key) => {
  console.log(config.S3_BUCKET_URL + Key)
  const params = {
    Bucket: config.S3_BUCKET_NAME,
    Key
  }

  const command = new DeleteObjectCommand(params)

  return await s3.send(command)
}

services.getSize = async (s3Path, image) => {
  try {
    const params = {}

    const command = new HeadObjectCommand(params)

    return await s3.send(command)
  } catch (error) {
    console.log(error.statusCode, { s3Path: `${config.S3_BUCKET_URL}${s3Path}`, image })
  }
}

module.exports = services
