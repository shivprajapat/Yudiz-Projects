const s3Bucket = require('./s3config')
const { handleCatchError } = require('./utilities.services')

async function putObject (params) {
  try {
    const { sFileName, sContentType, path, fileStream, sDeposition } = params
    return await s3Bucket.putObj(sFileName, sContentType, path, fileStream, sDeposition)
  } catch (error) {
    handleCatchError(error)
    return error
  }
}

async function getObject (params) {
  try {
    const { sFileName, path } = params
    return await s3Bucket.s3GetObjSignedUrl(sFileName, path)
  } catch (error) {
    handleCatchError(error)
    return error
  }
}
module.exports = { putObject, getObject }
