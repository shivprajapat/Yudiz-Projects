import axios from '../axios'
import { ADD_PUSH_NOTIFICATION, CLEAR_PUSHNOTIFICATION_MESSAGE, GET_PUSH_NOTIFICATION_DETAILS, AUTOMATED_PUSH_NOTIFICATION_LIST, UPDATE_PUSH_NOTIFICATION, PUSH_NOTIFICATION_LIST } from './constants'

const errMsg = 'Server is unavailable.'

export const AddPushNotification = (addPushNotificationData) => async (dispatch) => {
  const { title, description, Type, date, hour, minutes, seconds, token } = addPushNotificationData
  dispatch({ type: CLEAR_PUSHNOTIFICATION_MESSAGE })
  await axios.post('/push-notification/v1', {
    sTitle: title,
    sMessage: description,
    sTopic: Type,
    dExpTime: date,
    nHours: hour,
    nMinutes: minutes,
    nSeconds: seconds
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: ADD_PUSH_NOTIFICATION,
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: ADD_PUSH_NOTIFICATION,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const pushNotificationList = (listData) => async (dispatch) => {
  const { start, limit, sort, search, startDate, endDate, platform, orderby, token } = listData
  dispatch({ type: CLEAR_PUSHNOTIFICATION_MESSAGE })
  await axios.get(`/push-notification-list/v1?start=${start}&limit=${limit}&sort=${sort}&search=${search}&dateFrom=${startDate}&dateTo=${endDate}&platform=${platform}&order=${orderby}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: PUSH_NOTIFICATION_LIST,
      payload: {
        data: response?.data?.data[0] ? response?.data?.data[0] : [],
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: PUSH_NOTIFICATION_LIST,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const automatedPushNotificationList = (token) => async (dispatch) => {
  dispatch({ type: CLEAR_PUSHNOTIFICATION_MESSAGE })
  await axios.get('/notification-message-list/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: AUTOMATED_PUSH_NOTIFICATION_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: AUTOMATED_PUSH_NOTIFICATION_LIST,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const getPushNotificationDetails = (id, token) => async (dispatch) => {
  dispatch({ type: CLEAR_PUSHNOTIFICATION_MESSAGE })
  await axios.get(`/notification-message/${id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_PUSH_NOTIFICATION_DETAILS,
      payload: {
        data: response.data.data ? response.data.data : [],
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: GET_PUSH_NOTIFICATION_DETAILS,
      payload: {
        data: [],
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const updatePushNotification = (notificationData) => async (dispatch) => {
  dispatch({ type: CLEAR_PUSHNOTIFICATION_MESSAGE })
  const { heading, key, description, platform, notificationStatus, token, notificationId } = notificationData
  await axios.put(`/notification-message/${notificationId}/v1`, {
    sHeading: heading,
    sDescription: description,
    ePlatform: platform,
    eKey: key,
    bEnableNotifications: notificationStatus === 'Y'
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_PUSH_NOTIFICATION,
      payload: {
        resMessage: response.data.message,
        resStatus: true,
        isUpdateNotification: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_PUSH_NOTIFICATION,
      payload: {
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : 'Server is unavailable.',
        resStatus: false,
        isUpdateNotification: false
      }
    })
  })
}
