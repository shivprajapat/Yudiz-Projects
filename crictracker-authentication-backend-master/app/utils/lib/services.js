const s3Service = require('./s3Bucket')
const config = require('../../../config')

const defaultSearch = (val) => {
  let search
  if (val) {
    search = val.replace(/\\/g, '\\\\')
      .replace(/\$/g, '\\$')
      .replace(/\*/g, '\\*')
      .replace(/\+/g, '\\+')
      .replace(/\[/g, '\\[')
      .replace(/\]/g, '\\]')
      .replace(/\)/g, '\\)')
      .replace(/\(/g, '\\(')
      .replace(/'/g, '\\\'')
      .replace(/"/g, '\\"')
    return search
  } else {
    return ''
  }
}

const getPaginationValues = (obj) => {
  let { nSkip = 1, nLimit = 10, sSortBy = 'dCreated', nOrder, sSearch } = obj

  nSkip = (nSkip <= 1) ? 0 : ((nSkip - 1) * nLimit)
  const orderBy = nOrder && nOrder === 1 ? 1 : -1

  const sorting = { [sSortBy]: orderBy }

  if (sSortBy === 'nCount') sorting.dCreated = 1

  sSearch = defaultSearch(sSearch)

  return { nSkip, nLimit, sorting, sSearch }
}

const getS3ImageURL = async (url, path) => {
  try {
    const response = { success: false, url: '', path: '' }
    const imageURL = url

    await s3Service.UploadFromUrlToS3(imageURL, path)
      .then(function (res) {
        response.success = true
        response.path = res.destPath
        response.url = config.S3_BUCKET_URL + res.destPath
      }).catch(function (err) {
        response.error = err
      })
    return response
  } catch (error) {
    return error
  }
}

module.exports = {
  defaultSearch,
  getPaginationValues,
  getS3ImageURL
}
