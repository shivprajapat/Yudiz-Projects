/* eslint-disable camelcase */
const { catchError, removenull, randomStr, getPaginationValues, getUniqueString } = require('../../../helper/utilities.services')
const { messages, status, jsonStatus } = require('../../../helper/api.responses')
const CareerProfileModel = require('./career-profile.model')
const CareerDetailProfileModel = require('./career-profile-detail.model')
const { Op } = require('sequelize')
const { sequelize } = require('../../../database/sequelize')

class CareerProfileService {
  async getCareerProfileById(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await CareerProfileModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].careerProfile) })

      const careerProfile = await CareerProfileModel.findAll({
        where: {
          id,
          deleted_at: null
        },
        include: [{
          model: CareerDetailProfileModel,
          as: 'career_detail',
          where: { deleted_at: null },
          attributes: ['id', 'career_profile_id', 'profile_type_det']
        }],
        attributes: ['id', 'profile_type', 'filename', 'path', 'contenttype', 'is_active']
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: careerProfile, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('careerProfile.getAllCareerProfile', error, req, res)
    }
  }

  async getAll(req, res) {
    try {
      removenull(req.body)
      const { start, limit, sorting, search } = getPaginationValues(req.body)

      const careerProfile = await CareerProfileModel.findAndCountAll({
        where: {
          [Op.or]: [{
            profile_type: {
              [Op.like]: `%${search}%`
            }
          }
          ],
          deleted_at: null
        },
        attributes: ['id', 'profile_type', 'filename', 'path', 'contenttype', 'is_active'],
        order: sorting,
        limit,
        offset: start
      })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: careerProfile, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('careerProfile.getcareerProfile', error, req, res)
    }
  }

  async getAllProfileDetailsFront(req, res) {
    try {
      removenull(req.body)

      const careerProfilDetails = await CareerDetailProfileModel.findAll()
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: careerProfilDetails, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('careerProfile.getcareerProfileDetail', error, req, res)
    }
  }

  async getAllCareerProfilFront(req, res) {
    try {
      const careerProfile = await CareerProfileModel.findAll({ where: { deleted_at: null, is_active: 'y' } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: careerProfile, message: messages[req.userLanguage].success.replace('##', messages[req.userLanguage].data) })
    } catch (error) {
      return await catchError('careerProfile.getcareerProfile', error, req, res)
    }
  }

  async createCareerProfile(req, res) {
    try {
      removenull(req.body)
      let { profile_type, profile_type_det, fileName, path, contenttype } = req.body

      profile_type_det = JSON.parse(profile_type_det)

      const exist = await CareerProfileModel.findOne({ where: { profile_type, deleted_at: null } })
      if (exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].careerProfile) })

      let transaction
      try {
        transaction = await sequelize.transaction()
        const sCustomId = randomStr(8, 'string')
        const careerProfileCreated = await CareerProfileModel.create({ custom_id: sCustomId, profile_type, filename: fileName, path, contenttype }, { transaction })

        const careerProfileId = careerProfileCreated.id
        const forLoop = async _ => {
          for (let detail = 0; detail < profile_type_det.length; detail++) {
            const sCustomIdDetail = randomStr(8, 'string')
            await CareerDetailProfileModel.create({ custom_id: sCustomIdDetail, profile_type_det: profile_type_det[detail], career_profile_id: careerProfileId }, { transaction })
          }
        }
        await forLoop()

        await transaction.commit()
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, data: careerProfileCreated, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].careerProfile) })
      } catch (error) {
        if (transaction) await transaction.rollback()
        return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
      }
    } catch (error) {
      return await catchError('career.createCareerProfile', error, req, res)
    }
  }

  async updateCareerProfile(req, res) {
    try {
      const { profile_type, fileName, path, contenttype, id, updateType, isActive } = req.body
      const careerProfileArray = req.body
      removenull(req.body)

      const exist = await CareerProfileModel.findOne({ where: { id, deleted_at: null } })
      if (exist) {
        if (updateType && updateType === 'status') {
          let transaction
          try {
            transaction = await sequelize.transaction()
            await CareerProfileModel.update({ is_active: isActive }, { where: { id: id } }, { transaction })
            await CareerDetailProfileModel.update({ is_active: isActive }, { where: { career_profile_id: id } }, { transaction })
            return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].careerProfile) })
          } catch (error) {
            if (transaction) await transaction.rollback()
            return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
          }
        } else {
          const titleExist = await CareerProfileModel.findAll({ raw: true, where: { id: { [Op.not]: id }, profile_type, deleted_at: null } })
          if (titleExist.length) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].careerProfile) })

          let transaction
          try {
            transaction = await sequelize.transaction()
            await CareerProfileModel.update({ profile_type, filename: fileName, path, contenttype }, { where: { id: id } }, { transaction })

            careerProfileArray.careerProfileArray = JSON.parse(careerProfileArray.careerProfileArray)
            for (const data of careerProfileArray.careerProfileArray) {
              if (data && data.id) {
                await CareerDetailProfileModel.update({ profile_type_det: data.profile_type_det, career_profile_id: exist.id }, { where: { id: data.id } }, { transaction })
              } else {
                const customId = await getUniqueString(8, CareerDetailProfileModel)
                data.custom_id = customId
                data.career_profile_id = exist.id
                await CareerDetailProfileModel.create(data, { transaction })
              }
            }
            await transaction.commit()
            return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].careerProfile) })
          } catch (error) {
            await transaction.rollback()
            return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
          }
        }
      } else {
        return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].careerProfile) })
      }
    } catch (error) {
      return await catchError('careerProfile.updateCareerProfile', error, req, res)
    }
  }

  async deleteCareerProfile(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body

      const exist = await CareerProfileModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].careerProfile) })

      let transaction
      try {
        transaction = await sequelize.transaction()
        await CareerProfileModel.update({ deleted_at: new Date() }, { raw: true, where: { id: id } }, { transaction })
        await CareerDetailProfileModel.update({ deleted_at: new Date() }, { raw: true, where: { career_profile_id: id } }, { transaction })

        await transaction.commit()
        return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].careerProfile) })
      } catch (error) {
        if (transaction) await transaction.rollback()
        return res.status(status.UnprocessableEntity).jsonp({ status: jsonStatus.UnprocessableEntity, message: messages[req.userLanguage].try_again })
      }
    } catch (error) {
      return await catchError('careerProfile.deleteCareerProfile', error, req, res)
    }
  }

  async deleteDetailCareerProfile(req, res) {
    try {
      removenull(req.body)
      const { id } = req.body
      const exist = await CareerDetailProfileModel.findOne({ where: { id, deleted_at: null } })
      if (!exist) return res.status(status.NotFound).jsonp({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].careerProfileDetail) })

      await CareerDetailProfileModel.update({ deleted_at: new Date() }, { raw: true, where: { id } })
      return res.status(status.OK).jsonp({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].careerProfileDetail) })
    } catch (error) {
      return await catchError('careerDetailProfile.deleteDetailCareerProfile', error, req, res)
    }
  }
}

module.exports = new CareerProfileService()
