const { players: PlayersModel, CountsModel, teams: TeamsModel, matches: MatchesModel, fantasyarticles: FantasyArticlesModel } = require('../../model')
const moment = require('moment')
const config = require('../../../config')
const s3Service = require('../../utils/lib/s3Bucket')

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
  let { nSkip = 1, nLimit = 10, sSortBy = 'dCreated', nOrder, sSearch } = obj || {}

  nSkip = (nSkip <= 1) ? 0 : ((nSkip - 1) * nLimit)
  const orderBy = nOrder && nOrder === 1 ? 1 : -1

  const sorting = { [sSortBy]: orderBy }

  if (sSortBy === 'nCount') sorting.dCreated = 1

  sSearch = defaultSearch(sSearch)

  return { nSkip, nLimit, sorting, sSearch }
}

const getUserPaginationValues = (obj) => {
  let { nSkip = 0, nLimit = 10, sSortBy = 'dCreated', nOrder, sSearch } = obj

  nSkip = !nSkip ? 0 : nSkip
  nLimit = !nLimit ? 10 : nLimit
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
const getS3ImageURL = async (url, path, prefix) => {
  try {
    const response = { success: false, url: '', path: '' }
    const imageURL = url

    let imageName = imageURL.substring(imageURL.lastIndexOf('/') + 1)
    imageName = (imageName.match(/[^.]+(\.[^?#]+)?/) || [])[0]

    const fileExtensionPattern = /\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi
    const fileExtension = imageName.match(fileExtensionPattern)[0]

    const imagePath = `${path}${imageName.split('.')[0]?.toLowerCase()}_${prefix || Date.now()}${fileExtension}`

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
    console.log(error)
    return error
  }
}

const updateCounts = async (eType) => {
  try {
    const updateParams = {}

    if (eType !== 'fa') {
      const Model = eType === 'p' ? PlayersModel : TeamsModel

      const nAll = await Model.countDocuments({}).lean()
      const nAp = await Model.countDocuments({ eTagStatus: 'a' }).lean()
      const nP = await Model.countDocuments({ eTagStatus: 'p' }).lean()
      const nR = await Model.countDocuments({ eTagStatus: 'r' }).lean()

      Object.assign(updateParams, { nAll, nAp, nP, nR })
    } else {
      const nUM = await MatchesModel.countDocuments({ sStatusStr: { $in: ['scheduled', 'live'] }, dEndDate: { $gte: moment().startOf('day').toDate() } }).lean()
      const nCM = await MatchesModel.countDocuments({ sStatusStr: 'completed' }).lean()
      const nT = await FantasyArticlesModel.find({ eState: 't' }).distinct('iMatchId').lean()

      Object.assign(updateParams, { nUM, nT: nT?.length, nCM })
    }
    await CountsModel.updateOne({ eType }, updateParams, { upsert: true })
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
