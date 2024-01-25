/* eslint-disable indent */
/* eslint-disable no-unused-vars */
const CurrencyModel = require('./model')
const Logs = require('../Logs/model')
const EmployeeCurrencyModel = require('../Employee/employeeCurrency.model')
const EmployeeModel = require('../Employee/model')
const { status, messages } = require('../../helper/api.responses')
const { queuePush } = require('../../helper/redis')
const { catchError, projection, keygen, SuccessResponseSender, ErrorResponseSender, paginationValue, searchValidate, camelCase, searchValidateCurrency } = require('../../helper/utilities.services')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const ProjectModel = require('../Project/model')
const JobProfileModel = require('../JobProfile/model')
const DepartmentModel = require('../Department/model')
const config = require('../../config/config')

const { ResourceManagementDB } = require('../../database/mongoose')

async function notificationsender(req, params, sBody, isRecorded, isNotify, iLastUpdateBy, url) {
  try {
    const data = await CurrencyModel.findOne({ _id: params }).lean()

    const department = await DepartmentModel.find({
      eStatus: 'Y',
      bIsSystem: true,
      sKey: {
        $in: ['HR', 'ADMIN', 'BUSINESSANALYST', 'PRODUCTDEVELOPMENT', 'OPERATION', 'MANAGEMENT', 'MARKETING', 'SALES']
      }
    }, { _id: 1 }).lean()

    const jobProfile = await JobProfileModel.find({
      eStatus: 'Y',
      sPrefix: {
        $in: ['Superior', 'Head', 'Lead', 'Other', 'Manager']
      }
    }, { _id: 1 }).lean()

    const allEmployee = await EmployeeModel.find({
      eStatus: 'Y',
      $or: [
        { iDepartmentId: { $in: department.map((item) => item._id) } },
        { iJobProfileId: { $in: jobProfile.map((item) => item._id) } }
      ]
    }, {
      _id: 1,
      aJwtTokens: 1
    }).lean()

    const sPushToken = []
    const ids = []

    if (allEmployee.length > 0) {
      for (const employee of allEmployee) {
        if (ids.indexOf(employee._id) === -1) {
          ids.push(employee._id)
        }
        if (employee.aJwtTokens.length) {
          for (const pushtoken of employee.aJwtTokens) {
            if (pushtoken?.sPushToken && sPushToken.indexOf(pushtoken.sPushToken) === -1) {
              sPushToken.push(pushtoken.sPushToken)
            }
          }
        }
      }
    }

    const metadata = {
      iCurrencyId: data._id,
      sName: data.sName,
      iCreatedBy: iLastUpdateBy,
      sUrl: url,
      sType: 'currency',
      sLogo: data?.sLogo || 'Default/magenta_explorer-wallpaper-3840x2160.jpg',
      isRecorded: isRecorded === true ? 'Y' : 'N',
      isNotify: isNotify === true ? 'Y' : 'N'
    }

    const person = await EmployeeModel.findOne({ _id: iLastUpdateBy }, { sName: 1, sEmpId: 1 }).lean()

    const putData = {
      sPushToken,
      sTitle: 'Resource Management',
      sBody: `${data.sName}${sBody}by ${person.sName}(${person.sEmpId})`,
      sLogo: data?.sLogo || 'Default/magenta_explorer-wallpaper-3840x2160.jpg',
      sType: 'currency',
      sUrl: url,
      metadata,
      aSenderId: ids,
      isRecorded: isRecorded === true ? 'Y' : 'N',
      isNotify: isNotify === true ? 'Y' : 'N'
    }

    await queuePush('Project:Notification', putData)
  } catch (error) {
    console.log(error)
  }
}

class Currency {
  async addCurrency(req, res) {
    try {
      let { sName, sSymbol, nUSDCompare } = req.body
      // console.log(sName, sSymbol, nUSDCompare)
      sName = searchValidateCurrency(sName)
      sSymbol = searchValidateCurrency(sSymbol).toUpperCase()
      const currency = await CurrencyModel.findOne({ sName: camelCase(sName), sSymbol, eStatus: 'Y' }).lean()
      if (currency) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].currency))
      const data = await CurrencyModel.create({ sName: camelCase(sName), sSymbol, nUSDCompare: Number(req.body.nUSDCompare.toFixed(2)), iCreatedBy: req.employee?._id ? ObjectId('62a9c5afbe6064f125f3501f') : ObjectId('62a9c5afbe6064f125f3501f'), iLastUpdateBy: req.employee?._id ? ObjectId('62a9c5afbe6064f125f3501f') : ObjectId('62a9c5afbe6064f125f3501f') })

      // let take = `Logs${new Date().getFullYear()}`

      // take = ResourceManagementDB.model(take, Logs)
      const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Currency', sService: 'addCurrency', eAction: 'Create', oNewFields: data, oBody: req.body, oParams: req.params, oQuery: req.query, sDbName: `Logs${new Date().getFullYear()}` }
      await queuePush('logs', logs)
      // await take.create(logs)
      // console.log(data)
      // const putData = { ...data }

      await queuePush('Currency:Add', { nUSDCompare: data.nUSDCompare, iCreatedBy: data.iCreatedBy, iLastUpdateBy: data.iLastUpdateBy, _id: data._id, action: 'add' })

      // await addNewCurrencyToEveryEmployee(data)
      // await notificationsender(req, data._id, ' currency is create ', true, true, req.employee._id, `${config.urlPrefix}/dashboard`)

      return SuccessResponseSender(res, status.Create, messages[req.userLanguage].add_success.replace('##', messages[req.userLanguage].currency))
    } catch (error) {
      return catchError('Currency.addCurrency', error, req, res)
    }
  }

  async deleteCurrency(req, res) {
    try {
      const currency = await CurrencyModel.findById({ _id: req.params.id, eStatus: 'Y' }).lean()
      if (!currency) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].currency))

      const projectExist = await ProjectModel.findOne({ iCurrencyId: req.params.id, eStatus: 'Y' }).lean()
      if (projectExist) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].currency_used_in_project)

      const ProjectExistWithCurrency = await ProjectModel.findOne({ iCurrencyId: req.params.id, eStatus: 'Y' }).lean()
      if (ProjectExistWithCurrency) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].currency_used_in_project)
      if (currency && currency.eStatus === 'Y') {
        const data = await CurrencyModel.findByIdAndUpdate({ _id: req.params.id }, { eStatus: 'N', iLastUpdateBy: req.employee._id }, { runValidators: true, new: true })
        if (!data) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].currency))
        // let take = `Logs${new Date().getFullYear()}`
        // take = ResourceManagementDB.model(take, Logs)
        const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Currency', sService: 'deleteCurrency', eAction: 'Delete', oOldFields: currency, oNewFields: data, oBody: req.body, oParams: req.params, oQuery: req.query, sDbName: `Logs${new Date().getFullYear()}` }
        // await take.create(logs)
        await queuePush('logs', logs)
        await queuePush('Currency:Add', { iLastUpdateBy: data.iLastUpdateBy, _id: data._id, action: 'delete', sName: data.sName, sSymbol: data.sSymbol })
        // await deleteCurrencyToEveryEmployee(data)
        // await notificationsender(req, data._id, ' currency is delete ', true, true, req.employee._id, `${config.urlPrefix}/dashboard`)
        return SuccessResponseSender(res, status.Deleted, messages[req.userLanguage].delete_success.replace('##', messages[req.userLanguage].currency))
      }

      return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].currency))
    } catch (error) {
      console.log(error)
      return catchError('Currency.deleteCurrency', error, req, res)
    }
  }

  // async updateTechnologies(req, res) {
  //   try {
  //     const { sName } = req.body
  //     const technology = await TechnologyModel.findById({ _id: req.params.id }).lean()
  //     if (!technology) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].technology))
  //     if (technology && technology.eStatus === 'Y' && technology.sKey !== keygen(sName)) {
  //       const technologyKey = await TechnologyModel.findOne({ sKey: keygen(sName), eStatus: 'Y', _id: { $ne: req.params.id } }).lean()
  //       if (technologyKey) return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].technology))
  //       const data = await TechnologyModel.findByIdAndUpdate({ _id: req.params.id }, { sName, sKey: keygen(sName), iLastUpdateBy: req.employee._id }, { runValidators: true, new: true })
  //       if (!data) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].technology))
  //       const logs = { eActionBy: { eType: req.employee.eEmpType, iId: req.employee._id }, iId: data._id, eModule: 'Technology', sService: 'updateTechnology', eAction: 'Update', oOldFields: technology, oNewFields: data }
  //       await Logs.create(logs)
  //       // await notificationsender(req, data._id, ' technology is update ')
  //       return SuccessResponseSender(res, status.OK, messages[req.userLanguage].update_success.replace('##', messages[req.userLanguage].technology))
  //     }
  //     return ErrorResponseSender(res, status.ResourceExist, messages[req.userLanguage].already_exist.replace('##', messages[req.userLanguage].technology))
  //   } catch (error) {
  //     return catchError('Technology.updateTechnologies', error, req, res)
  //   }
  // }

  // async getTechnologies(req, res) {
  //   const showDetail = projection(['sName', 'iCreatedBy', 'eStatus'])
  //   try {
  //     const { page = 0, limit = 5 } = req.query
  //     if (limit === 'all') {
  //       const technologies = await TechnologyModel.find({ eStatus: 'Y' }, showDetail).lean()
  //       return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].technology), { technologies })
  //     }
  //     const [technologies, technologyCount] = await Promise.all([TechnologyModel.find({ eStatus: 'Y' }, showDetail).skip(Number(page)).limit(Number(limit)).lean(), TechnologyModel.countDocuments({ eStatus: 'Y' })])
  //     let isNext = true
  //     if (technologyCount <= (Number(page) + 1) * Number(limit)) isNext = false
  //     return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].technology), { technologies, count: technologyCount, isNext })
  //   } catch (error) {
  //     return catchError('Technology.getTechnologies', error, req, res)
  //   }
  // }

  async search(req, res) {
    try {
      let { sorting, search = '' } = paginationValue(req.query)

      search = searchValidate(search)
      const query = search && search.length
        ? {
          $or: [{ sSymbol: { $regex: new RegExp(search, 'i') } },
          { sName: { $regex: new RegExp(search, 'i') } }
          ],
          eStatus: 'Y'
        }
        : { eStatus: 'Y' }

      const [currency, total] = await Promise.all([CurrencyModel.find(query).sort(sorting).lean(), CurrencyModel.countDocuments({ ...query }).lean()])

      if (req.path === '/DownloadExcel') {
        return currency
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].technology), { currency, count: total })
      }
    } catch (error) {
      return catchError('Currency.search', error, req, res)
    }
  }

  async getCurrencies(req, res) {
    try {
      let { sorting, search = '', page, limit } = paginationValue(req.query)

      search = searchValidate(search)
      const query = search && search.length
        ? {
          $or: [{ sSymbol: { $regex: new RegExp(search, 'i') } },
          { sName: { $regex: new RegExp(search, 'i') } }
          ],
          eStatus: 'Y'
        }
        : { eStatus: 'Y' }

      let currency = []; let total = 0
      if (limit !== 'all') {
        [currency, total] = await Promise.all([CurrencyModel.find(query).sort(sorting).skip(Number(page)).limit(Number(limit)).lean(), CurrencyModel.countDocuments({ ...query }).lean()])
      } else {
        [currency, total] = await Promise.all([CurrencyModel.find(query).sort(sorting).lean(), CurrencyModel.countDocuments({ ...query }).lean()])
      }

      if (req.path === '/DownloadExcel') {
        return currency
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].technology), { currency, count: total })
      }
    } catch (error) {
      return catchError('Currency.search', error, req, res)
    }
  }

  async getCurrency(req, res) {
    try {
      const currency = await CurrencyModel.findById({ eStatus: 'Y', _id: req.params.id }).lean()
      if (!currency) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].currency))
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].currency), { currency })
    } catch (error) {
      catchError('Currency.getCurrency', error, req, res)
    }
  }
}

async function addNewCurrencyToEveryEmployee(data) {
  try {
    const start = performance.now()
    const employees = await EmployeeModel.find({ eStatus: 'Y' }).lean()
    // await Promise.all(employees.map(async (employee) => {
    //   return EmployeeCurrencyModel.create({
    //     iEmployeeId: employee._id,
    //     iCurrencyId: data._id,
    //     nCost: data.nUSDCompare,
    //     eStatus: 'Y',
    //     iCreatedBy: data.iCreatedBy,
    //     iLastUpdateBy: data.iCreatedBy
    //   })
    // }))

    // for (let i = 0; i < employees.length; i++) {
    //   // chunk of 1000
    //   const chunk = employees.slice(i, i + 1000)
    //   await Promise.all(chunk.map(async (employee) => {
    //     return EmployeeCurrencyModel.create({
    //       iEmployeeId: employee._id,
    //       iCurrencyId: data._id,
    //       nCost: data.nUSDCompare,
    //       eStatus: 'Y',
    //       iCreatedBy: data.iCreatedBy,
    //       iLastUpdateBy: data.iCreatedBy
    //     })
    //   }))
    // }

    const chunkSize = 1000
    const chunks = Math.ceil(employees.length / chunkSize)

    for (let i = 0; i < chunks; i++) {
      const start = i * chunkSize
      const end = (i + 1) * chunkSize
      const chunk = employees.slice(start, end)

      await Promise.all(chunk.map(async (employee) => {
        return EmployeeCurrencyModel.create({
          iEmployeeId: employee._id,
          iCurrencyId: data._id,
          nCost: (Number(parseFloat((employee?.nPaid || 10) * data.nUSDCompare))).toFixed(2),
          eStatus: 'Y',
          iCreatedBy: data.iCreatedBy,
          iLastUpdateBy: data.iCreatedBy
        })
      }))
    }

    const stop = performance.now()
    const inSeconds = (stop - start) / 1000
    const rounded = Number(inSeconds).toFixed(3)
    // console.log(`businessLogic: ${rounded}s`)
  } catch (error) {
    console.log(error)
  }
}

async function deleteCurrencyToEveryEmployee(data) {
  try {
    const start = performance.now()
    const employees = await EmployeeModel.find({ eStatus: 'Y' }).lean()
    // await Promise.all(employees.map(async (employee) => {
    //   return EmployeeCurrencyModel.create({
    //     iEmployeeId: employee._id,
    //     iCurrencyId: data._id,
    //     nCost: data.nUSDCompare,
    //     eStatus: 'Y',
    //     iCreatedBy: data.iCreatedBy,
    //     iLastUpdateBy: data.iCreatedBy
    //   })
    // }))

    // for (let i = 0; i < employees.length; i++) {
    //   // chunk of 1000
    //   const chunk = employees.slice(i, i + 1000)
    //   await Promise.all(chunk.map(async (employee) => {
    //     return EmployeeCurrencyModel.create({
    //       iEmployeeId: employee._id,
    //       iCurrencyId: data._id,
    //       nCost: data.nUSDCompare,
    //       eStatus: 'Y',
    //       iCreatedBy: data.iCreatedBy,
    //       iLastUpdateBy: data.iCreatedBy
    //     })
    //   }))
    // }

    const chunkSize = 1000
    const chunks = Math.ceil(employees.length / chunkSize)

    for (let i = 0; i < chunks; i++) {
      const start = i * chunkSize
      const end = (i + 1) * chunkSize
      const chunk = employees.slice(start, end)

      await Promise.all(chunk.map(async (employee) => {
        return EmployeeCurrencyModel.updateOne({
          iEmployeeId: employee._id,
          iCurrencyId: data._id,
          eStatus: 'Y'
        }, {
          eStatus: 'N',
          iLastUpdateBy: data.iLastUpdateBy
        })
      }))
    }

    const stop = performance.now()
    const inSeconds = (stop - start) / 1000
    const rounded = Number(inSeconds).toFixed(3)
    // console.log(`businessLogic: ${rounded}s`)
  } catch (error) {
    console.log(error)
  }
}

async function addNewEmployeesCurrency(data) {
  try {
    const currencyExist = await CurrencyModel.find({ eStatus: 'Y' }).lean()
    const EmployeeExist = await EmployeeModel.findOne({ eStatus: 'Y', _id: data.iEmployeeId }).lean()

    if (currencyExist.length > 0) {
      await Promise.all(currencyExist.map(async (currency) => {
        return EmployeeCurrencyModel.create({
          iEmployeeId: data.iEmployeeId,
          iCurrencyId: currency._id,
          nCost: (Number(parseFloat((EmployeeExist?.nPaid || 10) * currency.nUSDCompare))).toFixed(2),
          eStatus: 'Y',
          iCreatedBy: data.iCreatedBy,
          iLastUpdateBy: data.iCreatedBy
        })
      })
      )
    } else {
      // console.log('no currency exist')
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = new Currency()
