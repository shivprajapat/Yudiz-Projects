import { ADD_PUSH_NOTIFICATION, CLEAR_PUSHNOTIFICATION_MESSAGE, GET_PUSH_NOTIFICATION_DETAILS, AUTOMATED_PUSH_NOTIFICATION_LIST, UPDATE_PUSH_NOTIFICATION, PUSH_NOTIFICATION_LIST } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = { }, action = {}) => {
  switch (action.type) {
    case ADD_PUSH_NOTIFICATION:
      return commonReducer(state, action)
    case PUSH_NOTIFICATION_LIST:
      return {
        ...state,
        pushNotificationList: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case AUTOMATED_PUSH_NOTIFICATION_LIST:
      return {
        ...state,
        automatedPushNotificationList: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case GET_PUSH_NOTIFICATION_DETAILS:
      return {
        ...state,
        pushNotificationDetails: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case UPDATE_PUSH_NOTIFICATION:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        type: action.payload.type,
        isUpdateNotification: action.payload.isUpdateNotification
      }
    case CLEAR_PUSHNOTIFICATION_MESSAGE:
      return {
        resMessage: '',
        isUpdateNotification: null
      }
    default:
      return state
  }
}
