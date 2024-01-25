const { tags: TagsModel } = require('../../app/model')

class CategoryService {
  async getTagById(_id) {
    try {
      const tag = TagsModel.findById(_id).lean()
      return tag
    } catch (error) {
      return error
    }
  }

  async getTagByQuery(query = {}, populate = []) {
    try {
      const tag = TagsModel.findOne(query).populate(populate).lean()
      return tag
    } catch (error) {
      return error
    }
  }

  async getTagsByQuery(query = {}, populate = [], sort = undefined, offset = 0, limit = 0) {
    try {
      const tag = TagsModel.find(query).populate(populate).sort(sort ?? { dCreated: -1 }).skip(offset).limit(limit).lean()
      return tag
    } catch (error) {
      return error
    }
  }
}

module.exports = new CategoryService()
