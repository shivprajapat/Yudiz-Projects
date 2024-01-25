/* eslint-disable camelcase */
const config = require('../config/config-file')
const AWS = require('aws-sdk')
const { getObjectPresignedUrl } = require('./s3config')
// const request = require('request-promise').defaults({ encoding: null })
const AdmZip = require('adm-zip')
const axios = require('axios').default
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

let option
if (process.env.NODE_ENV === 'staging') {
  option = {
    accessKeyId: config.AWS_ACCESS_KEY,
    secretAccessKey: config.AWS_SECRET_KEY,
    region: 'ap-south-1'
  }
} else {
  option = { region: 'ap-south-1' }
}

// Configure AWS SDK with your credentials
AWS.config.update(option)

async function downloadFilesAndCreateZip(fileKeys) {
  const signedUrls = []
  const promises = fileKeys.map(async (fileKey, index) => {
    if (fileKey.report_path && index < 20) {
      const dataUrl = await getObjectPresignedUrl(fileKey.report_path)
      signedUrls.push(dataUrl.sUrl)
    }
  })
  await Promise.all(promises)

  // testing
  console.log('signedUrls', signedUrls)

  const zip = new AdmZip()
  var s3bucket = new AWS.S3({
    params: {
      Bucket: config.S3_BUCKET_NAME
    }
  })

  const start = 0
  const end = signedUrls.length
  let count = 0

  for (let i = start; i < end; i += 10) {
    // const _signedUrls = signedUrls.slice(i, i + 10)
    // const data = await Promise.all(_signedUrls.map((link) => request.get(link))).catch(e => {
    //   console.error(e)
    // })

    const data = (await Promise.all(signedUrls.map(async url => {
      const response = await axios.get(url, { responseType: 'arraybuffer' }).catch(() => null)
      if (response) {
        const buffer = Buffer.from(response.data)

        return buffer
      }
    }))).filter(Boolean)

    data.map((bufferData, index) => {
      // eslint-disable-next-line no-unused-vars
      const _index = count * 10 + index
      const name = `${uuidv4()}.pdf`
      fs.appendFileSync(name, bufferData)
      zip.addFile(
        name,
        bufferData
      )
    })
    count += 1
  }

  const aws_config = {
    Bucket: config.S3_BUCKET_NAME,
    Key: `${'uploads/report_zip/'}${uuidv4()}.zip`,
    Body: Buffer.from(zip.toBuffer(), 'binary'),
    ContentType: 'application/zip'
  }
  await s3bucket.upload(aws_config, async function (err, response) {
    if (err) {
      throw err
    }
    const url = response.Location
    console.log('url: ', url)
    return url
  }).promise()
}

module.exports = {
  downloadFilesAndCreateZip
}
