const s3Service = require('./s3Bucket')
const config = require('../../../config')
const { categories: CategoryModel, counts: CountsModel } = require('../../model')

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

  if (!sSortBy) sSortBy = 'dCreated'

  const sorting = { [sSortBy]: orderBy }

  if (sSortBy === 'nCount') sorting.dCreated = 1

  sSearch = defaultSearch(sSearch)

  return { nSkip, nLimit, sorting, sSearch }
}

const getUserPaginationValues = (obj) => {
  let { nSkip = 0, nLimit = 10, sSortBy = 'dCreated', nOrder, sSearch } = obj

  const orderBy = nOrder && nOrder === 1 ? 1 : -1

  const sorting = { [sSortBy]: orderBy }

  if (sSortBy === 'nCount') sorting.dCreated = 1

  sSearch = defaultSearch(sSearch)

  return { nSkip, nLimit, sorting, sSearch }
}

const getArticleVideoLimit = (obj) => {
  const { nLimit = 10, nSkip = 1 } = obj

  const response = {}
  if (nLimit % 2 !== 0) {
    if (nLimit === 1) {
      response.nArticleLimit = nLimit
      response.nVideoLimit = nLimit

      response.nArticleSkip = (nSkip <= 1) ? 0 : ((nSkip - 1) * response.nArticleLimit)
      response.nVideoSkip = (nSkip <= 1) ? 0 : ((nSkip - 1) * response.nVideoLimit)
    } else {
      response.nArticleLimit = Math.round(Math.ceil(nLimit / 2))
      response.nVideoLimit = Math.round(Math.floor(nLimit / 2))

      response.nArticleSkip = (nSkip <= 1) ? 0 : ((nSkip - 1) * response.nArticleLimit)
      response.nVideoSkip = (nSkip <= 1) ? 0 : ((nSkip - 1) * response.nVideoLimit)
    }
  } else {
    response.nArticleLimit = Math.round(nLimit / 2)
    response.nVideoLimit = Math.round(nLimit / 2)

    response.nArticleSkip = (nSkip <= 1) ? 0 : ((nSkip - 1) * response.nArticleLimit)
    response.nVideoSkip = (nSkip <= 1) ? 0 : ((nSkip - 1) * response.nVideoLimit)
  }
  return response
}

/**
 * Gives a s3 bukcket file upload URL and relative path
 * @param {*} url URL of image to upload in s3
 * @param {*} path s3 file upload path
 * @returns s3 image URL and relative path
 */
const getS3ImageURL = async (url, path, name) => {
  try {
    const response = { success: false, url: '', path: '' }
    const imageURL = url

    let imageName = imageURL.substring(imageURL.lastIndexOf('/') + 1)
    imageName = (imageName.match(/[^.]+(\.[^?#]+)?/) || [])[0]

    const fileExtensionPattern = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi
    const fileExtension = imageName.match(fileExtensionPattern)[0]
    const fileName = name ?? `${new Date().getTime()}-${Math.floor(Math.random() * 100000 + 99999).toString()}`
    const imagePath = name ? path + name : path + fileName + fileExtension
    await s3Service.UploadFromUrlToS3(imageURL, imagePath)
      .then(function (res) {
        response.success = true
        response.path = imagePath
        response.url = config.S3_BUCKET_URL + imagePath
      }).catch(function (err) {
        response.error = err
      })
    return response
  } catch (error) {
    return error
  }
}

const updateCategoryCount = async () => {
  try {
    const nS = await CategoryModel.countDocuments({ eType: 's', eStatus: { $in: ['a', 'i'] } }).lean()
    const nAS = await CategoryModel.countDocuments({ eType: 'as', eStatus: { $in: ['a', 'i'] } }).lean()
    const nP = await CategoryModel.countDocuments({ eType: 'pct', eStatus: { $in: ['a', 'i'] } }).lean()

    const params = { nS, nAS, nP }

    await CountsModel.updateOne({ eType: 'ct' }, params, { upsert: true })
    return
  } catch (error) {
    return error
  }
}

module.exports = {
  defaultSearch,
  getPaginationValues,
  getUserPaginationValues,
  getArticleVideoLimit,
  getS3ImageURL,
  updateCategoryCount
}
