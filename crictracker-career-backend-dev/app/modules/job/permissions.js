const { rule } = require('graphql-shield')
const { getPermissions } = require('../Common/common')
const _ = require('../../../global')

const permissions = {}

permissions.isCreateJobAuthorized = rule('Create Job')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    if (!data) _.throwError('createJobNotAuthorized', context)
    if (!data.aPermissions) _.throwError('createJobNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'CREATE_JOB') < 0) _.throwError('createJobNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isEditJobAuthorized = rule('Edit Job')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    console.log(data.oRole)
    if (!data) _.throwError('editJobNotAuthorized', context)
    if (!data.aPermissions) _.throwError('editJobNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'EDIT_JOB') < 0) _.throwError('editJobNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isGetJobAuthorized = rule('Get Job')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    if (!data) _.throwError('getJobNotAuthorized', context)
    if (!data.aPermissions) _.throwError('getJobNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'GET_JOB') < 0) _.throwError('getJobNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isListJobAuthorized = rule('List Jobs')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)
    if (data.eType === 'su') return true
    if (!data) _.throwError('listJobNotAuthorized', context)
    if (!data.aPermissions) _.throwError('listJobNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'LIST_JOB') < 0) _.throwError('listJobNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isDeleteJobAuthorized = rule('Delete Job')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    if (!data) _.throwError('deleteJobNotAuthorized', context)
    if (!data.aPermissions) _.throwError('deleteJobNotAuthorized', context)
    if (data.aPermissions.findIndex(ele => ele === 'DELETE_JOB') < 0) _.throwError('deleteJobNotAuthorized', context)
    return true
  } catch (error) {
    return error
  }
})

permissions.isUpdateJobStatusAuthorized = rule('Update Job Status')(async (parent, { input }, context) => {
  try {
    const { data } = await getPermissions(context)

    if (input?.eStatus === 'd') {
      if (data.eType === 'su') return true
      if (!data) _.throwError('deleteJobNotAuthorized', context)
      if (!data.aPermissions) _.throwError('deleteJobNotAuthorized', context)
      if (data.aPermissions.findIndex(ele => ele === 'DELETE_JOB') < 0) _.throwError('deleteJobNotAuthorized', context)
    } else {
      if (!data) _.throwError('updateJobStatusNotAuthorized', context)
      if (data?.eType === 'su') return true
      if (!data?.aPermissions) _.throwError('updateJobStatusNotAuthorized', context)
      if (data?.aPermissions.findIndex(ele => ele === 'UPDATE_JOB_STATUS') < 0) _.throwError('updateJobStatusNotAuthorized', context)
    }
    return true
  } catch (error) {
    return error
  }
})

module.exports = permissions
