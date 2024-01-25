import axios from '../../axios/instanceAxios'
import {
  GET_NOTIFICATION,
  NOTIFICATION_COUNT,
  CLEAR_NOTIFICATION_MESSAGE,
  NOTIFICATION_TYPE_LIST
} from '../constants'
const errMsg = 'Server is unavailable.'

export const GetNotification = (Filters, limit, skip, token) => async (dispatch) => { // notification list
  dispatch({ type: CLEAR_NOTIFICATION_MESSAGE })
  await axios.post('/notification/user/notification/list/v1', { aFilters: Filters, nLimit: limit, nSkip: skip }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_NOTIFICATION,
      payload: {
        data: response.data.data,
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: GET_NOTIFICATION,
      payload: {
        data: [],
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const GetNotificationCount = (token) => async (dispatch) => { // Notification count
  dispatch({ type: CLEAR_NOTIFICATION_MESSAGE })
  await axios.get('/notification/user/notification/unread-count/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: NOTIFICATION_COUNT,
      payload: {
        nCount: response.data.data,
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: NOTIFICATION_COUNT,
      payload: {
        nCount: [],
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const GetFilterList = (token) => async (dispatch) => { // filter list
  dispatch({ type: CLEAR_NOTIFICATION_MESSAGE })
  await axios.get('/notification/user/notification/types/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: NOTIFICATION_TYPE_LIST,
      payload: {
        notificationTypeList: response.data.data,
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: NOTIFICATION_TYPE_LIST,
      payload: {
        notificationTypeList: [],
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}
