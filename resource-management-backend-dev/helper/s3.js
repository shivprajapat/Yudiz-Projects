const config = require('../config/config')
const aws = require('aws-sdk')
const { handleCatchError } = require('../helper/utilities.services')
// const path = require('path')
// const fs = require('fs')
// const { queuePush, queuePop } = require('../queue')

const region = config.Region
const secretAccessKey = config.AWS_SECRET_ACCESS_KEY
const accessKeyId = config.AWS_ACCESS_KEY_ID
const BucketName = config.S3_BUCKET_NAME
const signatureVersion = 'v4'

const s3 = new aws.S3({
  region, secretAccessKey, accessKeyId, signatureVersion
})

async function generateUploadUrl(sFileName = 'user', sContentType, path) {
  try {
    sFileName = sFileName.replace('/', '-')

    sFileName = sFileName.replace(/\s/gi, '-')

    let fileKey = ''
    const s3Path = path

    fileKey = `${Date.now()}_${sFileName}`

    const params = {
      Bucket: BucketName,
      Key: s3Path + fileKey,
      Expires: 300,
      ContentType: sContentType
    }

    console.log('params', params)

    const uploadURL = s3.getSignedUrl('putObject', params)

    const s3PathUrl = `${s3Path}${fileKey}`

    return { url: uploadURL, s3PathUrl }
  } catch (error) {
    handleCatchError('generateUploadUrl', error)
  }
}

async function generateUploadUrlForS3UsingPost(ContentType, fileName) {
  try {
    const params = {
      Bucket: BucketName,
      Expires: 300,
      Conditions: [
        ['content-length-range', 100, 5242880],
        // ['starts-with', '$Content-Type', 'image/']
        // ['content-type', sContentType]
        ['starts-with', '$Content-Type', ContentType]
        // ['starts-with', '$success_action_redirect', '']

        // ['starts-with', '$key', 'user/user1/'],
        // { acl: 'public-read' },
        // { success_action_redirect: 'http://sigv4examplebucket.s3.amazonaws.com/successful_upload.html' },
        // ['starts-with', '$Content-Type', 'image/']
        // { 'x-amz-meta-uuid': '14365123651274' },
        // { 'x-amz-server-side-encryption': 'AES256' }
        // ['starts-with', '$x-amz-meta-tag', ''],
      ], // 100Byte - 10MB
      Fields: {
        key: `${Date.now()}_${fileName}`,
        'Content-Type': ContentType,
        success_action_status: '201'
      }
    }

    console.log('params', params)

    const uploadURL = s3.createPresignedPost(params)

    // console.log('uploadURL', uploadURL)

    return { url: uploadURL }
  } catch (error) {
    handleCatchError('generateUploadUrl', error)
  }
}

async function deleteObject(s3Params) {
  return new Promise((resolve, reject) => {
    s3.deleteObject(s3Params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

async function deleteObjectsFromS3(s3Params) {
  return new Promise((resolve, reject) => {
    s3.deleteObjects(s3Params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  }
  )
}

async function deleteObjectFromS3(s3Params) {
  return new Promise((resolve, reject) => {
    s3.deleteObject(s3Params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  }
  )
}

async function findObjectFromS3(s3Params) {
  s3.listObjects({ Bucket: s3Params.Bucket }, function(err, data) {
    if (err) {
      handleCatchError('listS3.Object', err)
    } else {
      console.log('Success', data)
    }
  })
}

async function moveFromOneToOther(s3Params) {
  return new Promise((resolve, reject) => {
    s3.copyObject(s3Params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  }
  )
}

async function getObjectDetails(s3Params) {
  return new Promise((resolve, reject) => {
    s3.headObject(s3Params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  }
  )
}

async function getUrlOfObject(s3Params) {
  return new Promise((resolve, reject) => {
    s3.getSignedUrl('getObject', s3Params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  }
  )
}

async function s3BucketSize() {
  return new Promise((resolve, reject) => {
    s3.listObjects({ Bucket: BucketName }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  }
  )
}

// make a function for upload file to s3

async function uploadFileToS3(s3Params) {
  return new Promise((resolve, reject) => {
    s3.upload(s3Params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
        console.log('data', data)
      }
    })
  }
  )
}

async function getObject(s3Params) {
  console.log('s3Params', s3Params)
  return new Promise((resolve, reject) => {
    s3.getObject(s3Params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  }
  )
}

async function getSignedUrlForExcel(fileKey) {
  try {
    const params = {
      Bucket: BucketName,
      Key: fileKey,
      Expires: 60 * 60 * 24
    }

    const url = s3.getSignedUrl('getObject', params)
    console.log('url', url)

    return url
  } catch (error) {
    handleCatchError('generateUploadUrl', error)
  }
}

// async function ifExists(file) {
//   // console.log(file)
//   // const fileName = path.join(config.s3Excel, file)

//   // console.log(fileName)

//   // const s3Params = {
//   //   Bucket: BucketName,
//   //   Key: 'flags/ad.png'
//   // }

//   // const data = await new Promise((resolve, reject) => {
//   //   s3.headObject(s3Params, (err, data) => {
//   //     if (err) {
//   //       reject(err)
//   //     } else {
//   //       resolve(data)
//   //     }
//   //   })
//   // console.log(data)

//   // const data = await getObjectDetails(s3Params)
//   // return data

//   // if (!data) {

//   // }

//   // s3.getObject(s3Params, (err, data) => {
//   //   if (err) {
//   //     console.log(err)
//   //   } else {
//   //     console.log(data)
//   //   }
//   // })

//   // return new Promise((resolve, reject) => {
//   //   s3.headObject(s3Params, (err, data) => {
//   //     if (err) {
//   //       reject(err)
//   //     } else {
//   //       resolve(data)
//   //     }
//   //   })
//   // }
//   // )
//   // })
// }

// async function uploadStream(data) {
//   // const fileStream = fs.createReadStream('./resource-management-f8560-97a2b372eb19.json')
//   // fileStream.on('error', function(err) {
//   //   console.log('File Error', err)
//   // })

//   // const uploadParams = {
//   //   Bucket: BucketName,
//   //   Key: 'flagsA/ad.png',
//   //   Body: fileStream
//   // }

//   // const data = await new Promise((resolve, reject) => {
//   //   s3.upload(uploadParams, function(err, data) {
//   //     if (err) {
//   //       reject(err)
//   //     }
//   //     if (data) {
//   //       resolve(data)
//   //     }
//   //   })
//   // })
//   // return data

//   // const s3Params = {
//   //   Bucket: BucketName,
//   //   Key: 'images/abc.js',
//   //   Body: fileStream
//   // }
//   // s3.upload(s3Params, function (err, data) {
//   //   if (err) {
//   //     console.log('Error', err)
//   //   } if (data) {
//   //     console.log('Upload Success', data.Location)
//   //   }
//   // })

//   // const s3Stream = s3.upload(s3Params).createReadStream()
//   // fileStream.pipe(s3Stream)
//   // s3Stream.on('error', function(err) {
//   //   console.log('S3 Error', err)
//   // })
//   // s3Stream.on('finish', function() {
//   //   console.log('S3 Upload Finished')
//   // })
//   // return s3Stream

//   // uplaod file from local to s3 bucket using stream
//   // const fileStream = fs.createReadStream('./resource-management-f8560-97a2b372eb19.json')
//   // fileStream.on('error', function(err) {
//   //   console.log('File Error', err)
//   // }
//   // )

//   // // const s3Params = {

//   // const s3Params = {
//   //   Bucket: BucketName,
//   //   Key: 'flagsA/ad.png',
//   //   Body: fileStream
//   // }
//   // s3.upload(s3Params, function (err, data) {
//   //   if (err) {
//   //     console.log('Error', err)
//   //   } if (data) {
//   //     console.log('Upload Success', data.Location)
//   //   }
//   // })

//   // const s3Stream = s3.upload(s3Params).createReadStream()
//   // fileStream.pipe(s3Stream)
//   // s3Stream.on('error', function(err) {
//   //   console.log('S3 Error', err)
//   // })
//   // s3Stream.on('finish', function() {
//   //   console.log('S3 Upload Finished')
//   // })
//   // return s3Stream

//   // u can use create Multipart when  tyhe file size goes above 100MB

//   // console.log(file)

//   // const path1 = path.join(__dirname, '..', file)
//   // const rstream = createReadStream(resolve(path1))

//   // rstream.once('error', (err) => {
//   //   console.error(`unable to upload file ${path1}, ${err.message}`)
//   // })

//   // const parameters = {
//   //   Bucket: BucketName,
//   //   Key: `flagsA/${file}`
//   // }
//   // const opts = { }

//   // parameters.Body = rstream
//   // parameters.ContentType = getMIMEType(path1)
//   // await s3.upload(parameters, opts).promise()

//   // console.info(`${parameters.Key} (${parameters.ContentType}) uploaded in bucket ${parameters.Bucket}`)

//   // console.log('S3 Upload Finished')

//   // over file size 100MB

//   // queuepop from queue

//   const file = await queuePop('preflight_download_excel_2')

//   const filePath = '/Users/yudiz/Documents/resource-management-node/ExcelFile/'

//   const fileName = data.file

//   if (!fileName) {
//     throw new Error('the fileName is empty')
//   }
//   // if (!filePath) {
//   //   throw new Error('the file absolute path is empty')
//   // }

//   const fileNameInS3 = `pranav/${fileName}` // the relative path inside the bucket
//   console.info(`file name: ${fileNameInS3} file path: ${filePath}`)

//   if (!fs.existsSync(filePath)) {
//     throw new Error(`file does not exist: ${filePath}`)
//   }

//   const statsFile = fs.statSync(filePath)
//   console.log(`file size: ${Math.round(statsFile.size / 1024 / 1024)}MB`)

//   let uploadId
//   try {
//     const params = {
//       Bucket: BucketName,
//       Key: fileNameInS3
//     }
//     const result = await s3.createMultipartUpload(params).promise()
//     uploadId = result.UploadId
//     console.info(`csv ${fileNameInS3} multipart created with upload id: ${uploadId}`)
//   } catch (e) {
//     throw new Error(`Error creating S3 multipart. ${e.message}`)
//   }

//   const chunkSize = 10 * 1024 * 1024 // 10MB
//   const readStream = fs.createReadStream(`${filePath}/${fileName}`)

//   console.log('readStream', readStream)

//   let partNumber = 0
//   const parts = []
//   let offset = 0

//   while (offset < statsFile.size) {
//     partNumber++
//     const end = Math.min(offset + chunkSize, statsFile.size)

//     const partParams = {
//       Body: readStream,
//       Bucket: BucketName,
//       Key: fileNameInS3,
//       PartNumber: partNumber,
//       UploadId: uploadId
//     }

//     const partResult = await s3.uploadPart(partParams).promise()
//     parts.push({
//       ETag: partResult.ETag,
//       PartNumber: partNumber
//     })
//     offset = end
//   }

//   const completeParams = {
//     Bucket: BucketName,
//     Key: fileNameInS3,
//     MultipartUpload: {
//       Parts: parts
//     },
//     UploadId: uploadId
//   }

//   const completeResult = await s3.completeMultipartUpload(completeParams).promise()
//   console.log(`csv ${fileNameInS3} multipart completed with upload id: ${uploadId}`)
//   return completeResult
// }

// return new Promise((resolve, reject) => {
//   s3.upload(s3Params, (err, data) => {
module.exports = {
  generateUploadUrl,
  deleteObject,
  findObjectFromS3,
  deleteObjectFromS3,
  getObjectDetails,
  getObject,
  deleteObjectsFromS3,
  moveFromOneToOther,
  uploadFileToS3,
  getSignedUrlForExcel,
  generateUploadUrlForS3UsingPost,
  s3BucketSize,
  s3,
  getUrlOfObject
  // uploadStream
  // ifExists,

}
