/* eslint-disable no-case-declarations */
/* eslint-disable no-useless-escape */
const _ = require('../../../global')
const { admins } = require('../../model')
const { getPaginationValues } = require('../../utils')

const controllers = {}

controllers.listAuthors = async (parent, { input }, context) => {
  try {
    const { sAlphaSearch } = input
    const { nSkip, nLimit, sSearch } = getPaginationValues(input)
    const query = {
      eDisplayStatus: 'a',
      eType: { $ne: 'su' },
      nArticleCount: { $gt: 0 }
    }

    if (sAlphaSearch) query.sDisplayName = new RegExp('^' + sAlphaSearch + '.*', 'ig')

    if (sSearch) Object.assign(query, { $or: [{ sDisplayName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }, { sUName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }] })

    const nTotal = await admins.countDocuments(query)
    const aResults = await admins.find(query)
      .sort({ sDisplayName: 1, nArticleCount: -1, nViewCount: -1 })
      .skip(parseInt(nSkip))
      .limit((parseInt(nLimit))).lean()
    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.getAuthor = async (parent, { input }, context) => {
  try {
    if (!input._id) return _.throwError('requiredField', context)
    const author = await admins.findOne({ _id: input._id }).lean()
    if (!author) _.throwError('notFound', context, 'author')
    return author
  } catch (error) {
    return error
  }
}

module.exports = controllers
