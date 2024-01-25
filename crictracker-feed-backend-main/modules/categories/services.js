const { categories: CategoriesModel } = require('../../app/model')

class CategoryService {
  async getCategoryById(_id) {
    try {
      const category = CategoriesModel.findById(_id).lean()
      return category
    } catch (error) {
      return error
    }
  }

  async getCategoryByQuery(query = {}, populate = []) {
    try {
      const category = CategoriesModel.findOne(query).populate(populate).lean()
      return category
    } catch (error) {
      return error
    }
  }

  async getCategoriesByQuery(query = {}, populate = [], sort = undefined, offset = 0, limit = 0) {
    try {
      const category = CategoriesModel.find(query).populate(populate).sort(sort ?? { dCreated: -1 }).skip(offset).limit(limit).lean()
      return category
    } catch (error) {
      return error
    }
  }
}

module.exports = new CategoryService()
