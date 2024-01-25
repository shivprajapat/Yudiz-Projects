/* eslint-disable no-case-declarations */
/* eslint-disable no-useless-escape */
const mongoose = require('mongoose')
const _ = require('../../../../global')
const { admins, kycs, adminroles, tokens } = require('../../../model')
const { queuePush, s3, clientQueuePush } = require('../../../utils')
const { redisAuthDb } = require('../../../utils/lib/redis')
const moment = require('moment')

const controllers = {}

controllers.createSubAdmin = async (parent, { input }, context) => {
  try {
    input = _.pick(input, ['sDisplayName', 'sFullName', 'sNumber', 'eDesignation', 'sBio', 'sAddress', 'sCity', 'bIsVerified', 'sProfilePicture', 'sPanName', 'sPanPicture', 'sIfsc', 'sAccountName', 'aSocialProfiles', 'sMetaTitle', 'sMetaDescription', 'sCustomSlug', 'aMetaKeywords',
      'eSeoType', 'oFB', 'oTwitter', 'sCanonicalUrl', 'sRobots', 'oRole', 'eGender', 'bIsCustom', 'sUserName', 'sEmail', 'sPassword', 'sAccountNumber', 'sConfirmPassword', 'sPanNumber', 'sBankDetailPic', 'sBankName', 'sBranchName'])
    const {
      sDisplayName, sFullName, sNumber, eDesignation, sBio, sAddress, sCity, bIsVerified,
      sProfilePicture, sPanName, sPanPicture, sIfsc, sAccountName, aSocialProfiles, oRole, eGender, bIsCustom, sPanNumber,
      sBankDetailPic,
      sBankName,
      sBranchName
    } = input
    let { sUserName, sEmail, sPassword, sAccountNumber, sConfirmPassword } = input

    sUserName = sUserName.toLowerCase()
    sEmail = sEmail.toLowerCase()
    sPassword = _.asymmetricDecrypt(sPassword).message
    sConfirmPassword = _.asymmetricDecrypt(sConfirmPassword).message
    if (sAccountNumber) sAccountNumber = _.asymmetricDecrypt(sAccountNumber).message

    if (!sUserName || !sEmail || !sFullName || !sNumber || !eGender || !sPassword || !sConfirmPassword || !eDesignation) _.throwError('requiredField', context)

    if (_.isEmail(sEmail)) _.throwError('invalidEmail', context)
    if (_.isUserName(sUserName)) _.throwError('invalidUserName', context)
    if (sNumber.length !== 10) _.throwError('invalidNumber', context)

    const userExist = await admins.findOne({ $or: [{ sEmail }, { sNumber }] }).lean()
    if (userExist) _.throwError('alreadyExists', context, 'usernameOrEmailOrNumber')

    if (_.isPassword(sPassword)) _.throwError('invalidPassword', context)
    if (sPassword !== sConfirmPassword) _.throwError('passAndCpassNotMatch', context)

    const session = await mongoose.startSession()
    const transactionOptions = {
      readPreference: 'primary',
      readConcern: { level: 'majority' },
      writeConcern: { w: 'majority' }
    }

    try {
      session.startTransaction(transactionOptions)
      const userParams = {
        sUName: sUserName,
        sFName: sFullName,
        sEmail,
        sDisplayName,
        eGender,
        bIsCustom,
        sNumber,
        eDesignation,
        sPassword: _.encryptPassword(sPassword)
      }

      if (sBio && sBio.length > 250) _.throwError('invalidBio', context)
      userParams.sBio = sBio
      const aSocialLinks = []
      if (sAddress) userParams.sAddress = sAddress
      if (sCity) userParams.sCity = sCity
      if (bIsVerified) userParams.bIsVerified = bIsVerified
      if (sProfilePicture) userParams.sUrl = sProfilePicture

      if (aSocialProfiles && aSocialProfiles.length) {
        if (aSocialProfiles.length === 1) {
          if (!aSocialProfiles[0].eSocialNetworkType || !aSocialProfiles[0].sDisplayName || !aSocialProfiles[0].sLink) aSocialProfiles.length = 0
          else aSocialLinks.push(aSocialProfiles[0])
        } else {
          for (const obj of aSocialProfiles) {
            if (!obj.eSocialNetworkType || !obj.sDisplayName || !obj.sLink) _.throwError('incompleteSocialProfile', context)
            aSocialLinks.push(obj)
          }
        }
        Object.assign(userParams, { aSLinks: aSocialLinks })
      }
      const [admin] = await admins.create([userParams], { session })

      // pan and account details
      const kycParams = {}

      if (sPanName) kycParams.sPName = sPanName
      if (sPanPicture) kycParams.sUrl = sPanPicture
      if (sPanNumber) kycParams.sPanNumber = sPanNumber

      if (sAccountNumber && _.isAccountNumber(sAccountNumber)) _.throwError('invalidNumber', context)
      if (sIfsc && _.isIsfc(sIfsc)) _.throwError('ifscInvalid', context)

      kycParams.sANumber = sAccountNumber
      kycParams.sIfsc = sIfsc
      kycParams.sAName = sAccountName
      kycParams.sBankName = sBankName
      kycParams.sBankDetailPic = sBankDetailPic
      kycParams.sBranchName = sBranchName

      kycParams.iAdminId = admin._id
      const [oKyc] = await kycs.create([kycParams], { _id: 0, dCreated: 0, dUpdated: 0 }, { session })

      /// /enne
      const { aRoleId, aPermissions } = oRole

      await adminroles.create([{ iAdminId: admin._id, aRoleId, aPermissions }], { session })

      await session.commitTransaction()

      queuePush('sendMail', {
        eType: 'loginCredentials',
        sEmail,
        sUserName,
        sPassword
      })

      const response = admin
      Object.assign(response, { oKyc })

      const adminRoles = await adminroles.findOne({ iAdminId: _.mongify(admin._id) }).populate('aRoleId').populate('aPermissions.aRoles').populate('aPermissions.iPermissionId')
      Object.assign(response, { oRole: adminRoles })

      return _.resolve('addSuccess', { oData: response }, 'subAdmin', context)
    } catch (err) {
      await session.abortTransaction()
      return err
    }
  } catch (error) {
    return error
  }
}

controllers.generateUsername = async (parent, { input }, context) => {
  try {
    const { sUserName } = input
    if (!sUserName) return _.throwError('requiredField', context)

    const sUsername = sUserName.toLowerCase().trim().replace(/ +/g, '-')

    const genUsername = async () => {
      const sUName = sUsername + `-${_.randomCode(4)}`
      const count = await admins.count({ sUName: new RegExp(`^${sUName}$`, 'i') })
      if (_.isUserName(sUName)) return sUName
      if (!count) return sUName
      const res = await genUsername()
      return res
    }

    const user = await admins.count({ sUName: new RegExp(`^${sUsername}$`, 'i') })

    if (!user) return _.resolve('usernameGenerateSuccess', { oData: { sUsername, bIsExists: false } }, null, context)

    const generatedUsername = await genUsername()

    if (generatedUsername) return _.resolve('usernameGenerateSuccess', { oData: { sUsername: generatedUsername, bIsExists: true } }, null, context)
  } catch (error) {
    return error
  }
}

const getPaginationValues = (input, context) => {
  try {
    let { nLimit, nSkip, nOrder, sSortBy, sSearch } = input
    nLimit = nLimit || 10
    nSkip = nSkip - 1 <= 0
      ? 0
      : (nSkip - 1) * nLimit
    nOrder = nOrder || -1

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

    if (!sSearch) sSearch = ''
    else sSearch = defaultSearch(sSearch)
    if (sSortBy && !['dCreated', 'sFName', 'sEmail'].includes(sSortBy)) _.throwError('invalid', context, 'sort')
    sSortBy = sSortBy || 'sFName'

    const sort = {}
    sort[`admins.${sSortBy}`] = nOrder

    return { nSkip, nLimit, sort, sSearch }
  } catch (error) {
    return error
  }
}

controllers.listSubAdmins = async (parent, { input }, context) => {
  try {
    const { aFilters } = input
    const { nLimit, nSkip, sort, sSearch } = getPaginationValues(input, context)
    const { decodedToken } = context
    const $matchAdmin = {
      _id: { $ne: _.mongify(decodedToken.iAdminId) },
      eStatus: { $ne: 'd' },
      eType: { $ne: 'su' },
      $or: [
        { sEmail: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { sFName: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } },
        { sNumber: { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }
      ]
    }
    const $filterAdmin = {}
    const rolesQuery = {
    }
    if (aFilters.length) {
      aFilters.forEach((ele) => {
        if (ele === 'verifiedUsers') {
          if (!$filterAdmin.$and) $filterAdmin.$and = []
          $filterAdmin.$and.push({ bIsVerified: true })
        } else if (ele === 'activeUsers') {
          if (!$filterAdmin.$and) $filterAdmin.$and = []
          $filterAdmin.$and.push({ eStatus: 'a' })
        } else if (ele === 'deactivateUsers') {
          if (!$filterAdmin.$and) $filterAdmin.$and = []
          $filterAdmin.$and.push({ eStatus: 'i' })
        } else if (ele === 'customRole') {
          if (!$filterAdmin.$and) $filterAdmin.$and = []
          $filterAdmin.$and.push({ bIsCustom: true })
        } else {
          if (!rolesQuery.$or) rolesQuery.$or = []
          rolesQuery.$or.push({ 'aRole.aRoleId': _.mongify(ele) })
        }
      })
    }

    const [subAdmins] = await admins.aggregate([
      {
        $match: $matchAdmin
      },
      {
        $match: $filterAdmin
      },
      {
        $lookup: {
          from: 'adminroles',
          localField: '_id',
          foreignField: 'iAdminId',
          as: 'aRole'
        }
      },
      {
        $unwind: {
          path: '$aRole'
        }
      },
      {
        $match: rolesQuery
      },
      {
        $project: {
          sEmail: 1,
          sFName: 1,
          sNumber: 1,
          bIsVerified: 1,
          dCreated: 1,
          eStatus: 1,
          bIsCustom: true,
          roles: '$aRole.aRoleId',
          parent: '$aRole.aParentId',
          permissions: '$aRole.aPermissions'
        }
      }, {
        $lookup: {
          from: 'roles',
          localField: 'roles',
          foreignField: '_id',
          as: 'aRoleId'
        }
      }, {
        $lookup: {
          from: 'permissions',
          localField: 'permissions',
          foreignField: '_id',
          as: 'aPermissions'
        }
      }, {
        $project: {
          roles: 0,
          permissions: 0
        }
      }, {
        $addFields: {
          aRole: {
            aRoleId: '$aRoleId',
            aPermissions: '$aPermissions'
          }
        }
      }, {
        $project: {
          aRoleId: 0,
          aPermissions: 0
        }
      },
      {
        $group: {
          _id: 0,
          count: {
            $sum: 1
          },
          admins: {
            $push: '$$ROOT'
          }
        }
      },
      {
        $unwind: {
          path: '$admins'
        }
      },
      { $sort: sort },
      { $skip: nSkip },
      { $limit: nLimit },
      {
        $group: {
          _id: 0,
          count: { $first: '$count' },
          admins: {
            $push: '$admins'
          }
        }
      },
      { $project: { _id: 0 } }
    ]).allowDiskUse(global.allowDiskUse)
    return subAdmins ? { aResults: subAdmins.admins, nTotal: subAdmins.count } : { aResults: [], nTotal: 0 }
  } catch (error) {
    return error
  }
}

controllers.getSubAdmin = async (parent, { input }, context) => {
  try {
    if (!input._id) return _.throwError('requiredField', context)
    const subAdmin = await admins.findOne({ _id: input._id }).lean()
    if (!subAdmin) _.throwError('notFound', context, 'subAdmin')
    const adminRoles = await adminroles.findOne({ iAdminId: _.mongify(subAdmin._id) }).populate('aRoleId').populate('aPermissions.aRoles').populate('aPermissions.iPermissionId').lean()
    const oKyc = await kycs.findOne({ iAdminId: _.mongify(subAdmin._id) }).lean()
    Object.assign(subAdmin, { oRole: adminRoles, oKyc })

    return subAdmin
  } catch (error) {
    return error
  }
}

controllers.referenceResolverForSubAdmin = async (input) => {
  try {
    const subAdmin = await admins.findOne({ _id: input }).lean()
    const adminRoles = await adminroles.findOne({ iAdminId: _.mongify(subAdmin._id) }).populate('aParentId').populate('aPermissions').populate('aRoleId').lean()
    Object.assign(subAdmin, { aRole: adminRoles })
    return subAdmin
  } catch (error) {
    return error
  }
}

controllers.bulkAction = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['aIds', 'eType'])

    const findQuery = {
      $or: body.aIds
    }

    const updateQuery = {}
    let adminTokens
    const actArr = []
    switch (body.eType) {
      case 'v':
        Object.assign(updateQuery, { bIsVerified: true })
        break
      case 'a':
        Object.assign(updateQuery, { eStatus: 'a' })
        for (let index = 0; index < body.aIds.length; index++) {
          const ele = body.aIds[index]
          queuePush('updateEntitySeo', { iId: ele._id, eStatus: body.eType })
        }
        break
      case 'i':
        Object.assign(updateQuery, { eStatus: 'i' })
        for (let index = 0; index < body.aIds.length; index++) {
          const ele = body.aIds[index]
          queuePush('updateEntitySeo', { iId: ele._id, eStatus: body.eType })
          actArr.push({ iId: ele._id })
        }

        adminTokens = await tokens.find({ $or: actArr }).lean()
        if (adminTokens?.length) {
          adminTokens.forEach((ele) => {
            ele.aToken.forEach(async (ele) => {
              if (ele.sJwt) {
                if (_.decodeToken(ele.sJwt) !== 'jwt expired' && _.decodeToken(ele.sJwt) !== 'invalid signature') {
                  await redisAuthDb.setex(`at:${ele.sJwt}`, moment(_.decodeToken(ele.sJwt).exp * 1000).diff(moment(), 'seconds'), `${ele.iId}`)
                }
              }
            })
          })
        }
        break
      case 'd':
        Object.assign(updateQuery, { eStatus: 'd' })
        for (let index = 0; index < body.aIds.length; index++) {
          const ele = body.aIds[index]
          clientQueuePush('updateEntitySeo', { iId: ele._id, eStatus: body.eType })
          clientQueuePush('updateSiteMap', { _id: ele._id, eType: 'ad' })
        }
        adminTokens = await tokens.find(findQuery).lean()
        if (adminTokens?.length) {
          adminTokens.forEach((ele) => {
            ele.aToken.forEach(async (ele) => {
              if (ele.sJwt) {
                if (_.decodeToken(ele.sJwt) !== 'jwt expired' && _.decodeToken(ele.sJwt) !== 'invalid signature') {
                  await redisAuthDb.setex(`at:${ele.sJwt}`, moment(_.decodeToken(ele.sJwt).exp * 1000).diff(moment(), 'seconds'), `${ele.iId}`)
                }
              }
            })
          })
        }
        break
      case 'dv':
        Object.assign(updateQuery, { bIsVerified: false })
        break
      default:
        _.throwError('requiredField', context)
        break
    }
    const update = await admins.updateMany(findQuery, updateQuery)
    if (update.modifiedCount) return _.resolve('success', null, 'userStatusUpdate', context)
  } catch (error) {
    console.log(error)
    return error
  }
}

controllers.editSubAdmin = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['_id', 'sFullName', 'sUserName', 'sNumber', 'sCity', 'sAddress', 'eGender', 'sBio', 'bIsVerified', 'sDisplayName', 'eDesignation', 'sProfilePicture', 'aSocialProfiles', 'sPanName', 'sPanPicture', 'sIfsc', 'sAccountNumber', 'sAccountName', 'sMetaTitle', 'sMetaDescription', 'aMetaKeywords', 'oFB', 'oTwitter', 'sCanonicalUrl', 'sRobots', 'sCustomSlug', 'oRole', 'sEmail', 'sPanNumber', 'sBankDetailPic', 'sBankName', 'sBranchName'])

    const { _id, sFullName, sUserName, sNumber, sCity, sAddress, eGender, sBio, bIsVerified, sDisplayName, eDesignation, sProfilePicture, aSocialProfiles, sPanName, sPanPicture, sIfsc, sAccountNumber, sAccountName, oRole, bIsCustom, sPanNumber, sBankDetailPic, sBankName, sBranchName } = body
    if (sNumber && sNumber.length !== 10) _.throwError('invalidNumber', context)
    const adminExist = await admins.findOne({ _id }).lean()
    if (!adminExist) _.throwError('notFound', context, 'subAdmin')

    const userNameExist = await admins.findOne({ sUName: sUserName, _id: { $ne: _id } })
    if (userNameExist) _.throwError('alreadyExists', context, 'userName')

    const session = await mongoose.startSession()
    const transactionOptions = {
      readPreference: 'primary',
      readConcern: { level: 'majority' },
      writeConcern: { w: 'majority' }
    }

    try {
      session.startTransaction(transactionOptions)
      const params = {
        sFName: sFullName,
        sUName: sUserName,
        sNumber,
        sCity,
        sAddress,
        eGender,
        sBio,
        sDisplayName,
        eDesignation,
        bIsCustom,
        sUrl: sProfilePicture
      }
      // If profile picture changed
      if (sProfilePicture) {
        const admin = await admins.findOne({ _id }).lean()
        if (admin.sUrl) if (admin.sUrl !== sProfilePicture) s3.deleteObject(admin.sUrl)
      } else {
        const admin = await admins.findOne({ _id }).lean()
        if (admin.sUrl) s3.deleteObject(admin.sUrl)
      }

      for (const prop in params) {
        if (!params[prop]) delete params[prop]
      }

      if (!bIsVerified) params.bIsVerified = false
      else params.bIsVerified = bIsVerified

      if (aSocialProfiles && aSocialProfiles.length) {
        if (aSocialProfiles.length === 1) {
          if (!aSocialProfiles[0].eSocialNetworkType || !aSocialProfiles[0].sDisplayName || !aSocialProfiles[0].sLink) aSocialProfiles.pop()
        } else {
          for (const obj of aSocialProfiles) {
            if (!obj.eSocialNetworkType || !obj.sDisplayName || !obj.sLink) _.throwError('incompleteSocialProfile', context)
          }
        }
      }

      if (aSocialProfiles?.length) params.aSLinks = aSocialProfiles
      const subAdmin = await admins.findOneAndUpdate({ _id }, params, { session, new: true }).lean()
      if (!subAdmin) _.throwError('notFound', context, 'subAdmin')

      const kycParams = {}
      kycParams.sPName = sPanName
      kycParams.sUrl = sPanPicture
      kycParams.sPanNumber = sPanNumber

      if (sIfsc) {
        if (_.isIsfc(sIfsc)) _.throwError('ifscInvalid', context)
      }
      kycParams.sIfsc = sIfsc
      let sAcNumberDecrypt
      if (sAccountNumber) {
        sAcNumberDecrypt = _.asymmetricDecrypt(sAccountNumber).message
        if (_.isAccountNumber(sAcNumberDecrypt)) _.throwError('accountNumberInvalid', context)
      }
      kycParams.sANumber = sAcNumberDecrypt

      kycParams.sAName = sAccountName
      kycParams.sBankDetailPic = sBankDetailPic
      kycParams.sBankName = sBankName
      kycParams.sBranchName = sBranchName

      const oKyc = await kycs.findOneAndUpdate({ iAdminId: _.mongify(_id) }, kycParams, { upsert: true, session, new: true }).lean()
      if (sPanPicture) {
        const findKyc = await kycs.findOne({ iAdminId: _.mongify(_id) }).lean()
        if (findKyc) if (findKyc?.sUrl !== kycParams?.sUrl) s3.deleteObject(findKyc.sUrl)
      } else {
        const findKyc = await kycs.findOne({ iAdminId: _.mongify(_id) }).lean()
        if (findKyc) if (findKyc?.sUrl) s3.deleteObject(findKyc.sUrl)
      }
      if (sBankDetailPic) {
        const findKyc = await kycs.findOne({ iAdminId: _.mongify(_id) }).lean()
        if (sBankDetailPic) if (findKyc?.sBankDetailPic !== kycParams?.sBankDetailPic) s3.deleteObject(findKyc.sBankDetailPic)
      } else {
        const findKyc = await kycs.findOne({ iAdminId: _.mongify(_id) }).lean()
        if (findKyc) if (findKyc?.sBankDetailPic) s3.deleteObject(findKyc.sBankDetailPic)
      }

      const roleParams = {}
      if (oRole && Object.keys(oRole).length !== 0 && oRole?.constructor === Object) {
        const { aRoleId, aPermissions } = oRole
        roleParams.aRoleId = aRoleId
        if (aPermissions.length) roleParams.aPermissions = aPermissions
      }

      const adminRoles = await adminroles.findOneAndUpdate({ iAdminId: _.mongify(_id) }, roleParams, { session, new: true }).populate('aRoleId').populate('aPermissions.aRoles').populate('aPermissions.iPermissionId').lean()
      await session.commitTransaction()
      const response = subAdmin
      Object.assign(response, { oRole: adminRoles })
      Object.assign(response, { oKyc })
      return _.resolve('editSubAdminSuccess', { oData: response }, null, context)
    } catch (err) {
      await session.abortTransaction()
      return err
    }
  } catch (error) {
    return error
  }
}

controllers.editSubAdminProfilePicture = async (parent, { input }, context) => {
  try {
    const body = _.pick(input, ['_id', 'sUrl'])
    const { decodedToken } = context

    const query = {}
    if (body._id) Object.assign(query, { _id: body._id })
    else Object.assign(query, { _id: decodedToken.iAdminId })
    if (body.sUrl) {
      const admin = await admins.findOne(query).lean()
      if (admin.sUrl !== body.sUrl) s3.deleteObject(admin.sUrl)
    } else {
      const admin = await admins.findOne(query).lean()
      s3.deleteObject(admin.sUrl)
    }
    const updateQuery = { sUrl: body.sUrl }
    const update = await admins.updateOne(query, updateQuery)
    if (update.modifiedCount) return _.resolve('successfully', null, 'subAdminEdit', context)
  } catch (error) {
    return error
  }
}

controllers.editProfile = async (parent, { input }, context) => {
  try {
    const admin = context.decodedToken
    let {
      sAccountNumber, sDisplayName, sFullName, sNumber, sBio, sAddress, sCity,
      sProfilePicture, sPanName, sPanPicture, sIfsc, sAccountName, aSocialProfiles, eGender, sPanNumber, sBankDetailPic, sBankName, sBranchName
    } = input
    if (sNumber && sNumber.length !== 10) _.throwError('invalidNumber', context)
    if (sAccountNumber) {
      sAccountNumber = _.asymmetricDecrypt(sAccountNumber).message
      if (_.isAccountNumber(sAccountNumber)) _.throwError('invalidNumber', context)
    }

    if (sIfsc) if (_.isIsfc(sIfsc)) _.throwError('ifscInvalid', context)
    const userExist = await admins.findOne({ sNumber, _id: { $ne: admin.iAdminId } }).lean()
    if (userExist) _.throwError('alreadyExists', context, 'Number')

    const session = await mongoose.startSession()

    const transactionOptions = {
      readPreference: 'primary',
      readConcern: { level: 'majority' },
      writeConcern: { w: 'majority' }
    }

    try {
      session.startTransaction(transactionOptions)
      const updateQuery = {
        sFName: sFullName,
        sUrl: sProfilePicture,
        sDisplayName,
        sNumber,
        sBio,
        sAddress,
        sCity,
        eGender
      }

      if (sProfilePicture) {
        const findAdmin = await admins.findOne({ _id: admin.iAdminId }).lean()
        if (findAdmin.sUrl !== sProfilePicture) {
          s3.deleteObject(findAdmin.sUrl)
        }
      } else {
        updateQuery.sUrl = ''
        const findAdmin = await admins.findOne({ _id: admin.iAdminId }).lean()
        s3.deleteObject(findAdmin.sUrl)
      }

      for (const obj in updateQuery) {
        if (obj !== 'sUrl') {
          if (!updateQuery[obj]) delete updateQuery[obj]
        }
      }

      if (aSocialProfiles && aSocialProfiles.length) {
        if (aSocialProfiles.length === 1) {
          if (!aSocialProfiles[0].eSocialNetworkType || !aSocialProfiles[0].sDisplayName || !aSocialProfiles[0].sLink) aSocialProfiles.pop()
        } else {
          for (const obj of aSocialProfiles) {
            if (!obj.eSocialNetworkType || !obj.sDisplayName || !obj.sLink) _.throwError('incompleteSocialProfile', context)
          }
        }
      }

      updateQuery.aSLinks = aSocialProfiles

      const kycParams = {}

      kycParams.sPName = sPanName
      kycParams.sUrl = sPanPicture
      kycParams.sPanNumber = sPanNumber
      kycParams.sIfsc = sIfsc
      kycParams.sANumber = sAccountNumber
      kycParams.sAName = sAccountName
      kycParams.sBankDetailPic = sBankDetailPic
      kycParams.sBankName = sBankName
      kycParams.sBranchName = sBranchName

      if (sPanPicture) {
        const findKyc = await kycs.findOne({ iAdminId: _.mongify(admin.iAdminId) }).lean()
        if (findKyc.sUrl !== kycParams.sUrl) {
          s3.deleteObject(findKyc.sUrl)
        }
      } else {
        const findKyc = await kycs.findOne({ iAdminId: _.mongify(admin.iAdminId) }).lean()
        if (findKyc?.sUrl) s3.deleteObject(findKyc.sUrl)
      }

      if (sBankDetailPic) {
        const findKyc = await kycs.findOne({ iAdminId: _.mongify(admin.iAdminId) }).lean()
        if (findKyc.sBankDetailPic !== kycParams.sBankDetailPic) {
          s3.deleteObject(findKyc.sBankDetailPic)
        }
      } else {
        const findKyc = await kycs.findOne({ iAdminId: _.mongify(admin.iAdminId) }).lean()
        if (findKyc?.sBankDetailPic) s3.deleteObject(findKyc.sBankDetailPic)
      }

      const newAdmin = await admins.findOneAndUpdate({ _id: admin.iAdminId }, updateQuery, { upsert: true, session, new: true })
      if (!newAdmin) _.throwError('notFound', context, 'account')
      const updateKyc = await kycs.findOneAndUpdate({ iAdminId: _.mongify(admin.iAdminId) }, kycParams, { upsert: true, session, new: true })
      if (!updateKyc) _.throwError('notFound', context, 'kyc')

      await session.commitTransaction()
      const data = newAdmin
      Object.assign(data, { oKyc: updateKyc })
      return _.resolve('editProfileSuccess', { oData: data }, null, context)
    } catch (err) {
      await session.abortTransaction()
      return err
    }
  } catch (error) {
    return error
  }
}

controllers.getProfile = async (parent, { input }, context) => {
  try {
    const admin = context.decodedToken
    const data = await admins.findById(admin.iAdminId, { sPassword: 0 }).lean()
    if (!data) _.throwError('notFound', context, 'subAdmin')
    data.bSuperAdmin = data?.eType === 'su'
    const oKyc = await kycs.findOne({ iAdminId: _.mongify(admin.iAdminId) }).lean()
    Object.assign(data, { oKyc })
    return data
  } catch (error) {
    return error
  }
}

controllers.changePassword = async (parent, { input }, context) => {
  try {
    const admin = context.decodedToken
    const { sCurrentPassword, sNewPassword, sConfirmPassword } = input
    const currentPassword = _.asymmetricDecrypt(sCurrentPassword).message
    const confirmNewPassword = _.asymmetricDecrypt(sConfirmPassword).message
    const newPassword = _.asymmetricDecrypt(sNewPassword).message

    if (currentPassword === confirmNewPassword) _.throwError('passwordMatch', context)
    if (newPassword !== confirmNewPassword) _.throwError('passAndCpassNotMatch', context)
    if (_.isPassword(newPassword)) _.throwError('invalidPassword', context)

    const isExist = await admins.findOne({ _id: admin.iAdminId })
    if (!isExist) _.throwError('accountNotExist', context)

    if (isExist.sPassword !== _.encryptPassword(currentPassword)) _.throwError('changePasswordIncorrect', context)

    // const token = await tokens.findOne({ iId: _.mongify(admin.iAdminId) })
    // if (token?.aToken?.length) {
    //   for (let index = 0; index < token.aToken.length; index++) {
    //     const ele = token.aToken[index]
    //     if (ele.sJwt && (ele.sJwt !== context.headers.authorization) && _.decodeToken(ele.sJwt) !== 'jwt expired' && _.decodeToken(ele.sJwt) !== 'invalid signature') {
    //       await redisAuthDb.setex(`at:${ele.sJwt}`, moment(_.decodeToken(ele.sJwt).exp * 1000).diff(moment(), 'seconds'), `${admin._id}`)
    //       ele.sJwt = ''
    //     }
    //   }
    // }

    await admins.updateOne({ _id: _.mongify(admin.iAdminId) }, { sPassword: _.encryptPassword(newPassword) })
    // await tokens.updateOne({ iId: _.mongify(admin._id) }, { aToken: token.aToken })
    return _.resolve('successfully', null, 'changePassword', context)
  } catch (error) {
    return error
  }
}

controllers.authenticateAdmin = async (parent, input, context) => {
  try {
    if (!input._id) return _.throwError('requiredField', context)
    const subAdmin = await admins.findOne({ _id: input._id }).lean()
    if (!subAdmin) _.throwError('notFound', context, 'subAdmin')
    const adminRoles = await adminroles.findOne({ iAdminId: _.mongify(subAdmin._id) }).populate('aRoleId').populate('aPermissions.aRoles').populate('aPermissions.iPermissionId').lean()
    const oKyc = await kycs.findOne({ iAdminId: _.mongify(subAdmin._id) }).lean()
    Object.assign(subAdmin, { oRole: adminRoles, oKyc })
    return subAdmin
  } catch (error) {
    return error
  }
}

controllers.resolveSubAdmin = async (_id) => {
  try {
    const subAdmin = await admins.findOne({ _id: _.mongify(_id) })
    return subAdmin
  } catch (error) {
    return error
  }
}

controllers.changeAdminPicture = async (parent, { input }, context) => {
  try {
    const { eType, sUrl, _id } = input
    const { iAdminId } = context.decodedToken
    let update
    let query = {}
    let updateQuery = {}
    switch (eType) {
      case 'pp':
        query = {
          _id: iAdminId,
          eStatus: { $ne: 'd' }
        }

        updateQuery = {
          sUrl
        }

        update = await admins.findOneAndUpdate(query, updateQuery)
        if (update) return _.resolve('updateSuccess', null, 'profilePicture', context)
        return _.throwError('notFound', context, 'subAdmin')

      case 'ap':
        query = {
          _id,
          eStatus: { $ne: 'd' }
        }

        updateQuery = {
          sUrl
        }

        update = await admins.findOneAndUpdate(query, updateQuery)

        if (update) return _.resolve('updateSuccess', null, 'profilePicture', context)
        return _.throwError('notFound', context, 'subAdmin')

      case 'pn':
        query = {
          iAdminId: _.mongify(iAdminId),
          eStatus: { $ne: 'd' }
        }

        updateQuery = {
          sUrl
        }

        update = await kycs.findOneAndUpdate(query, updateQuery)

        if (update) return _.resolve('updateSuccess', null, 'panPicture', context)
        return _.throwError('notFound', context, 'kycDetails')
      case 'apn':
        query = {
          iAdminId: _.mongify(_id),
          eStatus: { $ne: 'd' }
        }

        updateQuery = {
          sUrl
        }

        update = await kycs.findOneAndUpdate(query, updateQuery)
        if (update) return _.resolve('updateSuccess', null, 'panPicture', context)
        return _.throwError('notFound', context, 'subAdminKyc')
      default:
        _.throwError('invalid', context, 'pictureType')
        break
    }
  } catch (error) {
    return error
  }
}

controllers.getDisplayAuthor = async (parent, { input }, context) => {
  try {
    let { nOrder, sSortBy } = input
    const { nLimit, nSkip, sSearch } = getPaginationValues(input, context)

    if (!nOrder) nOrder = -1
    if (sSortBy && !['dCreated'].includes(sSortBy)) _.throwError('invalid', context, 'sort')
    if (!sSortBy) sSortBy = 'dCreated'

    const sort = {}
    sort[sSortBy] = nOrder

    let artilceType
    if (input.eType === 'a') artilceType = 'CREATE_ARTICLE'
    if (input.eType === 'fa') artilceType = 'FANTASY_CREATE_ARTICLE'
    if (input.eType === 'lbc') artilceType = 'MANAGE_LIVEEVENTCONTENT'

    const [data] = await adminroles.aggregate([
      {
        $match: {}
      },
      {
        $lookup: {
          from: 'admins',
          localField: 'iAdminId',
          foreignField: '_id',
          as: 'admin'
        }
      },
      {
        $unwind: {
          path: '$admin'
        }
      },
      {
        $match: {
          'admin.eType': { $ne: 'su' }
        }
      },
      {
        $lookup: {
          from: 'permissions',
          localField: 'aPermissions.iPermissionId',
          foreignField: '_id',
          as: 'permission'
        }
      },
      {
        $match: {
          permission: {
            $elemMatch: {
              eKey: {
                $all: [artilceType]
              }
            }
          }
        }
      },
      {
        $match: {
          $or: [{ 'admin.sFName': { $regex: new RegExp('^.*' + sSearch + '.*', 'i') } }]
        }
      },
      {
        $project: {
          sFName: '$admin.sFName',
          sUName: '$admin.sUName',
          sUrl: '$admin.sUrl',
          dCreated: '$admin.dCreated',
          dUpdated: '$admin.dUpdated',
          eType: '$admin.eType',
          _id: '$admin._id'
        }
      },
      {
        $facet: {
          nTotal: [{ $count: 'total' }],
          aResults: [
            { $sort: sort },
            { $skip: parseInt(nSkip) },
            { $limit: parseInt(nLimit) }
          ]
        }
      }
    ])

    return data?.aResults?.length ? { aResults: data?.aResults, nTotal: data?.nTotal[0]?.total } : { aResults: [], nTotal: 0 }
  } catch (error) {
    return error
  }
}

controllers.generateTokenFront = async (parent, { input }, context) => {
  try {
    const { eType } = input || {}
    if (!eType) _.throwError('requiredField', context)

    const sToken = _.encodeToken({ eType }, '15m')

    return _.resolve('tokenGenerated', { oData: { sToken } }, null, context)
  } catch (error) {
    return error
  }
}

controllers.subAdminSubscription = async (parent, { input }, context) => {
  try {
    const { _id } = input
    const subAdmin = await admins.findOne({ _id: _.mongify(_id) })
    return subAdmin
  } catch (error) {
    return error
  }
}

module.exports = controllers
