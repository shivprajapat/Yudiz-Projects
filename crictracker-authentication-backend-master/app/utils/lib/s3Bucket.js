const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const config = require('../../../config')
const axios = require('axios')

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
    console.log({ error })
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

services.UploadFromUrlToS3 = (url, path) => {
  return new Promise((resolve, reject) => {
    try {
      axios.get(url, { responseType: 'arraybuffer', responseEncoding: 'binary', timeout: 100000 }).then(async (res) => {
        let imageName = url.substring(url.lastIndexOf('/') + 1)
        imageName = (imageName.match(/[^.]+(\.[^?#]+)?/) || [])[0]

        const fileExtensionPattern = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi
        let fileExtension = imageName.match(fileExtensionPattern)
        if (fileExtension) fileExtension = fileExtension[0]
        else {
          fileExtension = res.headers['content-type'].substring(res.headers['content-type'].lastIndexOf('/') + 1)
          fileExtension = '.' + fileExtension
        }

        const fileName = Math.floor(Math.random() * 100000 + 99999).toString()
        const destPath = path + fileName + fileExtension

        const objectParams = {
          ContentType: res.headers['content-type'],
          ContentLength: res.headers['content-length'],
          Key: destPath,
          Body: res.data,
          Bucket: config.S3_BUCKET_NAME
        }

        const command = new PutObjectCommand(objectParams)

        resolve({ etag: await s3.send(command), destPath })
      }).catch((err) => {
        console.log({ err: err?.code, url: url })
        resolve('')
      })
    } catch (error) {
      console.log(error)
      reject(error)
    }
  })
}

module.exports = services
