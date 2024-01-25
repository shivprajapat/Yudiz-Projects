/* eslint-disable no-useless-escape */
const { tags: TagsModel } = require('../../../model')
const _ = require('../../../../global')

const controllers = {}

controllers.createTag = async ({ request }, cb) => {
  try {
    const { eType, iId, eStatus, iAdminId, sName } = request
    delete request.sServiceType
    await TagsModel.updateOne({ iId: _.mongify(iId) }, { eType, iId, eStatus, iSubmittedBy: _.mongify(iAdminId), iProcessedBy: _.mongify(iAdminId), sName }, { upsert: true })
    cb(null, { sMessage: 'success' })
  } catch (error) {
    cb(error, null)
  }
}

controllers.isTagExist = async ({ request }, cb) => {
  try {
    let bIsExist = false

    const query = { sName: request.sName, eStatus: 'a' }

    const tag = await TagsModel.findOne(query).lean()
    if (tag) {
      if ((request.iId && !tag?.iId) || request.iId !== tag?.iId?.toString()) {
        bIsExist = true
      }
    }

    cb(null, { bIsExist })
  } catch (error) {
    cb(error, null)
  }
}

module.exports = controllers
