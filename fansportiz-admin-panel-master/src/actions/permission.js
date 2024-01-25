import axios from '../axios'
import { ADD_PERMISSION_MATCH, CLEAR_PERMISSION_MESSAGE, PERMISSION_DETAILS, PERMISSION_LIST, PERMISSION_STATUS_LIST, UPDATE_PERMISSION } from './constants'
const errMsg = 'Server is unavailable.'

export const addPermission = (sName, sKey, eStatus, token) => async (dispatch) => {
  dispatch({ type: CLEAR_PERMISSION_MESSAGE })
  await axios.post('/permission/v1', {
    sName, sKey, eStatus
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: ADD_PERMISSION_MATCH,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: ADD_PERMISSION_MATCH,
      payload: {
        resStatus: false,
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : errMsg
      }
    })
  })
}

export const updatePermission = (updatedPermissionData) => async (dispatch) => {
  dispatch({ type: CLEAR_PERMISSION_MESSAGE })
  const { Name, Key, permissionStatus, ID, token } = updatedPermissionData
  await axios.put(`/permission/${ID}/v1`, {
    sName: Name, sKey: Key, eStatus: permissionStatus
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_PERMISSION,
      payload: {
        data: response.data && response.data.data,
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_PERMISSION,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message || error.response.data.errors[0].msg + ' of ' + error.response.data.errors[0].param : errMsg
      }
    })
  })
}

export const getPermissionList = (token) => async (dispatch) => {
  await axios.get('/permission/list/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: PERMISSION_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: PERMISSION_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getYStatusPermissionList = (token) => async (dispatch) => {
  await axios.get('/permission/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: PERMISSION_STATUS_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: PERMISSION_STATUS_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getPermissionDetails = (Id, token) => async (dispatch) => {
  await axios.get(`/permission/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: PERMISSION_DETAILS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: PERMISSION_DETAILS,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const clearPermissionMsg = () => (dispatch) => {
  dispatch({ type: CLEAR_PERMISSION_MESSAGE })
}
