const { permissions, roles, adminroles, admins } = require('../../../model')
const _ = require('../../../../global')

const controllers = {}

controllers.getPermissions = async (parent, { input }, context) => {
  try {
    const getPermissions = await permissions.find({}).lean()
    return getPermissions
  } catch (error) {
    return error
  }
}

controllers.addRole = async (parent, { input }, context) => {
  try {
    input = _.pick(input, ['sName', 'aPermissions', 'aParent', 'bIsDefault'])
    const { sName, aPermissions, aParent, bIsDefault } = input

    const insertQuery = { sName, aPermissions, aParent }
    if (bIsDefault) Object.assign(insertQuery, { bIsDefault })

    const role = await roles.create(insertQuery)
    const getRole = await roles.findOne({ _id: role._id }).populate('aPermissions').populate('aParent').lean()

    return _.resolve('addSuccess', { oData: getRole }, 'role', context)
  } catch (error) {
    return error
  }
}

controllers.getRoles = async (parent, { input }, context) => {
  try {
    const nTotal = await roles.countDocuments({})
    const aResults = await roles.find({}, { _id: 1, sName: 1, aPermissions: 1, aParent: 1, dUpdated: 1 }).populate('aPermissions').populate('aParent').sort({ dCreated: -1 }).lean()
    return { nTotal, aResults }
  } catch (error) {
    return error
  }
}

controllers.getRoleById = async (parent, { input }, context) => {
  try {
    if (!input) _.throwError('requiredField', context)

    const role = await roles.findById(input._id, { _id: 1, sName: 1, aPermissions: 1, aParent: 1, dUpdated: 1, bIsDefault: 1 }).populate('aPermissions').populate('aParent').lean()
    if (!role) _.throwError('notFound', context, 'role')
    return role
  } catch (error) {
    return error
  }
}

controllers.deleteRole = async (parent, { input }, context) => {
  try {
    const { _id } = input
    const deleteRole = await roles.deleteOne({ _id })
    if (!deleteRole.deletedCount) return _.resolve('roleAlreadyDeleted', null, null, context)
    return _.resolve('roleDeleteSuccess', null, null, context)
  } catch (error) {
    return error
  }
}

controllers.editRole = async (parent, { input }, context) => {
  try {
    input = _.pick(input, ['_id', 'sName', 'bIsDefault', 'aPermissions', 'aParent'])
    const { _id, sName, bIsDefault, aPermissions, aParent } = input

    const updateQuery = {
      sName,
      bIsDefault,
      aParent,
      aPermissions
    }

    const role = await roles.findOneAndUpdate({ _id }, updateQuery, { new: true }).populate('aPermissions').populate('aParent').lean()
    if (!role) _.throwError('notFound', context, 'role')

    return _.resolve('roleEditSuccess', { oData: role }, null, context)
  } catch (error) {
    return error
  }
}

controllers.getDefaultRoles = async (parent, { input }, context) => {
  try {
    const query = {
      bIsDefault: true,
      eStatus: 'a'
    }
    const role = await roles.find(query, { _id: 1, sName: 1, aPermissions: 1, aParent: 1, dUpdated: 1 }).populate('aPermissions').populate('aParent').sort({ dCreated: -1 }).lean()
    return role
  } catch (error) {
    return error
  }
}

controllers.getUserPermissions = async (parent, { input }, context) => {
  try {
    const { decodedToken } = context
    const { iAdminId } = decodedToken

    const admin = await admins.findOne({ _id: iAdminId }, { eType: 1 }).lean()
    if (!admin) _.throwError('notFound', context, 'user')

    let data
    if (admin?.eType === 'su') {
      const permissionData = await permissions.find({}).lean()
      data = permissionData.map(p => {
        return p.eKey
      })
    } else {
      const adminPermissions = await adminroles.findOne({ iAdminId: _.mongify(iAdminId) }, { 'aPermissions.iPermissionId': 1 }).populate({ path: 'aPermissions.iPermissionId', select: 'eKey' }).lean()

      data = adminPermissions.aPermissions.map(p => {
        return p.iPermissionId.eKey
      })
    }

    return data
  } catch (error) {
    return error
  }
}

module.exports = controllers
