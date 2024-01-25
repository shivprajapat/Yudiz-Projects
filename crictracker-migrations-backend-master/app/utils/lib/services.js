const s3Service = require('./s3Bucket')
const config = require('../../../config')
const { wptagcounts: CountsModel, wptags: WPTagsModel } = require('../../../models-routes-services/models')

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

  const oSorting = { [sSortBy]: orderBy }

  if (sSortBy === 'nCount') oSorting.dCreated = 1

  sSearch = defaultSearch(sSearch)

  return { nSkip, nLimit, oSorting, sSearch }
}

const getUserPaginationValues = (obj) => {
  let { nSkip = 0, nLimit = 10, sSortBy = 'dCreated', nOrder, sSearch } = obj

  const orderBy = nOrder && nOrder === 1 ? 1 : -1

  const sorting = { [sSortBy]: orderBy }

  if (sSortBy === 'nCount') sorting.dCreated = 1

  sSearch = defaultSearch(sSearch)

  return { nSkip, nLimit, sorting, sSearch }
}

/**
 * Gives a s3 bukcket file upload URL and relative path
 * @param {*} url URL of image to upload in s3
 * @param {*} path s3 file upload path
 * @returns s3 image URL and relative path
 */
const getS3ImageURL = async (url, path) => {
  try {
    const response = { success: false, url: '', path: '' }
    const imageURL = url
    let fileName = imageURL.split('/').pop()
    fileName = fileName.split('.')[0]
    let imagePath = ''
    if (path === 'profile-pic') {
      imagePath = path + '/' + fileName + '_default_profile.jpeg'
    } else {
      let imageName = imageURL.substring(imageURL.lastIndexOf('/') + 1)
      imageName = (imageName.match(/[^.]+(\.[^?#]+)?/) || [])[0]
      const fileExtensionPattern = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi
      const fileExtension = imageName.match(fileExtensionPattern)[0]
      imagePath = path + '/' + fileName + fileExtension
    }

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
    // console.log(error)
    return error
  }
}

const updateCounts = async () => {
  try {
    const nS = await WPTagsModel.countDocuments({ eType: 'simple', bIsAssigned: false, eStatus: 'a' })
    const nP = await WPTagsModel.countDocuments({ eType: 'player', bIsAssigned: false, eStatus: 'a' })
    const nT = await WPTagsModel.countDocuments({ eType: 'team', bIsAssigned: false, eStatus: 'a' })
    const nV = await WPTagsModel.countDocuments({ eType: 'venue', bIsAssigned: false, eStatus: 'a' })
    const nA = await WPTagsModel.countDocuments({ eType: { $in: ['simple', 'team', 'player', 'venue'] }, bIsAssigned: true, eStatus: 'a' })

    await CountsModel.updateOne({ eType: 'm' }, { nS, nP, nT, nV, nA }, { upsert: true })
  } catch (error) {
    return error
  }
}

module.exports = {
  defaultSearch,
  getPaginationValues,
  getUserPaginationValues,
  getS3ImageURL,
  updateCounts
}
