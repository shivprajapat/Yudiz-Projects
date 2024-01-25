import axios from 'axios'
import constants from '../../Shared/Types/constants'

export const addRoleAction = (roleData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADD_ROLE })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/role/create`, roleData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.ADD_ROLE,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isRoleAdded: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.ADD_ROLE,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isRoleAdded: false
      }
    })
  })
}

export const getAllRoleAction = (start, limit, sort, order, search, token) => (dispatch) => {
  const data = {
    start,
    limit,
    sort,
    order,
    search
  }
  dispatch({ type: constants.CLEAR_GET_ALL_ROLE })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/roles`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_ROLE,
      payload: {
        resStatus: true,
        roleList: response?.data?.data?.rows,
        roleCount: response.data.data?.count
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_ROLE,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

// Get All Module front-end
export const getAllModuleAction = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_MODULE })
  axios.get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/modules/get-all-frontend`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_MODULE,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        moduleData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_MODULE,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

export const getSpecificRoleData = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_SPECIFIC_ROLE })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/role/get-role-by-id`, { id }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_SPECIFIC_ROLE,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        resData: response.data.data
        // isRoleUpdated: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_SPECIFIC_ROLE,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        specificroleData: false
        // isRoleUpdated: false
      }
    })
  })
}

export const editSpecificRole = (roleData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EDIT_SPECIFIC_ROLE })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/role/update`, roleData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_ROLE,
      payload: {
        resStatus: true,
        resMessage: response.data?.message,
        isRoleEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_ROLE,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isRoleEdited: false
      }
    })
  })
}

export const deleteRole = (roleData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_ROLE })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/role/delete`, roleData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.DELETE_ROLE,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isDeleted: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.DELETE_ROLE,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isDeleted: false
      }
    })
  })
}
