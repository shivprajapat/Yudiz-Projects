import { CLEAR_GET_PUSH_NOTIFICATIONS_RESPONSE, GET_PUSH_NOTIFICATIONS, INSERT_PUSH_NOTIFICATION } from './action'

export const notifications = (state = {}, action = {}) => {
  let updatedNotification = {}
  switch (action.type) {
    case GET_PUSH_NOTIFICATIONS:
      return {
        ...state,
        pushNotifications: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        resError: action.payload.resError
      }
    case CLEAR_GET_PUSH_NOTIFICATIONS_RESPONSE:
      return {
        pushNotifications: {},
        resStatus: false,
        resMessage: '',
        resError: null
      }
    case INSERT_PUSH_NOTIFICATION:
      updatedNotification = state.pushNotifications
      updatedNotification.notifications = state.pushNotifications?.notifications?.concat(action.payload.data) || [action.payload.data]
      return {
        ...state,
        pushNotifications: updatedNotification
      }
    default:
      return state
  }
}
