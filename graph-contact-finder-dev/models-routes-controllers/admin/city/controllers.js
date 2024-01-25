// @ts-check
const mongoose = require('mongoose')
const { catchError, responseMessage, getPaginationValues, getIp, adminLog } = require('../../../helpers/utilityServices')
const CityModel = require('./model')
const driver = require('../../../database/neo4j_driver')
const { adminLogOperationName } = require('../../../enums')

const CityController = {}

CityController.list = async (req, res) => {
  try {
    const { nPage, nLimit, oSorting, sSearch } = getPaginationValues(req.query)
    const queryStage = { eStatus: { $ne: 'D' } }
    if (sSearch?.length) queryStage.sName = { $regex: new RegExp('^.*' + sSearch + '.*', 'i') }
    const [count, aCityList] = await Promise.all([CityModel.countDocuments(queryStage), CityModel.find(queryStage, { sName: 1, aDesignations: 1 })
      .sort(oSorting)
      .skip((nPage - 1) * nLimit)
      .limit(nLimit)
      .lean()])
    return responseMessage(req, res, 'Success', 'FetchedSuccessFully', 'City', { count, aCityList })
  } catch (error) {
    return catchError(req, res)
  }
}

CityController.add = async (req, res) => {
  const session = driver.session()
  try {
    const { sName } = req.body
    const isCityExists = await CityModel.findOne({ sName }).lean()
    if (isCityExists) return responseMessage(req, res, 'ResourceExist', 'AlreadyExist', 'City')
    const createResponse = await CityModel.create(req?.body)
    const graphInsertQueryParam = { id: createResponse?._id.toString(), sName, eStatus: 'Y' }
    const logData = { oOldFields: {}, oNewFields: req?.body, sIpAddress: getIp(req), iAdminId: new mongoose.Types.ObjectId(req.admin._id), eOperationType: 'C', sOperationName: adminLogOperationName?.CC }
    await adminLog(req, res, logData)
    await session.run('merge(:City{id:$id , sName:$sName,eStatus:$eStatus})', graphInsertQueryParam)
    return responseMessage(req, res, 'Success', 'CreatedSuccessfully', 'City')
  } catch (error) {
    return catchError(req, res)
  } finally {
    await session.close()
  }
}

CityController.delete = async (req, res) => {
  const session = driver.session()
  try {
    const field = await CityModel.updateOne({ _id: req.params.id, eStatus: { $ne: 'D' } }, { eStatus: 'D' })
    const graphInsertQueryParam = {
      id: req.params.id,
      eStatus: 'D'
    }
    if (!field?.modifiedCount) return responseMessage(req, res, 'NotFound', 'NotFound', 'City')
    const logData = { oOldFields: { _id: new mongoose.Types.ObjectId(req.params.id) }, oNewFields: {}, sIpAddress: getIp(req), iAdminId: new mongoose.Types.ObjectId(req.admin._id), eOperationType: 'D', sOperationName: adminLogOperationName?.CD }
    await session.run('match(c:City{id:$id}) set c.eStatus=$eStatus', graphInsertQueryParam)
    await adminLog(req, res, logData)
    return responseMessage(req, res, 'Success', 'DeletedSuccessfully', 'City')
  } catch (error) {
    return catchError(req, res)
  } finally {
    await session.close()
  }
}

CityController.update = async (req, res) => {
  const session = driver.session()
  try {
    const { sName } = req.body
    const graphInsertQueryParam = {
      id: req.params.id,
      sName
    }
    const oOldFields = await CityModel.findById(graphInsertQueryParam?.id)
    if (!oOldFields) return responseMessage(req, res, 'NotFound', 'NotFound', 'Field')

    const updatedField = await CityModel.findByIdAndUpdate(graphInsertQueryParam?.id, { sName }, { new: true }).lean()
    await session.run('match(c:City{id:$id}) set c.sName=$sName', graphInsertQueryParam)
    const logData = { oOldFields, oNewFields: updatedField, sIpAddress: getIp(req), iAdminId: new mongoose.Types.ObjectId(req.admin._id), eOperationType: 'U', sOperationName: adminLogOperationName?.CU }
    await adminLog(req, res, logData)
    return responseMessage(req, res, 'Success', 'UpdatedSuccessfully', 'City')
  } catch (error) {
    return catchError(req, res)
  } finally {
    await session.close()
  }
}

module.exports = CityController
