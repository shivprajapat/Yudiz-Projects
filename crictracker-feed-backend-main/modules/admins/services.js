const jwt = require('jsonwebtoken')
const config = require('../../config')
const { _ } = require('../../global/index')
const AdminsModel = require('./model')

class Admins {
  async register(req, res) {
    try {
      req.body = _.pick(req.body, ['sName', 'sUsername', 'sEmail', 'eType', 'sPassword', 'sSecret'])

      _.removenull(req.body)

      const { sUsername, sEmail, sSecret } = req.body

      if (sSecret !== 'cR!(7f33d@dm!n') return _.response(req, res, 'serverError', 'statusBadRequest', {})

      if (!_.checkAlphanumeric(sUsername)) return _.response(req, res, 'must_alpha_num', 'statusBadRequest', {}, 'userName')

      const adminExist = await AdminsModel.findOne({ $or: [{ sEmail }, { sUsername }] })
      if (adminExist) return _.response(req, res, 'already_exist', 'statusResourceExist', {}, 'admin')

      const newAdmin = new AdminsModel({ ...req.body })

      const admin = await newAdmin.save()

      const newToken = {
        sToken: jwt.sign({ _id: (admin._id).toHexString() }, config.JWT_SECRET, { expiresIn: config.JWT_VALIDITY })
      }

      if (admin.aJwtTokens.length < config.LOGIN_HARD_LIMIT_ADMIN || config.LOGIN_HARD_LIMIT_ADMIN === 0) {
        admin.aJwtTokens.push(newToken)
      } else {
        admin.aJwtTokens.splice(0, 1)
        admin.aJwtTokens.push(newToken)
      }

      await admin.save()

      return _.response(req, res, 'reg_success', 'statusOk', {}, 'admin')
    } catch (error) {
      return _.catchError('Admins.register', error, req, res)
    }
  }
}

module.exports = new Admins()
