// @ts-check
const { catchError, responseMessage } = require('../../../helpers/utilityServices')
const professionModel = require('../../admin/profession/model')
const userModel = require('../model')
const userProfessionModel = require('./model')
const cityModel = require('../../admin/city/model')
const { message } = require('../../../responses')
const responseStatus = require('../../../responses/status')
const { default: mongoose } = require('mongoose')
const config = require('../../../config')
const cachegoose = require('recachegoose')
const driver = require('../../../database/neo4j_driver')

const professionController = {}

professionController.addProfession = async (req, res) => {
  const session = driver.session()
  try {
    const iUserId = req?.iCurrentUserId
    const cacheKey = `user:${iUserId}:profession`
    const { iProfessionId, eServiceType, aCityIds } = req?.body || {}
    const [isUserExists, isProfessionExists] = await Promise.all([
      userModel.findOne({ _id: iUserId, eStatus: { $ne: 'D' } }).lean(),
      professionModel.findOne({ _id: iProfessionId, eStatus: { $ne: 'D' } }).lean()
    ])
    if (!isUserExists) return responseMessage(req, res, 'NotFound', 'NotFound', 'User')
    if (!isProfessionExists) return responseMessage(req, res, 'NotFound', 'NotFound', 'Profession')
    if (eServiceType === 'G')req.body.aCityIds = []
    else {
      const nDoc = await cityModel.countDocuments({ _id: aCityIds, eStatus: { $ne: 'D' } }).lean()
      if (nDoc !== aCityIds?.length) {
        return res.status(responseStatus?.NotFound)
          .json({ status: responseStatus?.NotFound, message: message?.[req.userLanguage]?.NotFound.replace('##', message?.[req.userLanguage].City) })
      }
    }
    req.body._id = new mongoose.Types.ObjectId()
    const userProfessionInfo = await userProfessionModel.create({ ...req?.body, iUserId })
    const graphQueryParams = {
      id: iProfessionId,
      iUserId,
      userProfessionId: userProfessionInfo?._id?.toString()
    }
    await session.run('match (p:Profession {id:$id}),(u:User {id:$iUserId}) merge (u)-[:WORKING_AS {id:$userProfessionId}]-(p)', graphQueryParams)
    cachegoose.clearCache(cacheKey)
    return responseMessage(req, res, 'Success', 'AddedSuccessfully', 'UserProfession')
  } catch (error) {
    return catchError(req, res)
  } finally {
    await session.close()
  }
}

professionController.updateProfession = async (req, res) => {
  try {
    const iUserId = req?.iCurrentUserId
    const cacheKey = `user:${req?.iCurrentUserId.toString()}:profession`
    const iId = req?.params?.id
    const { iProfessionId, eServiceType, aCityIds } = req?.body || {}
    if (eServiceType === 'G')req.body.aCityIds = []
    else {
      const nDoc = await cityModel.countDocuments({ _id: aCityIds, eStatus: { $ne: 'D' } }).lean()
      if (nDoc !== aCityIds?.length) {
        return res.status(responseStatus?.NotFound)
          .json({ status: responseStatus?.NotFound, message: message?.[req.userLanguage]?.NotFound.replace('##', message?.[req.userLanguage].City) })
      }
    }
    const [isUserExists, isProfessionExists] = await Promise.all([
      userModel.findOne({ _id: iUserId, eStatus: { $ne: 'D' } }).lean(),
      professionModel.findOne({ _id: iProfessionId, eStatus: { $ne: 'D' } }).lean()
    ])
    if (!isUserExists) return responseMessage(req, res, 'NotFound', 'NotFound', 'User')
    if (!isProfessionExists) return responseMessage(req, res, 'NotFound', 'NotFound', 'Profession')
    const updateResponse = await userProfessionModel.updateOne({ _id: iId }, req?.body)
    if (!updateResponse?.modifiedCount) return responseMessage(req, res, 'NotFound', 'NotFound', 'UserProfession')
    cachegoose.clearCache(cacheKey)
    return responseMessage(req, res, 'Success', 'UpdatedSuccessfully', 'UserProfession')
  } catch (error) {
    return catchError(req, res)
  }
}

professionController.deleteProfession = async (req, res) => {
  const session = driver.session()
  try {
    const iUserId = req?.iCurrentUserId.toString()
    const cacheKey = `user:${iUserId}:profession`
    const iId = req?.params?.id
    const updateResponse = await userProfessionModel.updateOne({ _id: iId, eStatus: { $ne: 'D' } }, { eStatus: 'D' })
    if (!updateResponse?.modifiedCount) return responseMessage(req, res, 'NotFound', 'NotFound', 'UserProfession')
    await session.run('match (u:User {id:$iUserId})-[r:WORKING_AS {id:$id}]-(p:Profession) detach delete r', { id: iId, iUserId })
    cachegoose.clearCache(cacheKey)
    return responseMessage(req, res, 'Success', 'DeletedSuccessfully', 'UserProfession')
  } catch (error) {
    return catchError(req, res)
  } finally {
    await session.close()
  }
}

professionController.listProfession = async (req, res) => {
  try {
    const cacheKey = `user:${req?.iCurrentUserId.toString()}:profession`
    const oProjectionOptions = { iProfessionId: 1, sMobile: 1, sSecondaryMobile: 1, sEmail: 1, sWebsiteURL: 1, eServiceType: 1 }
    const oUserProfessionList = await userProfessionModel.find({ iUserId: req?.iCurrentUserId, eStatus: { $ne: 'D' } }, oProjectionOptions).populate({ path: 'oProfession', select: 'sName' }).lean().cache(config?.CACHE_1_DAY, cacheKey)
    return responseMessage(req, res, 'Success', 'FetchedSuccessFully', 'UserProfession', { data: oUserProfessionList })
  } catch (error) {
    return catchError(req, res)
  }
}

module.exports = professionController
