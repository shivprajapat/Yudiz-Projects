/* eslint-disable camelcase */
const { tags: TagsModel } = require('../../model')

// service only for player, team and venue
class TagService {
  async tagExist(req, res) {
    try {
      let bIsExist = false

      if (!req?.query?.sName) return res.status(messages.status.statusOk).jsonp({ status: messages.status.statusOk, message: messages.english.fieldRequired.message, oData: { bIsError: true } })

      const { sName, iId } = req?.query

      const query = { sName: { $regex: new RegExp(`^${sName}$`, 'i') }, eStatus: 'a' }

      const tag = await TagsModel.findOne(query).lean()
      if (tag) {
        if ((iId && !tag?.iId) || iId !== tag?.iId?.toString()) bIsExist = true
      }

      return res.status(messages.status.statusOk).jsonp({ status: messages.status.statusOk, message: messages.english.fetchSuccess.message.replace('##', 'tag detail'), oData: { bIsExist, bIsError: false } })
    } catch (error) {
      console.log(error)
      return error
    }
  }
}

module.exports = new TagService()
