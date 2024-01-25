const LeagueCategoryModel = require('./model')
const FilterCategoryModel = require('./filterCategory.model')
const { messages, status, jsonStatus } = require('../../helper/api.responses')
const LeagueModel = require('../league/model')
const { catchError, pick, removenull, getPaginationValues2, checkValidImageType } = require('../../helper/utilities.services')
const config = require('../../config/config')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const bucket = require('../../helper/cloudStorage.services')

class LeagueCategory {
  // To add leagueCategory
  async add(req, res) {
    try {
      const { sTitle } = req.body
      req.body = pick(req.body, ['sTitle', 'nPosition', 'sRemark', 'sImage', 'sColorCode'])

      const leagueExist = await LeagueCategoryModel.findOne({ sTitle }).lean()
      if (leagueExist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].leagueCatName) })

      const data = await LeagueCategoryModel.create({ ...req.body })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].cnewLeagueCategory), data })
    } catch (error) {
      catchError('LeagueCategory.add', error, req, res)
    }
  }

  // To update leagueCategory
  async update(req, res) {
    try {
      const { sTitle, sImage, sColorCode } = req.body
      req.body = pick(req.body, ['sTitle', 'nPosition', 'sRemark', 'sColorCode'])

      if (sTitle) {
        const leagueExist = await LeagueCategoryModel.findOne({ sTitle, _id: { $ne: req.params.id } }).lean()
        if (leagueExist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].leagueCatName) })
      }

      const data = await LeagueCategoryModel.findByIdAndUpdate(req.params.id, { ...req.body, sImage, sColorCode, dUpdatedAt: Date.now() }, { new: true, runValidators: true }).lean()

      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].leagueCategory) })
      await LeagueModel.updateMany({ iLeagueCatId: ObjectId(data._id) }, { $set: { sLeagueCategory: data.sTitle } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].leagueCategory), data })
    } catch (error) {
      catchError('LeagueCategory.update', error, req, res)
    }
  }

  // To get List of leagueCategory with pagination, sorting and searching
  async list(req, res) {
    try {
      const { start, limit, sorting, search } = getPaginationValues2(req.query)
      const query = search ? { sTitle: { $regex: new RegExp('^.*' + search + '.*', 'i') } } : {}

      const results = await LeagueCategoryModel.find(query, {
        sTitle: 1,
        nPosition: 1,
        sRemark: 1,
        dCreatedAt: 1,
        sKey: 1,
        sImage: 1,
        sColorCode: 1
      }).sort(sorting).skip(Number(start)).limit(Number(limit)).lean()

      const total = await LeagueCategoryModel.countDocuments({ ...query })

      const data = [{ total, results }]
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].leagueCategory), data })
    } catch (error) {
      return catchError('LeagueCategory.list', error, req, res)
    }
  }

  // To get signedUrl for league category image
  async getSignedUrl(req, res) {
    try {
      req.body = pick(req.body, ['sFileName', 'sContentType'])
      const { sFileName, sContentType } = req.body

      const valid = checkValidImageType(sFileName, sContentType)
      if (!valid) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].image) })

      const data = await bucket.getSignedUrl({ sFileName, sContentType, path: config.s3LeagueCategories })
      // const data = await s3.signedUrl(sFileName, sContentType, config.s3LeagueCategories)
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].presigned_succ, data })
    } catch (error) {
      catchError('LeagueCategory.getSignedUrl', error, req, res)
    }
  }

  // To get details of single leagueCategory by _id
  async get(req, res) {
    try {
      const data = await LeagueCategoryModel.findById(req.params.id).lean()
      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].leagueCategory) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].leagueCategory), data })
    } catch (error) {
      catchError('LeagueCategory.get', error, req, res)
    }
  }

  // To get List of leagueCategory sTitle and _id field
  async categoryList(req, res) {
    try {
      const data = await LeagueCategoryModel.find({}, { sTitle: 1 }).lean()

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].leagueCategory), data })
    } catch (error) {
      catchError('LeagueCategory.categoryList', error, req, res)
    }
  }

  async removeLeagueCategory(req, res) {
    try {
      const isHiddenLeague = await LeagueCategoryModel.findOne({ _id: ObjectId(req.params.id), sKey: 'hiddenLeague' }, { _id: 1 }).lean()
      if (isHiddenLeague) return res.status(status.BadRequest).jsonp({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].hidden_league_cat_delete_err })

      const data = await LeagueCategoryModel.findByIdAndDelete(req.params.id).lean()
      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].leagueCategory) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].leagueCategory), data })
    } catch (error) {
      catchError('LeagueCategory.removeLeagueCategory', error, req, res)
    }
  }

  async addFilterCategory(req, res) {
    try {
      const { sTitle } = req.body
      req.body = pick(req.body, ['sTitle', 'sRemark'])

      const leagueExist = await FilterCategoryModel.findOne({ sTitle }).lean()
      if (leagueExist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].leagueFilterName) })

      const data = await FilterCategoryModel.create({ ...req.body })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].cnewFilterCategory), data })
    } catch (error) {
      catchError('LeagueCategory.addFilterCategory', error, req, res)
    }
  }

  async updateFilterCategory(req, res) {
    try {
      const { sTitle } = req.body
      req.body = pick(req.body, ['sTitle', 'sRemark'])
      removenull(req.body)

      if (sTitle) {
        const leagueExist = await FilterCategoryModel.findOne({ sTitle, _id: { $ne: req.params.id } }).lean()
        if (leagueExist) return res.status(status.ResourceExist).jsonp({ status: jsonStatus.ResourceExist, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].leagueFilterName) })
      }
      const data = await FilterCategoryModel.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true, runValidators: true }).lean()

      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].filterCategory) })
      await LeagueModel.updateMany({ iFilterCatId: ObjectId(data._id) }, { $set: { sFilterCategory: data.sTitle } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].filterCategory), data })
    } catch (error) {
      catchError('LeagueCategory.updateFilterCategory', error, req, res)
    }
  }

  async listFilterCategory(req, res) {
    try {
      const { start, limit, sorting, search } = getPaginationValues2(req.query)
      const query = search ? { sTitle: { $regex: new RegExp('^.*' + search + '.*', 'i') } } : {}

      const results = await FilterCategoryModel.find(query, {
        sTitle: 1,
        sRemark: 1,
        dCreatedAt: 1
      }).sort(sorting).skip(Number(start)).limit(Number(limit)).lean()

      const total = await FilterCategoryModel.countDocuments({ ...query })

      const data = [{ total, results }]

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].filterCategory), data })
    } catch (error) {
      return catchError('LeagueCategory.listFilterCategory', error, req, res)
    }
  }

  async getFilterCategory(req, res) {
    try {
      const data = await FilterCategoryModel.findById(req.params.id).lean()
      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].filterCategory) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].filterCategory), data })
    } catch (error) {
      catchError('LeagueCategory.getFilterCategory', error, req, res)
    }
  }

  async FilterCategoryList(req, res) {
    try {
      const data = await FilterCategoryModel.find({}, { sTitle: 1 }).lean()

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].filterCategory), data })
    } catch (error) {
      catchError('LeagueCategory.FilterCategoryList', error, req, res)
    }
  }

  async removeFilterCategory(req, res) {
    try {
      const data = await FilterCategoryModel.findByIdAndDelete(req.params.id).lean()
      if (!data) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].filterCategory) })

      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].filterCategory), data })
    } catch (error) {
      catchError('LeagueCategory.removeFilterCategory', error, req, res)
    }
  }
}

module.exports = new LeagueCategory()
