const permissions = {}
const { rule } = require('graphql-shield')
const { getPermissions } = require('../Common/controllers')
const _ = require('../../../global')
// const { EventsModel } = require('../../model')

// permissions.isEditor = rule('validate editor')(async (parent, { input }, context) => {
//   try {
//     const { data } = getPermissions(context)

//     if (data.eType === 'su') return true

//     const { iEventId, iDisplayAuthorId } = input
//     const event = await EventsModel.findById(iEventId, { aEditors: 1, iCreatedBy: 1 }).lean()

//     if (event.aEditors.findIndex(ele => ele.id === data?.iAdminId.toString()) < 0 || data.iAdminId === event?.iCreatedBy) _.throwError('notEditorAcess', context)

//     return true
//   } catch (error) {
//     return error
//   }
// })

// permissions.isAuthor = rule('isAuthor')(async (parent, { input }, context) => {
//   try {
//     const { data } = getPermissions(context)

//     const { iEventId } = input
//     const event = await EventsModel.findById(iEventId, { aEditors: 1 }).lean()
//     if (!data.iAdminId !== event?.iCreatedBy) _.throwError('notAuthor', context)

//     return true
//   } catch (error) {
//     return error
//   }
// })

permissions.isListLiveEventAuthorized = rule('list Live events')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    console.log(data.aPermissions)
    if (data.eType === 'su') return true
    if (!data) _.throwError('listLiveEventNotAuthorised', context)
    if (!data.aPermissions) _.throwError('listLiveEventNotAuthorised', context)
    if (data.aPermissions.findIndex(ele => ele === 'LIST_LIVEEVENT') < 0) _.throwError('listLiveEventNotAuthorised', context)

    return true
  } catch (error) {
    return error
  }
})

permissions.isGetLiveEventAuthorized = rule('get live event')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    if (!data) _.throwError('getLiveEventNotAuthorised', context)
    if (!data.aPermissions) _.throwError('getLiveEventNotAuthorised', context)
    if ((data.aPermissions.findIndex(ele => ele === 'GET_LIVEEVENT') < 0)) _.throwError('getLiveEventNotAuthorised', context)

    return true
  } catch (error) {
    return error
  }
})

permissions.isAddLiveEventAuthorized = rule('add live event')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    if (!data) _.throwError('addLiveEventNotAuthorised', context)
    if (!data.aPermissions) _.throwError('addLiveEventNotAuthorised', context)
    if (data.aPermissions.findIndex(ele => ele === 'ADD_LIVEEVENT') < 0) _.throwError('addLiveEventNotAuthorised', context)

    return true
  } catch (error) {
    return error
  }
})

permissions.isEditLiveEventAuthorized = rule('edit live event')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true

    if (!data) _.throwError('editLiveEventNotAuthorised', context)
    if (!data.aPermissions) _.throwError('editLiveEventNotAuthorised', context)
    if (data.aPermissions.findIndex(ele => ele === 'EDIT_LIVEEVENT') < 0) _.throwError('editLiveEventNotAuthorised', context)

    return true
  } catch (error) {
    return error
  }
})

permissions.isDeleteLiveEventAuthorized = rule('delete live event')(async (parent, { input }, context) => {
  try {
    const { data } = getPermissions(context)

    if (data.eType === 'su') return true
    if (!data) _.throwError('deleteLiveEventNotAuthorised', context)
    if (!data.aPermissions) _.throwError('deleteLiveEventNotAuthorised', context)
    if (data.aPermissions.findIndex(ele => ele === 'DELETE_LIVEEVENT') < 0) _.throwError('deleteLiveEventNotAuthorised', context)

    return true
  } catch (error) {
    return error
  }
})

module.exports = permissions
