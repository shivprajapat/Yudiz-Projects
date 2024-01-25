import axios from '../axios'
import { catchFunc, successFunc } from '../helpers/helper'
import { ADD_NOTIFICATION, ADD_TIME_NOTIFICATION, ADD_USER_NOTIFICATION, CLEAR_NOTIFICATIONS_MESSAGE, DELETE_NOTIFICATION, GET_NOTIFICATION_DETAILS, NOTIFICATION_LIST, TYPE_LIST, UPDATE_NOTIFICATION } from './constants'

const errMsg = 'Server is unavailable.'

export const AddNotification = (userId, sTitle, sMessage, iType, token) => async (dispatch) => {
  await axios.post('/notification/types/v1', {
    iUserId: userId, sTitle, sMessage, iType
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: ADD_NOTIFICATION,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: ADD_NOTIFICATION,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const AddUserNotification = (userId, sTitle, sMessage, iType, token) => async (dispatch) => {
  dispatch({ type: CLEAR_NOTIFICATIONS_MESSAGE })
  await axios.post('/notification/v1', {
    iUserId: userId, sTitle, sMessage, iType
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: ADD_USER_NOTIFICATION,
      payload: {
        data: response.data.data ? response.data.data : [],
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: ADD_USER_NOTIFICATION,
      payload: {
        data: [],
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const AddTimeNoti = (sTitle, sMessage, iType, dExpTime, token) => async (dispatch) => {
  dispatch({ type: CLEAR_NOTIFICATIONS_MESSAGE })
  await axios.post('/notification/timed/v1', {
    sTitle, sMessage, iType, dExpTime: new Date(dExpTime).toISOString()
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: ADD_TIME_NOTIFICATION,
      payload: {
        data: response.data.data ? response.data.data : [],
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: ADD_TIME_NOTIFICATION,
      payload: {
        data: [],
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export const TypeList = token => async (dispatch) => {
  await axios.get('/notification/types/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: TYPE_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: TYPE_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const notificationsList = (data) => async (dispatch) => {
  dispatch({ type: CLEAR_NOTIFICATIONS_MESSAGE })
  const { start, limit, sort, order, search, notificationType, dateFrom, dateTo, token } = data
  await axios.get(`/notification/list/v1?start=${start}&limit=${limit}&sort=${sort}&order=${order}&iType=${notificationType}&search=${search}&dateFrom=${dateFrom}&dateTo=${dateTo}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: NOTIFICATION_LIST,
      payload: {
        data: response.data.data[0] ? response.data.data[0] : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: NOTIFICATION_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getNotificationDetails = (notificationId, token) => async (dispatch) => {
  dispatch({ type: CLEAR_NOTIFICATIONS_MESSAGE })
  await axios.get(`/notification/${notificationId}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_NOTIFICATION_DETAILS,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: GET_NOTIFICATION_DETAILS,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const updateNotification = (notificationData) => async (dispatch) => {
  dispatch({ type: CLEAR_NOTIFICATIONS_MESSAGE })
  const { title, notificationMessage, notificationType, expireTime, token, notificationId } = notificationData
  await axios.put(`/notification/${notificationId}/v1`, {
    sTitle: title,
    sMessage: notificationMessage,
    iType: notificationType,
    dExpTime: expireTime
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_NOTIFICATION,
      payload: {
        data: response.data.data,
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_NOTIFICATION,
      payload: {
        data: {},
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : 'Server is unavailable.',
        resStatus: false
      }
    })
  })
}

export const deleteNotification = (notificationId, token) => async (dispatch) => {
  dispatch({ type: CLEAR_NOTIFICATIONS_MESSAGE })
  await axios.delete(`/notification/${notificationId}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch(successFunc(DELETE_NOTIFICATION, response))
  }).catch((error) => {
    dispatch(catchFunc(DELETE_NOTIFICATION, error))
  })
}
