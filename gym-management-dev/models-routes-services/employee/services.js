// @ts-check
const EmployeeModel = require('./model')
const OrganizationModel = require('../organization/model')
const { status, jsonStatus, messages } = require('../../helper/api.response')
const { catchError, getPaginationValues } = require('../../helper/utilities.services')
const { default: mongoose } = require('mongoose')
const { addLog } = require('../operationLog/service')
const { operationName, operationCode } = require('../../data')

class Employee {
  async add (req, res) {
    try {
      const { sEmail, sMobile, eUserType, sName, nAge, eGender, sAddress, dBirthDate, dAnniversaryDate, aBranchId } = req?.body
      const isUserExists = await EmployeeModel.findOne({ $or: [{ sMobile }, { sEmail }], eStatus: { $ne: 'D' } }, { sMobile: 1, sEmail: 1, _id: 0 }).lean()
      if (isUserExists) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].employee) })
      if (aBranchId?.length) {
        const isBranchExists = await OrganizationModel.find({ _id: aBranchId?.map((id) => new mongoose.Types.ObjectId(id)), eStatus: { $ne: 'D' } }, { _id: 1 }).lean()
        if (isBranchExists.length !== [...new Set(aBranchId)]?.length) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].branch) })
      }
      let insertBody
      if (eUserType === 'S') {
        insertBody = { sEmail, sMobile, eUserType, sName, nAge, eGender, sAddress, dBirthDate, dAnniversaryDate, aBranchId: [...new Set(aBranchId)], iCreatedBy: req?.admin?._id }
        await EmployeeModel.create(insertBody)
      } else if (eUserType === 'T') {
        insertBody = { ...req.body, aBranchId: [...new Set(aBranchId)], iCreatedBy: req?.admin?._id }
        await EmployeeModel.create(insertBody)
      } else {
        return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].usertype) })
      }
      await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, ...insertBody }, sOperationName: operationName?.EMPLOYEE_ADD, sOperationType: operationCode?.CREATE })
      return res.status(status.Create).json({ status: jsonStatus.Create, message: messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].employee) })
    } catch (error) {
      catchError('Employee.Add', error, req, res)
    }
  }

  async get (req, res) {
    try {
      const employee = await EmployeeModel.findOne({ _id: req.params.id, eStatus: { $ne: 'D' } }, { __v: 0 }).populate({ path: 'aBranchId', select: ['sName'] }).lean()
      if (!employee) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].employee) })
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].employee), employee })
    } catch (error) {
      catchError('Employee.get', error, req, res)
    }
  }

  async update (req, res) {
    try {
      const { sEmail, sMobile, eUserType, sName, nAge, eGender, sAddress, dBirthDate, dAnniversaryDate, aBranchId } = req?.body
      const employee = await EmployeeModel.findOne({ _id: req.params.id, eStatus: { $ne: 'D' } }).lean()
      if (!employee) return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].employee) })
      if (aBranchId) {
        const isBranchExists = await OrganizationModel.find({ _id: aBranchId?.map((id) => new mongoose.Types.ObjectId(id)), eStatus: { $ne: 'D' } }, { _id: 1 }).lean()
        if (isBranchExists?.length !== [...new Set(aBranchId)]?.length) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].branch) })
      }
      if (req.body.sEmail || req.body.sMobile) {
        const query = []
        if (req.body.sEmail) query.push({ sEmail: req.body.sEmail })
        if (req.body.sMobile) query.push({ sMobile: req.body.sMobile })

        const isUserExists = await EmployeeModel.find({ _id: { $ne: req.params.id }, eStatus: { $ne: 'D' }, $or: query }, { sEmail: 1, sMobile: 1 }).lean()

        if (isUserExists.find(e => e.sEmail === req.body.sEmail)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].email) })
        if (isUserExists.find(e => e.sMobile === req.body.sMobile)) return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].mobile) })
      }
      let updateResponse
      let updateBody
      if (eUserType === 'S') {
        updateBody = { sEmail, sMobile, eUserType, sName, nAge, eGender, sAddress, dBirthDate, dAnniversaryDate, aBranchId: [...new Set(aBranchId)] }
        updateResponse = await EmployeeModel.updateOne({ _id: req.params.id }, updateBody, { runValidators: true })
      } else if (eUserType === 'T') {
        updateBody = { ...req.body, aBranchId: [...new Set(aBranchId)] }
        updateResponse = await EmployeeModel.updateOne({ _id: req.params.id }, updateBody, { runValidators: true })
      } else {
        return res.status(status.BadRequest).json({ status: jsonStatus.BadRequest, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].usertype) })
      }
      if (updateResponse?.modifiedCount) return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].employee) })
      await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, ...updateBody, _id: req.params.id }, sOperationName: operationName?.EMPLOYEE_UPDATE, sOperationType: operationCode?.UPDATE })
      return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].employee) })
    } catch (error) {
      catchError('Employee.update', error, req, res)
    }
  }

  async delete (req, res) {
    try {
      const employee = await EmployeeModel.updateOne({ _id: req.params.id, eStatus: { $ne: 'D' } }, { eStatus: 'D' }, { runValidators: true })
      if (employee.modifiedCount) return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].del_success.replace('##', messages[req.userLanguage].employee) })
      await addLog({ iOperationBy: req?.admin?._id, oOperationBody: { ip: req?.userIP, _id: req.params.id }, sOperationName: operationName?.EMPLOYEE_DELETE, sOperationType: operationCode?.DELETE })
      return res.status(status.NotFound).json({ status: jsonStatus.NotFound, message: messages[req.userLanguage].not_found.replace('##', messages[req.userLanguage].employee) })
    } catch (error) {
      catchError('Employee.delete', error, req, res)
    }
  }

  async list (req, res) {
    try {
      const { page = 0, limit = 10, sorting, search = '' } = getPaginationValues(req.query)
      const firstStage = { eStatus: { $eq: 'Y' } }
      if (req?.query?.aBranchId) {
        firstStage.aBranchId = {
          $in: Array.isArray(req?.query?.aBranchId)
            ? req?.query?.aBranchId?.map((id) => new mongoose.Types.ObjectId(id))
            : [new mongoose.Types.ObjectId(req?.query?.aBranchId)]
        }
      }
      if (req.query?.eUserType)firstStage.eUserType = req.query?.eUserType
      if (search?.length) {
        firstStage.$or = [
          { sName: { $regex: new RegExp(`^.*${search}.*`, 'i') } },
          { sEmail: { $regex: new RegExp(`^.*${search}.*`, 'i') } },
          { sMobile: { $regex: new RegExp(`^.*${search}.*`, 'i') } }
        ]
      }
      const queryStage = [
        {
          $match: firstStage
        },
        {
          $lookup: {
            from: 'organizations',
            localField: 'aBranchId',
            foreignField: '_id',
            as: 'aBranchDetails',
            pipeline: [
              {
                $match: {
                  eStatus: { $ne: 'D' }
                }
              }
            ]
          }
        }
      ]
      const projectStage = {
        nExpertLevel: 1,
        sExperience: 1,
        aBranchId: 1,
        eUserType: 1,
        sMobile: 1,
        nAge: 1,
        eGender: 1,
        sAddress: 1,
        eType: 1,
        nCharges: 1,
        nCommission: 1,
        dBirthDate: 1,
        dAnniversaryDate: 1,
        dCreatedDate: 1,
        'aBranchDetails._id': 1,
        'aBranchDetails.sName': 1,
        sName: 1,
        sEmail: 1
      }
      const employeeList = await EmployeeModel.aggregate([
        {
          $facet: {
            aEmployeeList: [
              ...queryStage,
              {
                $project: projectStage
              },
              { $sort: sorting },
              { $skip: page },
              { $limit: limit }
            ],
            total: [
              ...queryStage,
              { $count: 'total' }
            ]
          }
        }
      ])
      const data = { aEmployeeList: employeeList[0].aEmployeeList, count: employeeList[0].total[0]?.total || 0 }
      return res.status(status.OK).json({ status: jsonStatus.OK, message: messages[req.userLanguage].fetched.replace('##', messages[req.userLanguage].employee), data })
    } catch (error) {
      catchError('Employee.list', error, req, res)
    }
  }
}

module.exports = new Employee()
