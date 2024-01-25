// @ts-check
const mongoose = require('mongoose')
const { catchError, responseMessage, getPaginationValues, getIp, adminLog } = require('../../../helpers/utilityServices')
const ProfessionModel = require('./model')
const driver = require('../../../database/neo4j_driver')
const { adminLogOperationName } = require('../../../enums')
const { findDoc } = require('../../../database/elasticsearch')

const ProfessionController = {}

ProfessionController.list = async (req, res) => {
  try {
    const { iProfessionId } = req?.query
    const { nPage, nLimit, oSorting, sSearch } = getPaginationValues(req.query)
    const queryStage = { eStatus: { $ne: 'D' } }
    if (iProfessionId) queryStage.iProfessionId = new mongoose.Types.ObjectId(iProfessionId)
    if (sSearch?.length) queryStage.sName = { $regex: new RegExp('^.*' + sSearch + '.*', 'i') }
    const [count, aProfessionList] = await Promise.all([ProfessionModel.countDocuments(queryStage), ProfessionModel.find(queryStage, { sName: 1, aDesignations: 1 })
      .sort(oSorting)
      .skip((nPage - 1) * nLimit)
      .limit(nLimit)
      .lean()])
    return responseMessage(req, res, 'Success', 'FetchedSuccessFully', 'Profession', { count, aProfessionList })
  } catch (error) {
    return catchError(req, res)
  }
}

ProfessionController.search = async (req, res) => {
  try {
    const data = await findDoc({ search: req?.query?.sSearch, totalResult: req?.query?.nLimit })
    return responseMessage(req, res, 'Success', 'FetchedSuccessFully', 'Profession', data)
  } catch (error) {
    return catchError(req, res)
  }
}

ProfessionController.add = async (req, res) => {
  const session = driver.session()
  try {
    const { sName } = req.body
    const isProfessionExists = await ProfessionModel.findOne({ sName, eStatus: { $ne: 'D' } }).lean()
    if (isProfessionExists) return responseMessage(req, res, 'ResourceExist', 'AlreadyExist', 'Profession')
    const createResponse = await ProfessionModel.create(req?.body)
    const graphQueryParams = {
      id: createResponse?._id.toString(),
      sName,
      eStatus: 'Y'
    }
    await session.run('merge(:Profession{id:$id})', graphQueryParams)
    const logData = { oOldFields: {}, oNewFields: req.body, sIpAddress: getIp(req), iAdminId: new mongoose.Types.ObjectId(req?.admin?._id), eOperationType: 'C', sOperationName: adminLogOperationName?.PRC }
    await adminLog(req, res, logData)
    return responseMessage(req, res, 'Success', 'CreatedSuccessfully', 'Profession')
  } catch (error) {
    return catchError(req, res)
  } finally {
    await session.close()
  }
}

ProfessionController.delete = async (req, res) => {
  const session = driver.session()
  try {
    const graphQueryParams = {
      id: req.params.id,
      eStatus: 'D'
    }
    const field = await ProfessionModel.updateOne({ _id: graphQueryParams?.id, eStatus: { $ne: 'D' } }, { eStatus: graphQueryParams?.eStatus })
    if (!field?.modifiedCount) return responseMessage(req, res, 'NotFound', 'NotFound', 'Profession')
    const logData = { oOldFields: {}, oNewFields: { _id: graphQueryParams?.id }, sIpAddress: getIp(req), iAdminId: new mongoose.Types.ObjectId(req?.admin?._id), eOperationType: 'C', sOperationName: adminLogOperationName?.PRD }
    await session.run('match(p:Profession{id:$id}) detach delete p', graphQueryParams)
    await adminLog(req, res, logData)
    return responseMessage(req, res, 'Success', 'DeletedSuccessfully', 'Profession')
  } catch (error) {
    return catchError(req, res)
  } finally {
    await session.close()
  }
}

ProfessionController.update = async (req, res) => {
  const session = driver.session()
  try {
    const { sName } = req.body
    const graphQueryParams = {
      sName,
      id: req.params.id
    }
    const oOldFields = await ProfessionModel.findById(req.params.id)
    if (!oOldFields) return responseMessage(req, res, 'NotFound', 'NotFound', 'Field')

    const updatedField = await ProfessionModel.findByIdAndUpdate(req.params.id, { sName }, { new: true }).lean()
    const logData = { oOldFields, oNewFields: updatedField, sIpAddress: getIp(req), iAdminId: new mongoose.Types.ObjectId(req.admin._id), eOperationType: 'U', sOperationName: adminLogOperationName?.PRU }
    await session.run('match(p:Profession{id:$id} set p.sName=$sName)', graphQueryParams)
    await adminLog(req, res, logData)
    return responseMessage(req, res, 'Success', 'UpdatedSuccessfully', 'Profession')
  } catch (error) {
    return catchError(req, res)
  } finally {
    await session.close()
  }
}

module.exports = ProfessionController
