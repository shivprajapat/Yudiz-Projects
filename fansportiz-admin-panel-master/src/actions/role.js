import axios from '../axios'
import { catchFunc, successFunc } from '../helpers/helper'
import { ACTIVE_ROLE_LIST, ADD_ROLE, CLEAR_ROLE_MESSAGE, DELETE_ROLE, ROLE_DETAILS, ROLE_LIST, UPDATE_ROLE } from './constants'
const errMsg = 'Server is unavailable.'

export const getRolesList = (data) => async (dispatch) => {
  const { start, limit, search, token } = data
  await axios.get(`/role/list/v1?start=${start}&limit=${limit}&search=${search}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: ROLE_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: ROLE_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const geActiveRolesList = (token) => async (dispatch) => {
  await axios.get('/role/v1', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: ACTIVE_ROLE_LIST,
      payload: {
        data: response.data.data ? response.data.data : [],
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: ACTIVE_ROLE_LIST,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const getRoleDetails = (roleId, token) => async (dispatch) => {
  await axios.get(`/role/${roleId}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: ROLE_DETAILS,
      payload: {
        data: response.data.data,
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: ROLE_DETAILS,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}

export const addRole = (addRoleData) => async (dispatch) => {
  const { name, roleStatus, permissions, token } = addRoleData
  dispatch({ type: CLEAR_ROLE_MESSAGE })
  await axios.post('/role/v1', {
    sName: name,
    aPermissions: permissions,
    eStatus: roleStatus
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: ADD_ROLE,
      payload: {
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: ADD_ROLE,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const updateRole = (updateRoleData) => async (dispatch) => {
  const { name, roleStatus, permissions, roleId, token } = updateRoleData
  dispatch({ type: CLEAR_ROLE_MESSAGE })
  await axios.put(`/role/${roleId}/v1`, {
    sName: name,
    aPermissions: permissions,
    eStatus: roleStatus
  }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: UPDATE_ROLE,
      payload: {
        data: response.data.data,
        resStatus: true,
        resMessage: response.data.message
      }
    })
  }).catch((error) => {
    dispatch({
      type: UPDATE_ROLE,
      payload: {
        data: {},
        resStatus: false,
        resMessage: error.response ? error.response.data.message : errMsg
      }
    })
  })
}

export const deleteRole = (Id, token) => async (dispatch) => {
  dispatch({ type: CLEAR_ROLE_MESSAGE })
  await axios.delete(`/role/${Id}/v1`, { headers: { Authorization: token } }).then((response) => {
    dispatch(successFunc(DELETE_ROLE, response))
  }).catch((error) => {
    dispatch(catchFunc(DELETE_ROLE, error))
  })
}
