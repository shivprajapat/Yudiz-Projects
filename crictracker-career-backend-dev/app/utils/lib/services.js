const { jobPosts: JobPostsModel, enquiries: EnquiriesModel, counts: CountsModel } = require('../../model')

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

const getUserPaginationValues = (obj) => {
  let { nSkip = 0, nLimit = 10, sSortBy = 'dCreated', nOrder, sSearch } = obj

  const orderBy = nOrder && nOrder === 1 ? 1 : -1

  const sorting = { [sSortBy]: orderBy }

  if (sSortBy === 'nCount') sorting.dCreated = 1

  sSearch = defaultSearch(sSearch)

  return { nSkip, nLimit, sorting, sSearch }
}

const updateCounts = async (eType) => {
  try {
    const updateParams = {}

    if (eType === 'jp') {
      updateParams.nJP = await JobPostsModel.countDocuments({ eStatus: { $ne: 'd' } }).lean()
      updateParams.nER = await EnquiriesModel.countDocuments({ eStatus: { $ne: 'd' } }).lean()
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
  updateCounts
}
