import { ADD_NOTIFICATION, ADD_TIME_NOTIFICATION, ADD_USER_NOTIFICATION, CLEAR_NOTIFICATIONS_MESSAGE, DELETE_NOTIFICATION, GET_NOTIFICATION_DETAILS, NOTIFICATION_LIST, TYPE_LIST, UPDATE_NOTIFICATION } from '../actions/constants'
import { commonReducer } from '../helpers/helper'

export default (state = {}, action = {}) => {
  switch (action.type) {
    case TYPE_LIST:
      return {
        ...state,
        typeList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case ADD_NOTIFICATION:
      return {
        ...state,
        addedNotification: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case ADD_USER_NOTIFICATION:
      return {
        ...state,
        addedUserNotification: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case ADD_TIME_NOTIFICATION:
      return {
        ...state,
        addTimeNotification: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case NOTIFICATION_LIST:
      return {
        ...state,
        notificationsList: action.payload.data,
        resStatus: action.payload.resStatus
      }
    case GET_NOTIFICATION_DETAILS:
      return {
        ...state,
        notificationDetails: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case UPDATE_NOTIFICATION:
      return {
        ...state,
        notificationDetails: action.payload.data,
        resMessage: action.payload.resMessage,
        resStatus: action.payload.resStatus
      }
    case DELETE_NOTIFICATION:
      return commonReducer(state, action)
    case CLEAR_NOTIFICATIONS_MESSAGE:
      return {
        ...state,
        resMessage: ''
      }
    default:
      return state
  }
}
