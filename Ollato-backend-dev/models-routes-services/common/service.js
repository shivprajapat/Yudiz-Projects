const { signedUrl, getObjectPresignedUrlForPrivate } = require('../../helper/s3config')
const config = require('../../config/config-file')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const studentCalcModel = require('../student/test/student.calc.test.model')
const { catchError } = require('../../helper/utilities.services')

class GetPreSignedUrl {
  async generatePreSigned(req, res) {
    try {
      const { fileName, sContentType } = req.body
      const path = config.S3_BUCKET_PATH + '/reports/'
      const data = await signedUrl(fileName, sContentType, path)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data })
    } catch (error) {
      return await catchError('getPreSignedUrl.generatePreSigned', error, req, res)
    }
  }

  async generatePreSignedForPrivate(req, res) {
    try {
      // eslint-disable-next-line no-useless-escape
      const allowedCharacters = /^[a-zA-Z0-9\s\-_().]+$/
      const { data } = req.body

      if (!Array.isArray(data)) {
        return res.status(status.BadRequest).jsonp({
          status: jsonStatus.BadRequest,
          message: messages[req.userLanguage].invalid.replace('##', 'File data')
        })
      }
      const signedUrls = {}

      for (const item of data) {
        const { fileName, sContentType, flag } = item

        if (!fileName || !sContentType || !flag) {
          return res.status(status.BadRequest).jsonp({
            status: jsonStatus.BadRequest,
            message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].data)
          })
        }

        if (!allowedCharacters.test(fileName)) {
          return res.status(status.BadRequest).jsonp({
            status: jsonStatus.BadRequest,
            message: messages[req.userLanguage].invalid.replace('##', 'fileName')
          })
        }

        const path = config.S3_BUCKET_PATH
        const signedUrlData = await signedUrl(fileName, sContentType, `${path}/${flag}/`)
        signedUrls[flag] = signedUrlData
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', 'data'), data: signedUrls })
    } catch (error) {
      return await catchError('getPreSignedUrl.generatePreSignedForPrivate', error, req, res)
    }
  }

  async getUrlForPresigned(req, res) {
    try {
      const { id } = req.params
      const data = await studentCalcModel.findOne({
        where: {
          custom_id: id
        },
        raw: true
      })

      if (!(data && data.report_path)) return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: 'Please wait. Report will be generate soon' })

      const url = `${config.S3_PUBLIC_BUCKET_URL}${data.report_path}`
      return res.jsonp({ dataUrl: { sUrl: url } })
    } catch (error) {
      return catchError('getPreSignedUrl.getUrlForPresigned', error, req, res)
    }
  }

  async getUrlForPresignedForPrivate(req, res) {
    try {
      const { data } = req.body
      if (!Array.isArray(data)) {
        return res.status(status.BadRequest).jsonp({
          status: jsonStatus.BadRequest,
          message: messages[req.userLanguage].invalid.replace('##', 'File data')
        })
      }

      const url = {}

      for (const item of data) {
        const { path, flag } = item

        if (!path || !flag) {
          return res.status(status.BadRequest).jsonp({
            status: jsonStatus.BadRequest,
            message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].data)
          })
        }
        const signedUrlData = await getObjectPresignedUrlForPrivate(path)
        url[flag] = signedUrlData
      }

      return res.jsonp({ url })
    } catch (error) {
      return catchError('getPreSignedUrl.getUrlForPresigned', error, req, res)
    }
  }
}

module.exports = new GetPreSignedUrl()
