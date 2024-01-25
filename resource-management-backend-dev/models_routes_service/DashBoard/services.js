/* eslint-disable indent */
const { status, messages } = require('../../helper/api.responses')
const { SuccessResponseSender, catchError, isValidId, ErrorResponseSender, calculateYear } = require('../../helper/utilities.services')
const Projects = require('../Project/model')
const EmployeeModel = require('../Employee/model')
const ProjectwiseemployeeModel = require('../Project/projectwiseemployee.model')
// const DashboardProjectIndicatorModel = require('./dashboardProjectIndicator.model')
const DashboardCrIndicatorModel = require('./dashboardCrIndicator.model')
// const ChangeRequestModel = require('../ChangeRequest/model')
// const DashboardCrDepartmentModel = require('./dashboardCrDepartment.model')
const DepartmentModel = require('../Department/model')
// const DashboardProjectDepartmentModel = require('./dashboardProjectDepartment.model')

const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

class DashBoard {
  async getDetails(req, res) {
    try {
      const employee = await EmployeeModel.findOne({ _id: req.employee._id }, { eShowAllProjects: 1 }).lean()

      if (!employee) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].notFound.replace('##', 'Employee'))

      // console.log(req.employee._id, employee.eShowAllProjects)

      // const [totalProjects, newProjects, completedProjects, onHoldProjects, onPending] = await Promise.all([Projects.countDocuments({ eStatus: 'Y' }).lean(),
      // Projects.countDocuments({ eStatus: 'Y', eProjectStatus: { $nin: ['Pending', 'Completed'] }, dCreatedAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) } }).lean(),
      // Projects.countDocuments({ eStatus: 'Y', eProjectStatus: 'Completed' }).lean(),
      // Projects.countDocuments({ eStatus: 'Y', eProjectStatus: 'On Hold' }).lean(),
      // Projects.countDocuments({ eStatus: 'Y', eProjectStatus: 'Pending' }).lean()
      // ])

      // let [totalProjects, newProjects, completedProjects, onHoldProjects, onPending] = [0, 0, 0, 0, 0]

      // if (employee.eShowAllProjects === 'OWN') {
      //   // [totalProjects, newProjects, completedProjects, onHoldProjects, onPending]
      // } else {

      // }

      // const data = {
      //   totalProjects,
      //   newProjects,
      //   completedProjects,
      //   onHoldProjects,
      //   onPending
      // }

      // return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].details), data)

      if (employee.eShowAllProjects === 'ALL') {
        const [totalProjects, newProjects, completedProjects, onHoldProjects, onPending, inProgress] = await Promise.all([Projects.countDocuments({ eStatus: 'Y' }).lean(),
        Projects.countDocuments({ eStatus: 'Y', eProjectStatus: { $nin: ['Pending', 'Completed'] }, dContractStartDate: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) } }).lean(),
        Projects.countDocuments({ eStatus: 'Y', eProjectStatus: 'Completed' }).lean(),
        Projects.countDocuments({ eStatus: 'Y', eProjectStatus: 'On Hold' }).lean(),
        Projects.countDocuments({ eStatus: 'Y', eProjectStatus: 'Pending' }).lean(),
        Projects.countDocuments({ eStatus: 'Y', eProjectStatus: 'In Progress' }).lean()
        ])

        // const fixed project BAsed on contractStartDate and contractEndDate
        const FixedNewProject = await Projects.countDocuments({ eStatus: 'Y', eProjectStatus: { $nin: ['Pending', 'Completed'] }, dStartDate: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }, eProjectType: 'Fixed' }).lean()

        const totalProjectId = new Set()
        const totalProjectsFixed = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y' }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectType: 'Fixed' } }).lean()

        // console.log('totalProjectsFixed', totalProjectsFixed)

        if (totalProjectsFixed.length) {
          totalProjectsFixed.forEach(element => {
            if (element?.iProjectId) totalProjectId.add(element.iProjectId._id.toString())
          })
        }

        const othersProjectFixed = await Projects.find({
          eStatus: 'Y',
          eProjectType: 'Fixed',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        })

        // console.log('othersProjectFixed', othersProjectFixed)

        if (othersProjectFixed.length) {
          othersProjectFixed.forEach(element => {
            if (element?._id) totalProjectId.add(element._id.toString())
          })
        }

        const totalProjectsDedicated = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y' }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectType: 'Dedicated' } }).lean()

        // console.log('totalProjectsDedicated', totalProjectsDedicated)

        if (totalProjectsDedicated.length) {
          totalProjectsDedicated.forEach(element => {
            if (element?.iProjectId) totalProjectId.add(element.iProjectId._id.toString())
          })
        }

        const othersProjectDedicated = await Projects.find({
          eStatus: 'Y',
          eProjectType: 'Dedicated',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        })

        // console.log('othersProjectDedicated', othersProjectDedicated)

        if (othersProjectDedicated.length) {
          othersProjectDedicated.forEach(element => {
            if (element?._id) totalProjectId.add(element._id.toString())
          })
        }

        // console.log(totalProjectsFixed, othersProjectFixed, totalProjectsDedicated, othersProjectDedicated)

        // const totalProjectId = [...new Set([...totalProjectsFixed.map(a => a.iProjectId.toString()), ...othersProjectFixed.map(a => a._id.toString()), ...totalProjectsDedicated.map(a => a.iProjectId.toString()), ...othersProjectDedicated.map(a => a._id.toString())])].length()

        // new projects

        const newProjectId = new Set()

        const newProjectFixed = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y', dCreatedAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) } }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectType: 'Fixed' } }).lean()

        if (newProjectFixed.length) {
          newProjectFixed.forEach(element => {
            if (element?.iProjectId) newProjectId.add(element.iProjectId._id.toString())
          })
        }

        const othersNewProjectFixed = await Projects.find({
          eStatus: 'Y',
          eProjectStatus: { $nin: ['Pending', 'Completed'] },
          dCreatedAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) },
          eProjectType: 'Fixed',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        }).lean()

        if (othersNewProjectFixed.length) {
          othersNewProjectFixed.forEach(element => {
            if (element?._id) newProjectId.add(element._id.toString())
          })
        }

        const newProjectDedicated = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y', dCreatedAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) } }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectType: 'Dedicated' } }).lean()

        if (newProjectDedicated.length) {
          newProjectDedicated.forEach(element => {
            if (element?.iProjectId) newProjectId.add(element.iProjectId._id.toString())
          })
        }

        const othersNewProjectDedicated = await Projects.find({
          eStatus: 'Y',
          eProjectStatus: { $nin: ['Pending', 'Completed'] },
          dContractStartDate: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) },
          eProjectType: 'Dedicated',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        })

        if (othersNewProjectDedicated.length) {
          othersNewProjectDedicated.forEach(element => {
            if (element?._id) newProjectId.add(element._id.toString())
          })
        }

        // const newProjectId = [...new Set([...newProjectFixed.map(a => a.iProjectId.toString()), ...othersNewProjectFixed.map(a => a._id.toString()), ...newProjectDedicated.map(a => a.iProjectId.toString()), ...othersNewProjectDedicated.map(a => a._id.toString())])].length()

        // completed projects

        const completedProjectId = new Set()

        // const completedProjectFixed = await Projects.find({ eStatus: 'Y', eProjectStatus: 'Completed', eProjectType: 'Fixed' }).populate({
        //   path: 'iProjectId',
        //   match: {
        //     iEmployeeId: ObjectId(req.employee._id)
        //   }
        // }).lean()

        const completedProjectFixed = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y' }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectStatus: 'Completed', eProjectType: 'Fixed' } }).lean()

        if (completedProjectFixed.length) {
          completedProjectFixed.forEach(element => {
            if (element?.iProjectId) completedProjectId.add(element.iProjectId._id.toString())
          })
        }

        const othersCompletedProjectFixed = await Projects.find({
          eStatus: 'Y',
          eProjectStatus: 'Completed',
          eProjectType: 'Fixed',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        }).lean()

        if (othersCompletedProjectFixed.length) {
          othersCompletedProjectFixed.forEach(element => {
            if (element?._id) completedProjectId.add(element._id.toString())
          })
        }
        // const completedProjectDedicated = await Projects.find({ eStatus: 'Y', eProjectStatus: 'Completed', eProjectType: 'Dedicated' }).populate({
        //   path: 'iProjectId',
        //   match: {
        //     iEmployeeId: ObjectId(req.employee._id)
        //   }
        // }).lean()

        const completedProjectDedicated = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y' }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectStatus: 'Completed', eProjectType: 'Dedicated' } }).lean()

        if (completedProjectDedicated.length) {
          completedProjectDedicated.forEach(element => {
            if (element?.iProjectId) completedProjectId.add(element.iProjectId._id.toString())
          })
        }
        const othersCompletedProjectDedicated = await Projects.find({
          eStatus: 'Y',
          eProjectStatus: 'Completed',
          eProjectType: 'Dedicated',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        })

        if (othersCompletedProjectDedicated.length) {
          othersCompletedProjectDedicated.forEach(element => {
            if (element?._id) completedProjectId.add(element._id.toString())
          })
        }

        // const completedProjectId = [...new Set([...completedProjectFixed.map(a => a.iProjectId.toString()), ...othersCompletedProjectFixed.map(a => a._id.toString()), ...completedProjectDedicated.map(a => a.iProjectId.toString()), ...othersCompletedProjectDedicated.map(a => a._id.toString())])].length()

        // on hold projects

        const onHoldProjectId = new Set()

        // const onHoldProjectFixed = await Projects.find({ eStatus: 'Y', eProjectStatus: 'On Hold', eProjectType: 'Fixed' }).populate({
        //   path: 'iProjectId',
        //   match: {
        //     iEmployeeId: ObjectId(req.employee._id)
        //   }
        // }).lean()

        const onHoldProjectFixed = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y' }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectStatus: 'On Hold', eProjectType: 'Fixed' } }).lean()

        if (onHoldProjectFixed.length) {
          onHoldProjectFixed.forEach(element => {
            if (element?.iProjectId) onHoldProjectId.add(element.iProjectId._id.toString())
          })
        }

        const othersOnHoldProjectFixed = await Projects.find({
          eStatus: 'Y',
          eProjectStatus: 'On Hold',
          eProjectType: 'Fixed',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        }).lean()

        if (othersOnHoldProjectFixed.length) {
          othersOnHoldProjectFixed.forEach(element => {
            if (element?._id) onHoldProjectId.add(element._id.toString())
          })
        }
        // const onHoldProjectDedicated = await Projects.find({ eStatus: 'Y', eProjectStatus: 'On Hold', eProjectType: 'Dedicated' }).populate({
        //   path: 'iProjectId',
        //   match: {
        //     iEmployeeId: ObjectId(req.employee._id)
        //   }
        // }).lean()

        const onHoldProjectDedicated = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y' }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectStatus: 'On Hold', eProjectType: 'Dedicated' } }).lean()

        if (onHoldProjectDedicated.length) {
          onHoldProjectDedicated.forEach(element => {
            if (element?.iProjectId) onHoldProjectId.add(element.iProjectId._id.toString())
          })
        }

        const othersOnHoldProjectDedicated = await Projects.find({
          eStatus: 'Y',
          eProjectStatus: 'On Hold',
          eProjectType: 'Dedicated',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        })

        if (othersOnHoldProjectDedicated.length) {
          othersOnHoldProjectDedicated.forEach(element => {
            if (element?._id) onHoldProjectId.add(element._id.toString())
          })
        }
        // const onHoldProjectId = [...new Set([...onHoldProjectFixed.map(a => a.iProjectId.toString()), ...othersOnHoldProjectFixed.map(a => a._id.toString()), ...onHoldProjectDedicated.map(a => a.iProjectId.toString()), ...othersOnHoldProjectDedicated.map(a => a._id.toString())])].length()

        // pending projects

        const pendingProjectId = new Set()

        // const pendingProjectFixed = await Projects.find({ eStatus: 'Y', eProjectStatus: 'Pending', eProjectType: 'Fixed' }).populate({
        //   path: 'iProjectId',
        //   match: {
        //     iEmployeeId: ObjectId(req.employee._id)
        //   }
        // }).lean()

        const pendingProjectFixed = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y' }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectStatus: 'Pending', eProjectType: 'Fixed' } }).lean()

        if (pendingProjectFixed.length) {
          pendingProjectFixed.forEach(element => {
            if (element?.iProjectId) pendingProjectId.add(element.iProjectId._id.toString())
          })
        }
        const othersPendingProjectFixed = await Projects.find({
          eStatus: 'Y',
          eProjectStatus: 'Pending',
          eProjectType: 'Fixed',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        }).lean()

        if (othersPendingProjectFixed.length) {
          othersPendingProjectFixed.forEach(element => {
            if (element?._id) pendingProjectId.add(element._id.toString())
          })
        }

        // const pendingProjectDedicated = await Projects.find({ eStatus: 'Y', eProjectStatus: 'Pending', eProjectType: 'Dedicated' }).populate({
        //   path: 'iProjectId',
        //   match: {
        //     iEmployeeId: ObjectId(req.employee._id)
        //   }
        // }).lean()

        const pendingProjectDedicated = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y' }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectStatus: 'Pending', eProjectType: 'Dedicated' } }).lean()

        if (pendingProjectDedicated.length) {
          pendingProjectDedicated.forEach(element => {
            if (element?.iProjectId) pendingProjectId.add(element.iProjectId._id.toString())
          })
        }

        const othersPendingProjectDedicated = await Projects.find({
          eStatus: 'Y',
          eProjectStatus: 'Pending',
          eProjectType: 'Dedicated',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        }).lean()

        if (othersPendingProjectDedicated.length) {
          othersPendingProjectDedicated.forEach(element => {
            if (element?._id) pendingProjectId.add(element._id.toString())
          })
        }

        // in progress projects

        const inProgressProjectId = new Set()

        // const pendingProjectFixed = await Projects.find({ eStatus: 'Y', eProjectStatus: 'Pending', eProjectType: 'Fixed' }).populate({
        //   path: 'iProjectId',
        //   match: {
        //     iEmployeeId: ObjectId(req.employee._id)
        //   }
        // }).lean()

        const inProgressProjectFixed = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y' }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectStatus: 'In Progress', eProjectType: 'Fixed' } }).lean()

        if (inProgressProjectFixed.length) {
          inProgressProjectFixed.forEach(element => {
            if (element?.iProjectId) inProgressProjectId.add(element.iProjectId._id.toString())
          })
        }
        const othersInProgressProjectFixed = await Projects.find({
          eStatus: 'Y',
          eProjectStatus: 'In Progress',
          eProjectType: 'Fixed',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        }).lean()

        if (othersInProgressProjectFixed.length) {
          othersInProgressProjectFixed.forEach(element => {
            if (element?._id) inProgressProjectId.add(element._id.toString())
          })
        }

        // const pendingProjectDedicated = await Projects.find({ eStatus: 'Y', eProjectStatus: 'Pending', eProjectType: 'Dedicated' }).populate({
        //   path: 'iProjectId',
        //   match: {
        //     iEmployeeId: ObjectId(req.employee._id)
        //   }
        // }).lean()

        const inProgressProjectDedicated = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y' }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectStatus: 'Pending', eProjectType: 'Dedicated' } }).lean()

        if (inProgressProjectDedicated.length) {
          inProgressProjectDedicated.forEach(element => {
            if (element?.iProjectId) inProgressProjectId.add(element.iProjectId._id.toString())
          })
        }

        const othersInProgressProjectDedicated = await Projects.find({
          eStatus: 'Y',
          eProjectStatus: 'Pending',
          eProjectType: 'Dedicated',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        }).lean()

        if (othersInProgressProjectDedicated.length) {
          othersInProgressProjectDedicated.forEach(element => {
            if (element?._id) inProgressProjectId.add(element._id.toString())
          })
        }

        const data = {
          totalAllProjects: totalProjects,
          newAllProjects: newProjects + FixedNewProject,
          completedAllProjects: completedProjects,
          onHoldAllProjects: onHoldProjects,
          onPendingAllProjects: onPending,
          inProgressAllProjects: inProgress,
          totalOwnProjects: totalProjectId.size,
          newOwnProjects: newProjectId.size,
          completedOwnProjects: completedProjectId.size,
          onHoldOwnProjects: onHoldProjectId.size,
          onPendingOwnProjects: pendingProjectId.size,
          inProgressOwnProjects: inProgressProjectId.size
        }
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].details), { data, eShowAllProjects: employee.eShowAllProjects })
      } else {
        const totalProjectId = new Set()
        const totalProjectsFixed = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y' }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectType: 'Fixed' } }).lean()

        // console.log('totalProjectsFixed', totalProjectsFixed)

        if (totalProjectsFixed.length) {
          totalProjectsFixed.forEach(element => {
            if (element?.iProjectId) totalProjectId.add(element.iProjectId._id.toString())
          })
        }

        const othersProjectFixed = await Projects.find({
          eStatus: 'Y',
          eProjectType: 'Fixed',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        })

        // console.log('othersProjectFixed', othersProjectFixed)

        if (othersProjectFixed.length) {
          othersProjectFixed.forEach(element => {
            if (element?._id) totalProjectId.add(element._id.toString())
          })
        }

        const totalProjectsDedicated = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y' }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectType: 'Dedicated' } }).lean()

        // console.log('totalProjectsDedicated', totalProjectsDedicated)

        if (totalProjectsDedicated.length) {
          totalProjectsDedicated.forEach(element => {
            if (element?.iProjectId) totalProjectId.add(element.iProjectId._id.toString())
          })
        }

        const othersProjectDedicated = await Projects.find({
          eStatus: 'Y',
          eProjectType: 'Dedicated',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        })

        // console.log('othersProjectDedicated', othersProjectDedicated)

        if (othersProjectDedicated.length) {
          othersProjectDedicated.forEach(element => {
            if (element?._id) totalProjectId.add(element._id.toString())
          })
        }

        // console.log(totalProjectsFixed, othersProjectFixed, totalProjectsDedicated, othersProjectDedicated)

        // const totalProjectId = [...new Set([...totalProjectsFixed.map(a => a.iProjectId.toString()), ...othersProjectFixed.map(a => a._id.toString()), ...totalProjectsDedicated.map(a => a.iProjectId.toString()), ...othersProjectDedicated.map(a => a._id.toString())])].length()

        // new projects

        const newProjectId = new Set()

        const newProjectFixed = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y', dCreatedAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) } }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectType: 'Fixed' } }).lean()

        if (newProjectFixed.length) {
          newProjectFixed.forEach(element => {
            if (element?.iProjectId) newProjectId.add(element.iProjectId._id.toString())
          })
        }

        const othersNewProjectFixed = await Projects.find({
          eStatus: 'Y',
          eProjectStatus: { $nin: ['Pending', 'Completed'] },
          dCreatedAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) },
          eProjectType: 'Fixed',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        }).lean()

        if (othersNewProjectFixed.length) {
          othersNewProjectFixed.forEach(element => {
            if (element?._id) newProjectId.add(element._id.toString())
          })
        }

        const newProjectDedicated = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y', dCreatedAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) } }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectType: 'Dedicated' } }).lean()

        if (newProjectDedicated.length) {
          newProjectDedicated.forEach(element => {
            if (element?.iProjectId) newProjectId.add(element.iProjectId._id.toString())
          })
        }

        const othersNewProjectDedicated = await Projects.find({
          eStatus: 'Y',
          eProjectStatus: { $nin: ['Pending', 'Completed'] },
          dContractStartDate: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) },
          eProjectType: 'Dedicated',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        })

        if (othersNewProjectDedicated.length) {
          othersNewProjectDedicated.forEach(element => {
            if (element?._id) newProjectId.add(element._id.toString())
          })
        }

        // const newProjectId = [...new Set([...newProjectFixed.map(a => a.iProjectId.toString()), ...othersNewProjectFixed.map(a => a._id.toString()), ...newProjectDedicated.map(a => a.iProjectId.toString()), ...othersNewProjectDedicated.map(a => a._id.toString())])].length()

        // completed projects

        const completedProjectId = new Set()

        // const completedProjectFixed = await Projects.find({ eStatus: 'Y', eProjectStatus: 'Completed', eProjectType: 'Fixed' }).populate({
        //   path: 'iProjectId',
        //   match: {
        //     iEmployeeId: ObjectId(req.employee._id)
        //   }
        // }).lean()

        const completedProjectFixed = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y' }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectStatus: 'Completed', eProjectType: 'Fixed' } }).lean()

        if (completedProjectFixed.length) {
          completedProjectFixed.forEach(element => {
            if (element?.iProjectId) completedProjectId.add(element.iProjectId._id.toString())
          })
        }

        const othersCompletedProjectFixed = await Projects.find({
          eStatus: 'Y',
          eProjectStatus: 'Completed',
          eProjectType: 'Fixed',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        }).lean()

        if (othersCompletedProjectFixed.length) {
          othersCompletedProjectFixed.forEach(element => {
            if (element?._id) completedProjectId.add(element._id.toString())
          })
        }
        // const completedProjectDedicated = await Projects.find({ eStatus: 'Y', eProjectStatus: 'Completed', eProjectType: 'Dedicated' }).populate({
        //   path: 'iProjectId',
        //   match: {
        //     iEmployeeId: ObjectId(req.employee._id)
        //   }
        // }).lean()

        const completedProjectDedicated = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y' }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectStatus: 'Completed', eProjectType: 'Dedicated' } }).lean()

        if (completedProjectDedicated.length) {
          completedProjectDedicated.forEach(element => {
            if (element?.iProjectId) completedProjectId.add(element.iProjectId._id.toString())
          })
        }
        const othersCompletedProjectDedicated = await Projects.find({
          eStatus: 'Y',
          eProjectStatus: 'Completed',
          eProjectType: 'Dedicated',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        })

        if (othersCompletedProjectDedicated.length) {
          othersCompletedProjectDedicated.forEach(element => {
            if (element?._id) completedProjectId.add(element._id.toString())
          })
        }

        // const completedProjectId = [...new Set([...completedProjectFixed.map(a => a.iProjectId.toString()), ...othersCompletedProjectFixed.map(a => a._id.toString()), ...completedProjectDedicated.map(a => a.iProjectId.toString()), ...othersCompletedProjectDedicated.map(a => a._id.toString())])].length()

        // on hold projects

        const onHoldProjectId = new Set()

        // const onHoldProjectFixed = await Projects.find({ eStatus: 'Y', eProjectStatus: 'On Hold', eProjectType: 'Fixed' }).populate({
        //   path: 'iProjectId',
        //   match: {
        //     iEmployeeId: ObjectId(req.employee._id)
        //   }
        // }).lean()

        const onHoldProjectFixed = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y' }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectStatus: 'On Hold', eProjectType: 'Fixed' } }).lean()

        if (onHoldProjectFixed.length) {
          onHoldProjectFixed.forEach(element => {
            if (element?.iProjectId) onHoldProjectId.add(element.iProjectId._id.toString())
          })
        }

        const othersOnHoldProjectFixed = await Projects.find({
          eStatus: 'Y',
          eProjectStatus: 'On Hold',
          eProjectType: 'Fixed',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        }).lean()

        if (othersOnHoldProjectFixed.length) {
          othersOnHoldProjectFixed.forEach(element => {
            if (element?._id) onHoldProjectId.add(element._id.toString())
          })
        }
        // const onHoldProjectDedicated = await Projects.find({ eStatus: 'Y', eProjectStatus: 'On Hold', eProjectType: 'Dedicated' }).populate({
        //   path: 'iProjectId',
        //   match: {
        //     iEmployeeId: ObjectId(req.employee._id)
        //   }
        // }).lean()

        const onHoldProjectDedicated = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y' }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectStatus: 'On Hold', eProjectType: 'Dedicated' } }).lean()

        if (onHoldProjectDedicated.length) {
          onHoldProjectDedicated.forEach(element => {
            if (element?.iProjectId) onHoldProjectId.add(element.iProjectId._id.toString())
          })
        }

        const othersOnHoldProjectDedicated = await Projects.find({
          eStatus: 'Y',
          eProjectStatus: 'On Hold',
          eProjectType: 'Dedicated',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        })

        if (othersOnHoldProjectDedicated.length) {
          othersOnHoldProjectDedicated.forEach(element => {
            if (element?._id) onHoldProjectId.add(element._id.toString())
          })
        }
        // const onHoldProjectId = [...new Set([...onHoldProjectFixed.map(a => a.iProjectId.toString()), ...othersOnHoldProjectFixed.map(a => a._id.toString()), ...onHoldProjectDedicated.map(a => a.iProjectId.toString()), ...othersOnHoldProjectDedicated.map(a => a._id.toString())])].length()

        // pending projects

        const pendingProjectId = new Set()

        // const pendingProjectFixed = await Projects.find({ eStatus: 'Y', eProjectStatus: 'Pending', eProjectType: 'Fixed' }).populate({
        //   path: 'iProjectId',
        //   match: {
        //     iEmployeeId: ObjectId(req.employee._id)
        //   }
        // }).lean()

        const pendingProjectFixed = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y' }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectStatus: 'Pending', eProjectType: 'Fixed' } }).lean()

        if (pendingProjectFixed.length) {
          pendingProjectFixed.forEach(element => {
            if (element?.iProjectId) pendingProjectId.add(element.iProjectId._id.toString())
          })
        }
        const othersPendingProjectFixed = await Projects.find({
          eStatus: 'Y',
          eProjectStatus: 'Pending',
          eProjectType: 'Fixed',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        }).lean()

        if (othersPendingProjectFixed.length) {
          othersPendingProjectFixed.forEach(element => {
            if (element?._id) pendingProjectId.add(element._id.toString())
          })
        }

        // const pendingProjectDedicated = await Projects.find({ eStatus: 'Y', eProjectStatus: 'Pending', eProjectType: 'Dedicated' }).populate({
        //   path: 'iProjectId',
        //   match: {
        //     iEmployeeId: ObjectId(req.employee._id)
        //   }
        // }).lean()

        const pendingProjectDedicated = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y' }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectStatus: 'Pending', eProjectType: 'Dedicated' } }).lean()

        if (pendingProjectDedicated.length) {
          pendingProjectDedicated.forEach(element => {
            if (element?.iProjectId) pendingProjectId.add(element.iProjectId._id.toString())
          })
        }

        const othersPendingProjectDedicated = await Projects.find({
          eStatus: 'Y',
          eProjectStatus: 'Pending',
          eProjectType: 'Dedicated',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        }).lean()

        if (othersPendingProjectDedicated.length) {
          othersPendingProjectDedicated.forEach(element => {
            if (element?._id) pendingProjectId.add(element._id.toString())
          })
        }

        // const pendingProjectId = [...new Set([...pendingProjectFixed.map(a => a.iProjectId.toString()), ...othersPendingProjectFixed.map(a => a._id.toString()), ...pendingProjectDedicated.map(a => a.iProjectId.toString()), ...othersPendingProjectDedicated.map(a => a._id.toString())])].length()

        // console.log(totalProjectId)

        // in progress projects

        const inProgressProjectId = new Set()

        // const pendingProjectFixed = await Projects.find({ eStatus: 'Y', eProjectStatus: 'Pending', eProjectType: 'Fixed' }).populate({
        //   path: 'iProjectId',
        //   match: {
        //     iEmployeeId: ObjectId(req.employee._id)
        //   }
        // }).lean()

        const inProgressProjectFixed = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y' }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectStatus: 'In Progress', eProjectType: 'Fixed' } }).lean()

        if (inProgressProjectFixed.length) {
          inProgressProjectFixed.forEach(element => {
            if (element?.iProjectId) inProgressProjectId.add(element.iProjectId._id.toString())
          })
        }
        const othersInProgressProjectFixed = await Projects.find({
          eStatus: 'Y',
          eProjectStatus: 'In Progress',
          eProjectType: 'Fixed',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        }).lean()

        if (othersInProgressProjectFixed.length) {
          othersInProgressProjectFixed.forEach(element => {
            if (element?._id) inProgressProjectId.add(element._id.toString())
          })
        }

        // const pendingProjectDedicated = await Projects.find({ eStatus: 'Y', eProjectStatus: 'Pending', eProjectType: 'Dedicated' }).populate({
        //   path: 'iProjectId',
        //   match: {
        //     iEmployeeId: ObjectId(req.employee._id)
        //   }
        // }).lean()

        const inProgressProjectDedicated = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y' }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectStatus: 'Pending', eProjectType: 'Dedicated' } }).lean()

        if (inProgressProjectDedicated.length) {
          inProgressProjectDedicated.forEach(element => {
            if (element?.iProjectId) inProgressProjectId.add(element.iProjectId._id.toString())
          })
        }

        const othersInProgressProjectDedicated = await Projects.find({
          eStatus: 'Y',
          eProjectStatus: 'Pending',
          eProjectType: 'Dedicated',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        }).lean()

        if (othersInProgressProjectDedicated.length) {
          othersInProgressProjectDedicated.forEach(element => {
            if (element?._id) inProgressProjectId.add(element._id.toString())
          })
        }

        const data = {

          totalAllProjects: 0,
          newAllProjects: 0,
          completedAllProjects: 0,
          onHoldAllProjects: 0,
          onPendingAllProjects: 0,
          inProgressAllProjects: 0,
          totalOwnProjects: totalProjectId.size,
          newOwnProjects: newProjectId.size,
          completedOwnProjects: completedProjectId.size,
          onHoldOwnProjects: onHoldProjectId.size,
          onPendingOwnProjects: pendingProjectId.size,
          inProgressOwnProjects: inProgressProjectId.size

        }
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].details), { data, eShowAllProjects: employee.eShowAllProjects })
      }
    } catch (error) {
      return catchError('DashBoard.getDetails', error, req, res)
    }
  }

  async monthlyProjects(req, res) {
    let { year = new Date().getFullYear(), eShow = 'ALL', page = 0, limit = 5 } = req.query
    year = parseInt(year)

    // console.log('year', year)
    // console.log('eShow', eShow)

    const employee = await EmployeeModel.findOne({ _id: req.employee._id }, { eShowAllProjects: 1 }).lean()

    if (!employee) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].notFound.replace('##', 'Employee'))

    if (employee.eShowAllProjects === 'ALL' && eShow === 'ALL') {
      try {
        const monthlyProjects = await Projects.aggregate([
          {
            $match: {
              eStatus: 'Y',
              eProjectStatus: { $nin: ['Cancelled'] }
              // $expr: {
              //   $eq: [{ $year: '$dCreatedAt' }, year]
              // }
            }
          },
          // {
          //   $group: {
          //     _id: {
          //       $month: '$dCreatedAt'
          //     },
          //     dCreatedAt: { $first: '$dCreatedAt' },
          //     count: { $sum: 1 }
          //   }
          // },
          // {
          //   $sort: {
          //     _id: 1
          //   }
          // },
          // {
          //   $project: {
          //     _id: 0,
          //     month: '$_id',
          //     count: '$count',
          //     dCreatedAt: '$dCreatedAt'
          //   }
          // }
          {
            $project: {
              _id: 1,
              sName: 1,
              sLogo: 1,
              eProjectType: 1,
              dStartDate: {
                $cond: {
                  if: { $eq: ['$eProjectType', 'Fixed'] },
                  then: '$dStartDate',
                  else: '$dContractStartDate'
                }
              }
            }
          },
          {
            $match: {
              $expr: {
                $eq: [{ $year: '$dStartDate' }, year]
              }
            }
          },
          {
            $group: {
              _id: {
                $month: '$dStartDate'
              },
              sProject: { $addToSet: '$sName' },
              count: { $sum: 1 }
            }
          },
          {
            $sort: {
              _id: 1
            }
          },
          {
            $project: {
              _id: 0,
              month: '$_id',
              count: '$count',
              sProject: '$sProject'
            }
          }
        ])

        // console.log('monthlyProjects', monthlyProjects)

        // const yearlyProjects = await Projects.aggregate([
        //   {
        //     $match: {
        //       eStatus: 'Y',
        //       eProjectStatus: { $nin: ['Cancelled'] }
        //     }
        //   },
        //   {
        //     $project: {
        //       _id: 1,
        //       sName: 1,
        //       sLogo: 1,
        //       eProjectType: 1,
        //       dStartDate: {
        //         $cond: {
        //           if: { $eq: ['$eProjectType', 'Fixed'] },
        //           then: '$dStartDate',
        //           else: '$dContractStartDate'
        //         }
        //       }
        //     }
        //   },
        //   {
        //     $group: {
        //       _id: {
        //         $year: '$dStartDate'
        //       },
        //       dCreatedAt: { $first: '$dStartDate' },
        //       count: { $sum: 1 }
        //     }
        //   },
        //   {
        //     $sort: {
        //       _id: 1
        //     }
        //   },
        //   {
        //     $project: {
        //       _id: 0,
        //       year: '$_id',
        //       count: '$count',
        //       dCreatedAt: '$dCreatedAt'
        //     }
        //   }
        // ])

        // console.log('monthlyProjects', monthlyProjects)
        // console.log('yearlyProjects', yearlyProjects)

        // const yearData = calculateYear(yearlyProjects)

        const data = {
          monthlyProjects
          // ...yearData
        }
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].details), { data, eShowAllProjects: employee.eShowAllProjects })
      } catch (error) {
        return catchError('DashBoard.newProjects', error, req, res)
      }
    } else {
      const totalProjectId = new Set()
      const totalProjectsFixed = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y' }).populate({ path: 'iProjectId', match: { eStatus: 'Y' } }).lean()

      if (totalProjectsFixed.length) {
        totalProjectsFixed.forEach(element => {
          if (element?.iProjectId) totalProjectId.add(element.iProjectId._id.toString())
        })
      }

      const othersProjectFixed = await Projects.find({
        eStatus: 'Y',
        $or: [
          { iBDId: ObjectId(req.employee._id) },
          { iBAId: ObjectId(req.employee._id) },
          { iProjectManagerId: ObjectId(req.employee._id) }
        ]
      })

      if (othersProjectFixed.length) {
        othersProjectFixed.forEach(element => {
          if (element?._id) totalProjectId.add(element._id.toString())
        })
      }

      console.log('totalProjectId', totalProjectId)

      try {
        const monthlyProjects = await Projects.aggregate([
          {
            $match: {
              eStatus: 'Y',
              eProjectStatus: { $nin: ['Cancelled'] },
              _id: { $in: [...totalProjectId].map(a => ObjectId(a)) }
            }
          },
          {
            $project: {
              _id: 1,
              sName: 1,
              sLogo: 1,
              eProjectType: 1,
              dStartDate: {
                $cond: {
                  if: { $eq: ['$eProjectType', 'Fixed'] },
                  then: '$dStartDate',
                  else: '$dContractStartDate'
                }
              }
            }
          },
          {
            $match: {
              $expr: {
                $eq: [{ $year: '$dStartDate' }, year]
              }
            }
          },
          {
            $group: {
              _id: {
                $month: '$dStartDate'
              },
              sProject: { $addToSet: '$sName' },
              count: { $sum: 1 }
            }
          },
          {
            $sort: {
              _id: 1
            }
          },
          {
            $project: {
              _id: 0,
              month: '$_id',
              count: '$count',
              sProject: '$sProject'
            }
          }
        ])

        console.log(monthlyProjects)

        // const yearlyProjects = await Projects.aggregate([
        //   {
        //     $match: {
        //       eStatus: 'Y',
        //       eProjectStatus: { $nin: ['Cancelled'] },
        //       _id: { $in: [...totalProjectId].map(a => ObjectId(a)) }
        //     }
        //   },
        //   {
        //     $project: {
        //       _id: 1,
        //       sName: 1,
        //       sLogo: 1,
        //       eProjectType: 1,
        //       dStartDate: {
        //         $cond: {
        //           if: { $eq: ['$eProjectType', 'Fixed'] },
        //           then: '$dStartDate',
        //           else: '$dContractStartDate'
        //         }
        //       }
        //     }
        //   },
        //   {
        //     $group: {
        //       _id: {
        //         $year: '$dStartDate'
        //       },
        //       dCreatedAt: { $first: '$dStartDate' },
        //       count: { $sum: 1 }
        //     }
        //   },
        //   {
        //     $sort: {
        //       _id: 1
        //     }
        //   },
        //   {
        //     $project: {
        //       _id: 0,
        //       year: '$_id',
        //       count: '$count',
        //       dCreatedAt: '$dStartDate'
        //     }
        //   }
        // ])

        // const yearData = calculateYear(yearlyProjects)

        const data = {
          monthlyProjects
          // ...yearData
        }
        // console.log('monthlyProjects', monthlyProjects)
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].details), { eShowAllProjects: employee.eShowAllProjects, data })
      } catch (error) {
        return catchError('DashBoard.newProjects', error, req, res)
      }
    }
  }

  async latestProjects(req, res) {
    const { eShow = 'ALL', page = 0, limit = 0 } = req.query

    try {
      const employee = await EmployeeModel.findOne({ _id: req.employee._id }, { eShowAllProjects: 1 }).lean()

      if (!employee) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].notFound.replace('##', 'Employee'))

      if (employee.eShowAllProjects === 'ALL' && eShow === 'ALL') {
        const latestFixedProjects = await Projects.find({
          eStatus: 'Y',
          eProjectStatus: { $nin: ['Pending'] },
          eProjectType: 'Fixed'
        }, { sName: 1, sLogo: 1, dEndDate: 1, dStartDate: 1, eProjectStatus: 1, eProjectType: 1 }).sort({ dStartDate: -1 }).lean()

        const latestDedicatedProjects = await Projects.aggregate([
          {
            $match: {
              eStatus: 'Y',
              eProjectStatus: { $nin: ['Pending'] },
              eProjectType: 'Dedicated'
            }
          },
          {
            $project: {
              _id: 1,
              sName: 1,
              sLogo: 1,
              eProjectStatus: 1,
              eProjectType: 1,
              dStartDate: { $ifNull: ['$dContractStartDate', null] },
              dEndDate: { $ifNull: ['$dContractEndDate', null] }
            }
          },
          {
            $sort: {
              dStartDate: -1
            }
          }
        ])

        const data = [...latestFixedProjects, ...latestDedicatedProjects].sort((a, b) => new Date(b?.dStartDate) - new Date(a?.dStartDate)).slice(0, 5)

        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].details), { data, eShowAllProjects: employee.eShowAllProjects })
      } else {
        // find employee projects
        const totalProjectFixedId = new Set()
        const totalProjectsFixed = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y' }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectType: 'Fixed' } }).lean()

        // console.log('totalProjectsFixed', totalProjectsFixed)

        if (totalProjectsFixed.length) {
          totalProjectsFixed.forEach(element => {
            if (element?.iProjectId) totalProjectFixedId.add(element.iProjectId._id.toString())
          })
        }

        const othersProjectFixed = await Projects.find({
          eStatus: 'Y',
          eProjectType: 'Fixed',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        })

        // console.log('othersProjectFixed', othersProjectFixed)

        if (othersProjectFixed.length) {
          othersProjectFixed.forEach(element => {
            if (element?._id) totalProjectFixedId.add(element._id.toString())
          })
        }

        const totalProjectDedicatedId = new Set()

        const totalProjectsDedicated = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y' }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectType: 'Dedicated' } }).lean()

        // console.log('totalProjectsDedicated', totalProjectsDedicated)

        if (totalProjectsDedicated.length) {
          totalProjectsDedicated.forEach(element => {
            if (element?.iProjectId) totalProjectDedicatedId.add(element.iProjectId._id.toString())
          })
        }

        const othersProjectDedicated = await Projects.find({
          eStatus: 'Y',
          eProjectType: 'Dedicated',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        })

        // console.log('othersProjectDedicated', othersProjectDedicated)

        if (othersProjectDedicated.length) {
          othersProjectDedicated.forEach(element => {
            if (element?._id) totalProjectDedicatedId.add(element._id.toString())
          })
        }

        const latestFixedProjects = await Projects.find({
          eStatus: 'Y',
          eProjectStatus: { $nin: ['Pending'] },
          eProjectType: 'Fixed',
          _id: { $in: [...totalProjectFixedId] }
        }, { sName: 1, sLogo: 1, dEndDate: 1, dStartDate: 1, eProjectStatus: 1, eProjectType: 1 }).sort({ dStartDate: -1 }).lean()

        // const latestDedicatedProjects = await Projects.find({
        //   eStatus: 'Y',
        //   eProjectStatus: { $nin: ['Pending'] },
        //   eProjectType: 'Dedicated',
        //   _id: { $in: [...totalProjectDedicatedId] }
        // }, {
        //   sName: 1, sLogo: 1, dEndDate: 1, eProjectStatus: 1, eProjectType: 1, dContractStartDate: 1, dContractEndDate: 1
        // }).sort({ dContractStartDate: -1 }).lean()

        const latestDedicatedProjects = await Projects.aggregate([
          {
            $match: {
              eStatus: 'Y',
              eProjectStatus: { $nin: ['Pending'] },
              eProjectType: 'Dedicated',
              _id: { $in: [...totalProjectDedicatedId] }
            }
          },
          {
            $project: {
              _id: 1,
              sName: 1,
              sLogo: 1,
              eProjectStatus: 1,
              eProjectType: 1,
              dStartDate: { $ifNull: ['$dContractStartDate', null] },
              dEndDate: { $ifNull: ['$dContractEndDate', null] }
            }
          },
          {
            $sort: {
              dStartDate: -1
            }
          }
        ])

        const data = [...latestFixedProjects, ...latestDedicatedProjects].sort((a, b) => new Date(b?.dStartDate) - new Date(a?.dStartDate)).slice(0, 5)

        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].details), { data, eShowAllProjects: employee.eShowAllProjects })
      }
    } catch (error) {
      return catchError('DashBoard.latestProjects', error, req, res)
    }
  }

  async freeResource(req, res) {
    const { page = 0, limit = 5, search = '' } = req.query
    try {
      const [totalEmployee, employeeWithProjectNotCompletedOrCancelled] = await Promise.all([EmployeeModel.find({ eStatus: 'Y' }, { _id: 1, sName: 1 }).lean(),
      Projects.find({ eStatus: 'Y', eProjectStatus: { $nin: ['Completed', 'Cancelled'] } }, { _id: 1 }).lean()])
      const aEmployeeWithProjectNotCompletedOrCancelled = employeeWithProjectNotCompletedOrCancelled.map(a => a._id.toString())

      const employeeWorkInProjects = await ProjectwiseemployeeModel.find({ iProjectId: { $in: aEmployeeWithProjectNotCompletedOrCancelled }, eStatus: 'Y' }, { _id: 0, iEmployeeId: 1 }).lean()

      const aEmployeeWorkInProjects = employeeWorkInProjects.map(a => a.iEmployeeId.toString())

      const aTotalEmployee = totalEmployee.map(a => a._id.toString())

      const aUniqueTotalEmployee = aTotalEmployee.filter((v, i, a) => a.findIndex(t => (t === v)) === i)

      const aUniqueEmployeeWorkInProjects = aEmployeeWorkInProjects.filter((v, i, a) => a.findIndex(t => (t === v)) === i)

      const remainEmployee = aUniqueTotalEmployee.filter(val => !aUniqueEmployeeWorkInProjects.includes(val))

      const query = search && search.length
        ? {
          $or: [{ sName: { $regex: new RegExp('^.*' + search + '.*', 'i', 'i') } },
          { sEmpId: { $regex: new RegExp('^.*' + search + '.*', 'i', 'i') } },
          { sEmail: { $regex: new RegExp('^.*' + search + '.*', 'i', 'i') } }
          ],
          eStatus: 'Y',
          _id: { $in: remainEmployee }
        }
        : { eStatus: 'Y', _id: { $in: remainEmployee } }

      const [freeResource, count] = await Promise.all([EmployeeModel.find(query, { _id: 0, sName: 1, iDepartmentId: 1, sEmpId: 1, sEmail: 1 }).populate({ path: 'iDepartmentId', eStatus: 'Y', select: 'sName' }).sort({ sName: 1 }).skip(page).limit(limit).lean(),
      EmployeeModel.countDocuments(query).lean()])

      if (search) remainEmployee.length = count

      const freeResourceEmployee = freeResource.map(a => {
        return { sName: a.sName ?? 'Anonymus', sDepartment: a.iDepartmentId?.sName ?? 'Unknown', sEmpId: a.sEmpId, sEmail: a.sEmail }
      }
      )
      const data = {
        freeResource: {
          freeResourceEmployee,
          total: remainEmployee.length
        }
      }
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].details), data)
    } catch (error) {
      return catchError('DashBoard.freeResource', error, req, res)
    }
  }

  async freeResource2(req, res) {
    try {
      const { page = 0, limit = 5, iDepartmentId } = req.query
      const q = { eStatus: 'Y', eAvailabilityStatus: { $in: ['Partially Available', 'Available'] } }
      if (iDepartmentId) {
        q.iDepartmentId = ObjectId(iDepartmentId)
      }
      const [freeResource, count] = await Promise.all([EmployeeModel.find(q, { _id: 0, sName: 1, iDepartmentId: 1, sEmpId: 1, sEmail: 1, eAvailabilityStatus: 1, nAvailabilityHours: 1 }).populate({ path: 'iDepartmentId', eStatus: 'Y', select: 'sName' }).populate({ path: 'iJobProfileId', eStatus: 'Y', select: 'sName' }).sort({ sName: 1 }).skip(page).limit(limit).lean(),
      EmployeeModel.countDocuments(q).lean()])

      const freeResourceEmployee = freeResource.map(a => {
        return { sName: a.sName ?? 'Anonymus', sDepartment: a.iDepartmentId?.sName ?? 'Unknown', sEmpId: a.sEmpId, sEmail: a.sEmail, sJobProfile: a.iJobProfileId?.sName ?? 'Unknown', eAvailabilityStatus: a?.eAvailabilityStatus || 'Not Available', nAvailabilityHours: a?.nAvailabilityHours || 0 }
      }
      )
      const data = {
        freeResource: {
          freeResourceEmployee,
          total: count
        }
      }
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].details), data)
    } catch (error) {
      catchError('DashBoard.freeResource2', error, req, res)
    }
  }

  async projectIndicator(req, res) {
    try {
      let { page = 0, limit = 5, search = '', order, sort = 'dCreatedAt', eProjectType = '', iBDId = '', iProjectManagerId = '', eProjectStatus = '' } = req.query

      // console.log(req.employee._id)

      const orderBy = order && order === 'asc' ? 1 : -1

      eProjectType = eProjectType.trim()

      const projectEmployee = await ProjectwiseemployeeModel.find({ eStatus: 'Y', iEmployeeId: ObjectId(req.employee._id) }, { iProjectId: 1 }).lean()
      const department = await DepartmentModel.findOne({ eStatus: 'Y', _id: ObjectId(req.employee.iDepartmentId) }).lean()

      const jobProfileData = await EmployeeModel.findOne({ _id: req.employee._id }, { iJobProfileId: 1, eShowAllProjects: 1 }).populate({ path: 'iJobProfileId', select: 'nLevel' }).lean()

      const q = [
        {
          $match: {
            eStatus: 'Y'
          }
        },
        {
          $lookup: {
            from: 'currencies',
            let: { currencyId: '$iCurrencyId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$_id', '$$currencyId'] }
                    ]
                  },
                  eStatus: 'Y'
                }
              },
              {
                $project: {
                  _id: 1,
                  sName: 1,
                  sSymbol: 1
                }
              }
            ],
            as: 'currency'
          }
        },
        {
          $unwind: {
            path: '$currency',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: 'projectwisetechnologies',
            let: { projectId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$iProjectId', '$$projectId'] }
                    ]
                  },
                  eStatus: 'Y'
                }
              },
              {
                $lookup: {
                  from: 'technologies',
                  let: { technologyId: '$iTechnologyId' },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ['$_id', '$$technologyId'] }
                          ]
                        },
                        eStatus: 'Y'
                      }
                    },
                    {
                      $project: {
                        sName: 1,
                        sBackGroundColor: 1,
                        sTextColor: 1
                      }
                    }
                  ],
                  as: 'technology'
                }
              },
              {
                $unwind: {
                  path: '$technology',
                  preserveNullAndEmptyArrays: true
                }
              },
              {
                $project: {
                  iTechnologyId: 1,
                  iProjectId: 1,
                  sName: '$technology.sName',
                  sBackGroundColor: '$technology.sBackGroundColor',
                  sTextColor: '$technology.sTextColor'
                }
              }
            ],
            as: 'projectTechnologies'
          }
        },
        {
          $lookup: {
            from: 'projectwiseemployees',
            let: { projectId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$iProjectId', '$$projectId'] },
                      { eStatus: 'Y' }
                    ]
                  },
                  eStatus: 'Y'
                }
              },
              {
                $project: {
                  _id: 1,
                  iProjectId: 1,
                  iEmployeeId: 1,
                  iDepartmentId: 1,
                  nMinutes: 1,
                  nAvailabilityMinutes: 1,
                  sReview: 1,
                  eProjectType: 1,
                  eCostType: 1,
                  nMaxMinutes: 1,
                  nMinMinutes: 1,
                  nRemainingMinute: 1,
                  nRemainingCost: {
                    $cond: {
                      if: { $eq: [req.employee.bViewCost, true] },
                      then: { $ifNull: ['$nRemainingCost', 0] },
                      else: '$$REMOVE'
                    }
                  },
                  nNonBillableMinute: 1,
                  nNonBillableCost: {
                    $cond: {
                      if: { $eq: [req.employee.bViewCost, true] },
                      then: { $ifNull: ['$nNonBillableCost', 0] },
                      else: '$$REMOVE'
                    }
                  },
                  nOrgRemainingMinute: 1,
                  nOrgRemainingCost: {
                    $cond: {
                      if: { $eq: [req.employee.bViewCost, true] },
                      then: { $ifNull: ['$nOrgRemainingCost', 0] },
                      else: '$$REMOVE'
                    }
                  },
                  nOrgNonBillableMinute: 1,
                  nOrgNonBillableCost: {
                    $cond: {
                      if: { $eq: [req.employee.bViewCost, true] },
                      then: { $ifNull: ['$nOrgNonBillableCost', 0] },
                      else: '$$REMOVE'
                    }
                  },
                  nCost: {
                    $cond: {
                      if: { $eq: [req.employee.bViewCost, true] },
                      then: { $ifNull: ['$nCost', 0] },
                      else: '$$REMOVE'
                    }
                  },
                  nClientCost: {
                    $cond: {
                      if: { $eq: [req.employee.bViewCost, true] },
                      then: { $ifNull: ['$nClientCost', 0] },
                      else: '$$REMOVE'
                    }
                  }
                }
              }
            ],
            as: 'projectwiseemployees'
          }
        },
        {
          $project: {
            _id: 1,
            sName: 1,
            eProjectType: 1,
            eProjectStatus: 1,
            sCost: {
              $cond: {
                if: { $eq: [req.employee.bViewCost, true] },
                then: { $ifNull: ['$sCost', '0'] },
                else: '$$REMOVE'
              }
            },
            nTimeLineDays: { $ifNull: ['$nTimeLineDays', 0] },
            dStartDate: { $ifNull: ['$dStartDate', null] },
            dEndDate: { $ifNull: ['$dEndDate', null] },
            sSymbol: { $ifNull: ['$currency.sSymbol', 'USD'] },
            sCurrencyName: { $ifNull: ['$currency.sName', 'Us Dollar'] },
            projectTechnologies: { $ifNull: ['$projectTechnologies', []] },
            iBDId: { $ifNull: ['$iBDId', null] },
            iBAId: { $ifNull: ['$iBAId', null] },
            iProjectManagerId: { $ifNull: ['$iProjectManagerId', null] },
            dCreatedAt: { $ifNull: ['$dCreatedAt', null] },
            dUpdatedAt: { $ifNull: ['$dUpdatedAt', null] },
            projectwiseemployees: { $ifNull: ['$projectwiseemployees', []] },
            isWorkLogAdd: { $in: [ObjectId(req.employee._id), '$projectwiseemployees.iEmployeeId'] }
          }
        }
      ]

      // if (!['OPERATION', 'ADMIN', 'HR', 'MANAGEMENT'].includes(department.sKey)) {
      //   q[0].$match.$or = [
      //     { iBDId: ObjectId(req.employee._id) },
      //     { iProjectManagerId: ObjectId(req.employee._id) },
      //     { iBAId: ObjectId(req.employee._id) },
      //     { _id: { $in: projectEmployee.map(a => a.iProjectId) } }
      //   ]
      // }

      if (jobProfileData.eShowAllProjects === 'OWN') {
        const query = [
          {
            $match: {
              eStatus: 'Y',
              'flag.2': 'Y'
            }
          }
        ]

        // console.log('projectEmployee', projectEmployee)

        // if (!['OPERATION', 'ADMIN', 'HR', 'MANAGEMENT'].includes(department.sKey)) {
        query[0].$match.$or = [
          { iBDId: ObjectId(req.employee._id) },
          { iProjectManagerId: ObjectId(req.employee._id) },
          { iBAId: ObjectId(req.employee._id) },
          { _id: { $in: projectEmployee.map(a => a.iProjectId) } }
        ]
        // }

        const projects = await Projects.aggregate(query)
        q[0].$match._id = {
          $in: [
            ...projects.map((project) => ObjectId(project._id))
          ]
        }
      }

      if (sort && sort === 'dCreatedAt') {
        q.push({
          $sort: {
            dCreatedAt: orderBy
          }
        })
      }

      if (eProjectType && ['Fixed', 'Dedicated'].includes(eProjectType) && eProjectType !== '') {
        q[0].$match.eProjectType = eProjectType
      }

      if (iBDId && iBDId !== '' && isValidId(iBDId)) {
        q[0].$match.iBDId = ObjectId(iBDId)
      }
      if (iProjectManagerId && iProjectManagerId !== '' && isValidId(iProjectManagerId)) {
        q[0].$match.iProjectManagerId = ObjectId(iProjectManagerId)
      }

      if (eProjectStatus && eProjectStatus !== '' && ['In Progress', 'Completed', 'On Hold', 'Cancelled', 'Pending', 'Closed'].includes(eProjectStatus)) {
        q[0].$match.eProjectStatus = eProjectStatus
      }

      if (search) {
        q.push({
          $match: {
            $or: [
              { sName: { $regex: search, $options: 'i' } }
            ]
          }
        })
      }

      const count_query = [...q]

      count_query.push({ $count: 'count' })

      // sort = sort === 'client' ? 'client.sClientName' : sort
      // sort = sort === 'technology' ? 'technology.sTechnologyName' : sort
      // sort = sort === 'projecttag' ? 'projecttag.sProjectTagName' : sort
      // sort = sort === 'sName' ? 'sName' : sort
      // sort = sort === 'dEndDate' ? 'dEndDate' : sort

      // const sorting = { [sort]: orderBy }

      // q.push({ $sort: sorting })
      if (limit !== 'all') {
        q.push({ $skip: parseInt(page) })
        q.push({ $limit: parseInt(limit) })
      }

      const [count, projects] = await Promise.all([Projects.aggregate(count_query), Projects.aggregate(q)])

      const all = []

      for (const i of projects) {
        const query = [
          {
            $match: { eStatus: 'Y', _id: i._id }
          },
          {
            $project: {
              _id: 1
            }
          },
          {
            $lookup: {
              from: 'dashboardprojectindicators',
              let: { project: '$_id' },
              pipeline: [
                {
                  $match: {
                    eStatus: 'Y',
                    $expr: {
                      $and: [
                        { $eq: ['$iProjectId', '$$project'] }
                      ]
                    }
                  }
                },
                {
                  $project: {
                    _id: 1,
                    iProjectId: 1,
                    eStatus: 1,
                    sCost: {
                      $cond: {
                        if: { $eq: [req.employee.bViewCost, true] },
                        then: { $ifNull: ['$sCost', '0'] },
                        else: '$$REMOVE'
                      }
                    },
                    nCost: {
                      $cond: {
                        if: { $eq: [req.employee.bViewCost, true] },
                        then: { $ifNull: ['$nCost', '0'] },
                        else: '$$REMOVE'
                      }
                    },
                    nTimeLineDays: { $ifNull: ['$nTimeLineDays', 0] },
                    nMinutes: { $ifNull: ['$nMinutes', 0] },
                    nRemainingMinute: { $ifNull: ['$nRemainingMinute', 0] },
                    nRemainingCost: {
                      $cond: {
                        if: { $eq: [req.employee.bViewCost, true] },
                        then: { $ifNull: ['$nRemainingCost', 0] },
                        else: '$$REMOVE'
                      }
                    },
                    nNonBillableMinute: { $ifNull: ['$nNonBillableMinute', 0] },
                    nNonBillableCost: {
                      $cond: {
                        if: { $eq: [req.employee.bViewCost, true] },
                        then: { $ifNull: ['$nNonBillableCost', 0] },
                        else: '$$REMOVE'
                      }
                    },
                    nOrgRemainingMinute: { $ifNull: ['$nOrgRemainingMinute', 0] },
                    nOrgRemainingCost: {
                      $cond: {
                        if: { $eq: [req.employee.bViewCost, true] },
                        then: { $ifNull: ['$nOrgRemainingCost', 0] },
                        else: '$$REMOVE'
                      }
                    },
                    nOrgNonBillableMinute: { $ifNull: ['$nOrgNonBillableMinute', 0] },
                    nOrgNonBillableCost: {
                      $cond: {
                        if: { $eq: [req.employee.bViewCost, true] },
                        then: { $ifNull: ['$nOrgNonBillableCost', 0] },
                        else: '$$REMOVE'
                      }
                    },
                    eProjectType: 1,
                    dCreatedAt: 1,
                    dUpdatedAt: 1
                  }
                }
              ],
              as: 'projectIndicator'
            }
          },
          {
            $unwind: {
              path: '$projectIndicator',
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $lookup: {
              from: 'dashboardprojectdepartments',
              let: { project: '$_id' },
              pipeline: [
                {
                  $match: {
                    eStatus: 'Y',
                    $expr: {
                      $and: [
                        { $eq: ['$iProjectId', '$$project'] }
                      ]
                    }
                  }
                },
                {
                  $lookup: {
                    from: 'departments',
                    let: { department: '$iDepartmentId' },
                    pipeline: [
                      {
                        $match: {
                          eStatus: 'Y',
                          $expr: {
                            $and: [
                              { $eq: ['$_id', '$$department'] }
                            ]
                          }
                        }
                      }
                    ],
                    as: 'department'
                  }
                },
                {
                  $unwind: {
                    path: '$department',
                    preserveNullAndEmptyArrays: true
                  }
                },
                {
                  $project: {
                    _id: '$department._id',
                    sName: '$department.sName',
                    sBackGroundColor: '$department.sBackGroundColor',
                    sTextColor: '$department.sTextColor',
                    iProjectId: 1,
                    nMinutes: { $ifNull: ['$nMinutes', 0] },
                    nCost: {
                      $cond: {
                        if: { $eq: [req.employee.bViewCost, true] },
                        then: { $ifNull: ['$nCost', 0] },
                        else: '$$REMOVE'
                      }
                    },
                    nRemainingMinute: { $ifNull: ['$nRemainingMinute', 0] },
                    nRemainingCost: {
                      $cond: {
                        if: { $eq: [req.employee.bViewCost, true] },
                        then: { $ifNull: ['$nRemainingCost', 0] },
                        else: '$$REMOVE'
                      }
                    },
                    nNonBillableMinute: { $ifNull: ['$nNonBillableMinute', 0] },
                    nNonBillableCost: {
                      $cond: {
                        if: { $eq: [req.employee.bViewCost, true] },
                        then: { $ifNull: ['$nNonBillableCost', 0] },
                        else: '$$REMOVE'
                      }
                    }
                  }
                }
              ],
              as: 'projectDepartment'
            }
          },
          {
            $lookup: {
              from: 'dashboardcrindicators',
              let: { project: '$_id' },
              pipeline: [
                {
                  $match: {
                    eStatus: 'Y',
                    $expr: {
                      $and: [
                        { $eq: ['$iProjectId', '$$project'] }
                      ]
                    }
                  }
                },
                {
                  $lookup: {
                    from: 'changerequests',
                    let: { crId: '$iCrId' },
                    pipeline: [
                      {
                        $match: {
                          eStatus: 'Y',
                          $expr: {
                            $and: [
                              { $eq: ['$_id', '$$crId'] }
                            ]
                          }
                        }
                      },
                      {
                        $project: {
                          _id: 1,
                          sName: 1
                        }
                      }
                    ],
                    as: 'changeRequests'
                  }
                },
                {
                  $unwind: {
                    path: '$changeRequests',
                    preserveNullAndEmptyArrays: true
                  }
                },
                {
                  $project: {
                    iCrId: 1,
                    iProjectId: 1,
                    nTimeLineDays: { $ifNull: ['$nTimeLineDays', 0] },
                    nMinutes: { $ifNull: ['$nMinutes', 0] },
                    nCost: { $ifNull: ['$nCost', 0] },
                    nRemainingMinute: { $ifNull: ['$nRemainingMinute', 0] },
                    nRemainingCost: {
                      $cond: {
                        if: { $eq: [req.employee.bViewCost, true] },
                        then: { $ifNull: ['$nRemainingCost', 0] },
                        else: '$$REMOVE'
                      }
                    },
                    nNonBillableMinute: { $ifNull: ['$nNonBillableMinute', 0] },
                    nNonBillableCost: {
                      $cond: {
                        if: { $eq: [req.employee.bViewCost, true] },
                        then: { $ifNull: ['$nNonBillableCost', 0] },
                        else: '$$REMOVE'
                      }
                    },
                    sName: '$changeRequests.sName'
                  }
                }
              ],
              as: 'crIndicators'
            }
          }
          // {
          //   $lookup: {
          //     from: 'projectwisetechnologies',
          //     let: { project: '$_id' },
          //     pipeline: [
          //       {
          //         $match: {
          //           eStatus: 'Y',
          //           $expr: {
          //             $and: [
          //               { $eq: ['$iProjectId', '$$project'] }
          //             ]
          //           }
          //         }
          //       },
          //       {
          //         $lookup: {
          //           from: 'technologies',
          //           let: { technology: '$iTechnologyId' },
          //           pipeline: [
          //             {
          //               $match: {
          //                 eStatus: 'Y',
          //                 $expr: {
          //                   $and: [
          //                     { $eq: ['$_id', '$$technology'] }
          //                   ]
          //                 }
          //               }
          //             }
          //           ],
          //           as: 'technology'
          //         }
          //       },
          //       {
          //         $unwind: {
          //           path: '$technology',
          //           preserveNullAndEmptyArrays: true
          //         }
          //       },
          //       {
          //         $project: {
          //           _id: '$technology._id',
          //           sName: '$technology.sName',
          //           sKey: '$technology.sKey',
          //           sTextColor: '$technology.sTextColor',
          //           sBackGroundColor: '$technology.sBackGroundColor',
          //           iProjectId: 1
          //         }
          //       }
          //     ],
          //     as: 'projectWiseTechnology'
          //   }
          // },
          // {
          //   $lookup: {
          //     from: 'projectwisetags',
          //     let: { project: '$_id' },
          //     pipeline: [
          //       {
          //         $match: {
          //           eStatus: 'Y',
          //           $expr: {
          //             $and: [
          //               { $eq: ['$iProjectId', '$$project'] }
          //             ]
          //           }
          //         }
          //       },
          //       {
          //         $lookup: {
          //           from: 'projecttags',
          //           let: { projecttag: '$iProjectTagId' },
          //           pipeline: [
          //             {
          //               $match: {
          //                 eStatus: 'Y',
          //                 $expr: {
          //                   $and: [
          //                     { $eq: ['$_id', '$$projecttag'] }
          //                   ]
          //                 }
          //               }
          //             }
          //           ],
          //           as: 'projecttag'
          //         }
          //       },
          //       {
          //         $unwind: {
          //           path: '$projecttag',
          //           preserveNullAndEmptyArrays: true
          //         }
          //       },
          //       {
          //         $project: {
          //           _id: '$projecttag._id',
          //           sName: '$projecttag.sName',
          //           sKey: '$projecttag.sKey',
          //           sTextColor: '$projecttag.sTextColor',
          //           sBackGroundColor: '$projecttag.sBackGroundColor',
          //           iProjectId: 1
          //         }
          //       }
          //     ],
          //     as: 'projectWiseTag'
          //   }
          // }
        ]

        const projectIndicators = await Projects.aggregate(query)
        i.projectIndicator = projectIndicators[0]?.projectIndicator || {}
        i.projectDepartment = projectIndicators[0]?.projectDepartment || []
        // i.projectWiseTag = projectIndicators[0].projectWiseTag
        // i.projectWiseTechnology = projectIndicators[0].projectWiseTechnology
        // i.changerequests = projectIndicators[0].changeRequests
        i.crIndicators = projectIndicators[0].crIndicators

        if (i.eProjectType === 'Dedicated') {
          const q = [
            {
              $match: {
                eStatus: 'Y',
                iProjectId: i._id
              }
            },
            {
              $lookup: {
                from: 'departments',
                let: { department: '$iDepartmentId' },
                pipeline: [
                  {
                    $match: {
                      eStatus: 'Y',
                      $expr: {
                        $and: [
                          { $eq: ['$_id', '$$department'] }
                        ]
                      }
                    }
                  }
                ],
                as: 'department'
              }
            },
            {
              $unwind: {
                path: '$department',
                preserveNullAndEmptyArrays: true
              }
            },
            {
              $project: {
                _id: '$department._id',
                sName: '$department.sName',
                sBackGroundColor: '$department.sBackGroundColor',
                sTextColor: '$department.sTextColor',
                iProjectId: 1,
                nMinutes: { $ifNull: ['$nMinutes', '0'] },
                nCost: { $ifNull: ['$nCost', '0'] },
                nRemainingMinute: { $ifNull: ['$nRemainingMinute', '0'] },
                nRemainingCost: { $ifNull: ['$nRemainingCost', '0'] },
                nNonBillableMinute: { $ifNull: ['$nNonBillableMinute', '0'] },
                nNonBillableCost: { $ifNull: ['$nNonBillableCost', '0'] }
              }
            },
            {
              $group: {
                _id: {
                  _id: '$_id'
                },
                sName: { $first: '$sName' },
                sBackGroundColor: { $first: '$sBackGroundColor' },
                sTextColor: { $first: '$sTextColor' },
                iProjectId: { $first: '$iProjectId' },
                nMinutes: { $sum: '$nMinutes' },
                nCost: { $sum: '$nCost' },
                nRemainingMinute: { $sum: '$nRemainingMinute' },
                nRemainingCost: { $sum: '$nRemainingCost' },
                nNonBillableMinute: { $sum: '$nNonBillableMinute' },
                nNonBillableCost: { $sum: '$nNonBillableCost' }
              }
            },
            {
              $project: {
                _id: '$_id._id',
                sName: 1,
                sBackGroundColor: 1,
                sTextColor: 1,
                iProjectId: 1,
                nMinutes: 1,
                nCost: {
                  $cond: {
                    if: { $eq: [req.employee.bViewCost, true] },
                    then: { $ifNull: ['$nCost', 0] },
                    else: '$$REMOVE'
                  }
                },
                nRemainingMinute: 1,
                nRemainingCost: {
                  $cond: {
                    if: { $eq: [req.employee.bViewCost, true] },
                    then: { $ifNull: ['$nRemainingCost', 0] },
                    else: '$$REMOVE'
                  }
                },
                nNonBillableMinute: 1,
                nNonBillableCost: {
                  $cond: {
                    if: { $eq: [req.employee.bViewCost, true] },
                    then: { $ifNull: ['$nNonBillableCost', 0] },
                    else: '$$REMOVE'
                  }
                }
              }
            }
          ]
          const data = await ProjectwiseemployeeModel.aggregate(q)
          i.projectDepartment = (data.length > 0) ? data : []
        }

        all.push(i)

        // const cr = await ChangeRequestModel.find({ iProjectId: i._id, eStatus: 'Y' })
        // if (cr.length > 0) {
        //   i.changeRequest = cr.length
        // } else {
        //   i.changeRequest = 0
        // }
      }

      if (req.path === '/DownloadExcel') {
        return projects
      } else {
        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].project), { all, count: count[0]?.count || 0 })
      }
    } catch (error) {
      return catchError('DashBoard.indicator', error, req, res)
    }
  }

  async crIndicator(req, res) {
    try {
      const q = [
        {
          $match: { eStatus: 'Y' }
        }
      ]
      const data = await DashboardCrIndicatorModel.aggregate(q)
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].details), data)
    } catch (error) {
      return catchError('DashBoard.crIndicator', error, req, res)
    }
  }

  async updateProjectStatus(req, res) {
    try {
      const { id } = req.params
      const ProjectExist = await Projects.findOne({ _id: id, eStatus: 'Y' }).lean()
      if (!ProjectExist) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].not_exist.replace('##', messages[req.userLanguage].project))

      const { eProjectStatus } = req.body
      if (!['In Progress', 'Completed', 'On Hold', 'Cancelled', 'Pending', 'Closed'].includes(eProjectStatus)) return ErrorResponseSender(res, status.BadRequest, messages[req.userLanguage].invalid.replace('##', messages[req.userLanguage].status))
      const update = await Projects.findOneAndUpdate({ _id: id, eStatus: 'Y' }, { eProjectStatus }, { new: true }).lean()
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].project), update)
    } catch (error) {
      return catchError('DashBoard.updateProjectStatus', error, req, res)
    }
  }

  async projectsNearToEnd(req, res) {
    try {
      const { eShow = 'ALL', page = 0, limit = 5 } = req.query

      const employee = await EmployeeModel.findOne({ _id: req.employee._id }, { eShowAllProjects: 1 }).lean()

      if (!employee) return ErrorResponseSender(res, status.NotFound, messages[req.userLanguage].notFound.replace('##', 'Employee'))

      if (employee.eShowAllProjects === 'ALL' && eShow === 'ALL') {
        const latestFixedProjects = await Projects.aggregate([
          {
            $match: {
              eStatus: 'Y',
              eProjectStatus: { $in: ['In Progress'] },
              eProjectType: 'Fixed'
            }
          }, {
            $project: {
              _id: 1,
              sName: 1,
              sLogo: 1,
              eProjectStatus: 1,
              eProjectType: 1,
              dStartDate: { $ifNull: ['$dStartDate', new Date()] },
              dEndDate: { $ifNull: ['$dEndDate', new Date()] }
            }
          },
          {
            $project: {
              _id: 1,
              sName: 1,
              sLogo: 1,
              eProjectStatus: 1,
              eProjectType: 1,
              dStartDate: 1,
              dEndDate: 1,
              years: {
                $dateDiff:
                {
                  startDate: '$dStartDate',
                  endDate: '$dEndDate',
                  unit: 'year'
                }
              },
              months: {
                $dateDiff: {
                  startDate: '$dStartDate',
                  endDate: '$dEndDate',
                  unit: 'month'
                }
              },
              days: {
                $dateDiff: {
                  startDate: '$dStartDate',
                  endDate: '$dEndDate',
                  unit: 'day'
                }
              },
              hours: {
                $dateDiff: {
                  startDate: '$dStartDate',
                  endDate: '$dEndDate',
                  unit: 'hour'
                }
              },
              weeks: {
                $dateDiff: {
                  startDate: '$dStartDate',
                  endDate: '$dEndDate',
                  unit: 'week'
                }
              },
              milliseconds: {
                $dateDiff: {
                  startDate: '$dStartDate',
                  endDate: '$dEndDate',
                  unit: 'millisecond'
                }
              }
            }
          }
        ])

        const latestDedicatedProjects = await Projects.aggregate([
          {
            $match: {
              eStatus: 'Y',
              eProjectStatus: { $in: ['In Progress'] },
              eProjectType: 'Dedicated'
            }
          },
          {
            $project: {
              _id: 1,
              sName: 1,
              sLogo: 1,
              eProjectStatus: 1,
              eProjectType: 1,
              dStartDate: { $ifNull: ['$dContractStartDate', new Date()] },
              dEndDate: { $ifNull: ['$dContractEndDate', new Date()] }
            }
          },
          {
            $project: {
              _id: 1,
              sName: 1,
              sLogo: 1,
              eProjectStatus: 1,
              eProjectType: 1,
              dStartDate: 1,
              dEndDate: 1,
              years: {
                $dateDiff:
                {
                  startDate: '$dStartDate',
                  endDate: '$dEndDate',
                  unit: 'year'
                }
              },
              months: {
                $dateDiff: {
                  startDate: '$dStartDate',
                  endDate: '$dEndDate',
                  unit: 'month'
                }
              },
              days: {
                $dateDiff: {
                  startDate: '$dStartDate',
                  endDate: '$dEndDate',
                  unit: 'day'
                }
              },
              hours: {
                $dateDiff: {
                  startDate: '$dStartDate',
                  endDate: '$dEndDate',
                  unit: 'hour'
                }
              },
              weeks: {
                $dateDiff: {
                  startDate: '$dStartDate',
                  endDate: '$dEndDate',
                  unit: 'week'
                }
              },
              milliseconds: {
                $dateDiff: {
                  startDate: '$dStartDate',
                  endDate: '$dEndDate',
                  unit: 'millisecond'
                }
              }
            }
          }

        ])

        const data = [...latestFixedProjects, ...latestDedicatedProjects].sort((a, b) => new Date(a?.milliseconds) - new Date(b?.milliseconds)).slice(0, 5)

        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].project), { data, eShowAllProjects: employee.eShowAllProjects })
      } else {
        const totalProjectFixedId = new Set()
        const totalProjectsFixed = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y' }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectType: 'Fixed' } }).lean()

        if (totalProjectsFixed.length) {
          totalProjectsFixed.forEach(element => {
            if (element?.iProjectId) totalProjectFixedId.add(element.iProjectId._id.toString())
          })
        }

        const othersProjectFixed = await Projects.find({
          eStatus: 'Y',
          eProjectType: 'Fixed',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        })

        if (othersProjectFixed.length) {
          othersProjectFixed.forEach(element => {
            if (element?._id) totalProjectFixedId.add(element._id.toString())
          })
        }

        const totalProjectDedicatedId = new Set()

        const totalProjectsDedicated = await ProjectwiseemployeeModel.find({ iEmployeeId: ObjectId(req.employee._id), eStatus: 'Y' }).populate({ path: 'iProjectId', match: { eStatus: 'Y', eProjectType: 'Dedicated' } }).lean()

        if (totalProjectsDedicated.length) {
          totalProjectsDedicated.forEach(element => {
            if (element?.iProjectId) totalProjectDedicatedId.add(element.iProjectId._id.toString())
          })
        }

        const othersProjectDedicated = await Projects.find({
          eStatus: 'Y',
          eProjectType: 'Dedicated',
          $or: [
            { iBDId: ObjectId(req.employee._id) },
            { iBAId: ObjectId(req.employee._id) },
            { iProjectManagerId: ObjectId(req.employee._id) }
          ]
        })

        if (othersProjectDedicated.length) {
          othersProjectDedicated.forEach(element => {
            if (element?._id) totalProjectDedicatedId.add(element._id.toString())
          })
        }
        const latestFixedProjects = await Projects.aggregate([
          {
            $match: {
              eStatus: 'Y',
              eProjectStatus: { $in: ['In Progress'] },
              eProjectType: 'Fixed',
              _id: { $in: [...totalProjectFixedId].map(a => ObjectId(a)) }
            }
          }, {
            $project: {
              _id: 1,
              sName: 1,
              sLogo: 1,
              eProjectStatus: 1,
              eProjectType: 1,
              dStartDate: { $ifNull: ['$dStartDate', new Date()] },
              dEndDate: { $ifNull: ['$dEndDate', new Date()] }
            }
          },
          {
            $project: {
              _id: 1,
              sName: 1,
              sLogo: 1,
              eProjectStatus: 1,
              eProjectType: 1,
              dStartDate: 1,
              dEndDate: 1,
              years: {
                $dateDiff:
                {
                  startDate: '$dStartDate',
                  endDate: '$dEndDate',
                  unit: 'year'
                }
              },
              months: {
                $dateDiff: {
                  startDate: '$dStartDate',
                  endDate: '$dEndDate',
                  unit: 'month'
                }
              },
              days: {
                $dateDiff: {
                  startDate: '$dStartDate',
                  endDate: '$dEndDate',
                  unit: 'day'
                }
              },
              hours: {
                $dateDiff: {
                  startDate: '$dStartDate',
                  endDate: '$dEndDate',
                  unit: 'hour'
                }
              },
              weeks: {
                $dateDiff: {
                  startDate: '$dStartDate',
                  endDate: '$dEndDate',
                  unit: 'week'
                }
              },
              milliseconds: {
                $dateDiff: {
                  startDate: '$dStartDate',
                  endDate: '$dEndDate',
                  unit: 'millisecond'
                }
              }
            }
          }
        ])

        const latestDedicatedProjects = await Projects.aggregate([
          {
            $match: {
              eStatus: 'Y',
              eProjectStatus: { $in: ['In Progress'] },
              eProjectType: 'Dedicated',
              _id: { $in: [...totalProjectDedicatedId].map(a => ObjectId(a)) }
            }
          },
          {
            $project: {
              _id: 1,
              sName: 1,
              sLogo: 1,
              eProjectStatus: 1,
              eProjectType: 1,
              dStartDate: { $ifNull: ['$dContractStartDate', new Date()] },
              dEndDate: { $ifNull: ['$dContractEndDate', new Date()] }
            }
          },
          {
            $project: {
              _id: 1,
              sName: 1,
              sLogo: 1,
              eProjectStatus: 1,
              eProjectType: 1,
              dStartDate: 1,
              dEndDate: 1,
              years: {
                $dateDiff:
                {
                  startDate: '$dStartDate',
                  endDate: '$dEndDate',
                  unit: 'year'
                }
              },
              months: {
                $dateDiff: {
                  startDate: '$dStartDate',
                  endDate: '$dEndDate',
                  unit: 'month'
                }
              },
              days: {
                $dateDiff: {
                  startDate: '$dStartDate',
                  endDate: '$dEndDate',
                  unit: 'day'
                }
              },
              hours: {
                $dateDiff: {
                  startDate: '$dStartDate',
                  endDate: '$dEndDate',
                  unit: 'hour'
                }
              },
              weeks: {
                $dateDiff: {
                  startDate: '$dStartDate',
                  endDate: '$dEndDate',
                  unit: 'week'
                }
              },
              milliseconds: {
                $dateDiff: {
                  startDate: '$dStartDate',
                  endDate: '$dEndDate',
                  unit: 'millisecond'
                }
              }
            }
          }

        ])

        const data = [...latestFixedProjects, ...latestDedicatedProjects].sort((a, b) => new Date(b?.milliseconds) - new Date(a?.milliseconds)).slice(0, 5)

        return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].project), { data, eShowAllProjects: employee.eShowAllProjects })
      }
    } catch (error) {
      console.log(error)
    }
  }

  async dashboardProjectYears(req, res) {
    try {
      const yearlyProjects = await Projects.aggregate([
        {
          $match: {
            eStatus: 'Y',
            eProjectStatus: { $nin: ['Cancelled'] }
          }
        },
        {
          $project: {
            _id: 1,
            sName: 1,
            sLogo: 1,
            eProjectType: 1,
            dStartDate: {
              $cond: {
                if: { $eq: ['$eProjectType', 'Fixed'] },
                then: '$dStartDate',
                else: '$dContractStartDate'
              }
            }
          }
        },
        {
          $group: {
            _id: {
              $year: '$dStartDate'
            },
            dCreatedAt: { $first: '$dStartDate' },
            count: { $sum: 1 }
          }
        },
        {
          $sort: {
            _id: 1
          }
        },
        {
          $project: {
            _id: 0,
            year: '$_id',
            count: '$count',
            dCreatedAt: '$dCreatedAt'
          }
        }
      ])

      const yearData = calculateYear(yearlyProjects)
      return SuccessResponseSender(res, status.OK, messages[req.userLanguage].success.replace('##', messages[req.userLanguage].years), yearData)
    } catch (error) {
      return catchError('DashBoard.dashboardProjectYears', error, req, res)
    }
  }
}

module.exports = new DashBoard()
