import {
  GET_NOTIFICATION,
  NOTIFICATION_COUNT,
  NOTIFICATION_TYPE_LIST,
  CLEAR_NOTIFICATION_MESSAGE
} from '../constants'

export default (state = {}, action) => {
  switch (action.type) {
    case GET_NOTIFICATION:
      return {
        ...state,
        notificationList: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case NOTIFICATION_COUNT:
      return {
        ...state,
        nCount: action.payload.nCount,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case NOTIFICATION_TYPE_LIST:
      return {
        ...state,
        notificationTypeList: action.payload.notificationTypeList,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_NOTIFICATION_MESSAGE:
      return {
        ...state,
        resMessage: '',
        resStatus: null
      }
    default:
      return state
  }
}
