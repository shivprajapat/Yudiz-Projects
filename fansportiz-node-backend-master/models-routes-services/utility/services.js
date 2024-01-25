const { messages, status, jsonStatus } = require('../../helper/api.responses')
const { catchError } = require('../../helper/utilities.services')
const config = require('../../config/config')

class Utility {
  getUrls(req, res) {
    try {
      const data = {
        kyc: config.S3_BUCKET_KYC_URL,
        media: config.S3_BUCKET_URL
      }

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].url), data })
    } catch (error) {
      catchError('Utility.getUrls', error, req, res)
    }
  }

  getUrl(req, res) {
    try {
      let data
      if (req.params.type === 'kyc') {
        data = config.S3_BUCKET_KYC_URL
      } else if (req.params.type === 'media') {
        data = config.S3_BUCKET_URL
      } else {
        return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].type) })
      }
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].url), data })
    } catch (error) {
      catchError('Utility.getUrl', error, req, res)
    }
  }
}
module.exports = new Utility()
