const { hashPassword } = require('../helper/utilities.services')

const Employees = [
  {
    sName: 'Doli Vadiya',
    sEmpId: 1162,
    sMobNum: '8401607270',
    eGrade: 'A', // client grade
    eStatus: 'Y',
    sPassword: 'SuperAdminD@123',
    sEmail: 'doli@yudiz.com',
    iJobProfileId: 'HRMANAGER',
    iDepartmentId: 'HR',
    nExperience: 10,
    nAvailabilityHours: 8,
    eAvailabilityStatus: 'Available',
    aRole: ['SUPERADMIN'],
    eEmpType: 'E',
    eDevType: 'Dedicated',
    sReview: '',
    nPerhoursRate: 0,
    nPaid: 10,
    iBranchId: 'BSQUARE'
  },
  {
    sName: 'Leet Hudka',
    sEmpId: 1468,
    sMobNum: '8866220031',
    eGrade: 'A', // client grade
    eStatus: 'Y',
    sPassword: 'SuperAdminL@123',
    sEmail: 'leet.h@yudiz.in',
    iJobProfileId: 'HRMANAGER',
    iDepartmentId: 'HR',
    nExperience: 10,
    nAvailabilityHours: 8,
    eAvailabilityStatus: 'Available',
    aRole: ['SUPERADMIN'],
    eEmpType: 'E',
    eDevType: 'Dedicated',
    sReview: '',
    nPerhoursRate: 0,
    nPaid: 10,
    iBranchId: 'BSQUARE'
  }
]

class EmployeeSeeder {
  constructor() {
    this.EmployeeModel = require('../models_routes_service/Employee/model')
    this.JobProfileModel = require('../models_routes_service/JobProfile/model')
    this.DepartmentModel = require('../models_routes_service/Department/model')
    this.RoleModel = require('../models_routes_service/Role/model')
    this.PermissionModel = require('../models_routes_service/Permission/model')
    this.CurrencyModel = require('../models_routes_service/Currency/model')
    this.EmployeeCurrencyModel = require('../models_routes_service/Employee/employeeCurrency.model')
    this.OrganizationBranchModel = require('../models_routes_service/OrganizationBranch/model')

    this.Employees = Employees
    this.Name = 'EmployeeSeeder'
  }

  async seedDb() {
    try {
      await this.EmployeeModel.deleteMany({})
      //   await this.ClientModel.insertMany(Clients)

      for (const employee of this.Employees) {
        // check if iJobProfileId is present in JobProfileModel

        const jobProfile = await this.JobProfileModel.findOne({ sKey: employee.iJobProfileId, eStatus: 'Y' })
        if (!jobProfile) {
          throw new Error('JobProfile not found')
        }
        const department = await this.DepartmentModel.findOne({ sKey: employee.iDepartmentId, eStatus: 'Y' })
        if (!department) {
          throw new Error('Department not found')
        }

        const organizationBrach = await this.OrganizationBranchModel.findOne({ sKey: employee.iBranchId, eStatus: 'Y' })

        if (!organizationBrach) {
          throw new Error('OrganizationBranch not found')
        }

        const role = []
        const permission = []
        for (const r of employee.aRole) {
          const roleExist = await this.RoleModel.findOne({ sKey: r, eStatus: 'Y' })
          if (!roleExist) {
            throw new Error('Role not found')
          }
          role.push({
            iRoleId: roleExist._id,
            sName: roleExist.sName,
            sKey: roleExist.sKey,
            sBackGroundColor: roleExist.sBackGroundColor,
            sTextColor: roleExist.sTextColor
          })
          for (const p of roleExist.aPermissions) {
            const permissionExit = await this.PermissionModel.findOne({ _id: p, eStatus: 'Y' }).lean()
            if (!permissionExit) {
              throw new Error('Permission not found')
            }
            permission.push({
              sKey: permissionExit.sKey,
              aRoleId: [roleExist._id]
            })
          }
        }

        if (!role.length) throw new Error('Role should be atleast one')
        if (!permission.length) throw new Error('Permission should be atleast one')
        if (!employee.sPassword) throw new Error('Password should be atleast one')
        const password = hashPassword(employee.sPassword)

        const data = await this.EmployeeModel.create({
          sName: employee.sName,
          sEmpId: employee.sEmpId,
          sMobNum: employee.sMobNum,
          eGrade: employee.eGrade,
          eStatus: employee.eStatus,
          sPassword: password,
          sEmail: employee.sEmail,
          iJobProfileId: jobProfile._id,
          iDepartmentId: department._id,
          nExperience: employee.nExperience,
          nAvailabilityHours: employee.nAvailabilityHours,
          eAvailabilityStatus: employee.eAvailabilityStatus,
          aRole: role,
          aTotalPermissions: permission,
          eEmpType: employee.eEmpType,
          eDevType: employee.eDevType,
          sReview: employee.sReview,
          nPerhoursRate: employee.nPerhoursRate,
          nPaid: employee.nPaid,
          iBranchId: organizationBrach._id
        })

        const currencyExist = await this.CurrencyModel.find({ eStatus: 'Y' }).lean()

        if (currencyExist.length > 0) {
          await Promise.all(currencyExist.map(async (currency) => {
            return this.EmployeeCurrencyModel.create({
              iEmployeeId: data._id,
              iCurrencyId: currency._id,
              nCost: (Number(parseFloat((data?.nPaid || 10) * currency.nUSDCompare))).toFixed(2),
              eStatus: 'Y',
              iCreatedBy: data._id,
              iLastUpdateBy: data._id
            })
          })
          )
        }
      }

      // find total Employee

      const totalEmployee = await this.EmployeeModel.find({ eStatus: 'Y' }).lean()

      for (const employee of totalEmployee) {
        // jobProfile count update

        await this.JobProfileModel.updateOne({ _id: employee.iJobProfileId }, { $inc: { nTotal: 1 } })

        await this.DepartmentModel.updateOne({ _id: employee.iDepartmentId }, { $inc: { nTotal: 1 } })

        await this.OrganizationBranchModel.updateOne({ _id: employee.iBranchId }, { $inc: { nCurrentEmployee: 1 } })
      }
    } catch (error) {
      console.log(error)
      console.log('Client seeding failed')
    } finally {
      console.log('Client seeding operation done')
      // process.exit()
    }
  }
}

module.exports = new EmployeeSeeder()
