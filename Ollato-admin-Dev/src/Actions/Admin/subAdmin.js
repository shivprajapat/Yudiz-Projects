import axios from 'axios'
import constants from '../../Shared/Types/constants'

export const addSubAdminAction = (subAdminData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADD_SUBADMIN_DATA })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/role-admin/create`,
      subAdminData,
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: constants.ADD_SUBADMIN_DATA,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          isSubAdminAdded: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.ADD_SUBADMIN_DATA,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isSubAdminAdded: false
        }
      })
    })
}

// Get all Profile Detail for Front-end
export const getAllRoleSelect = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_ROLE_SELECT })
  axios
    .get(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/role/get-all-frontend`,
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: constants.GET_ALL_ROLE_SELECT,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          roleData: response?.data?.data
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.GET_ALL_ROLE_SELECT,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message
        }
      })
    })
}

// Get All Subadmin Action
export const getAllSubAdminListAction =
  (start, limit, sort, order, search, token) => (dispatch) => {
    const data = {
      start,
      limit,
      sort,
      order,
      search
    }
    dispatch({ type: constants.CLEAR_GET_ALL_SUBADMIN_DATA })
    axios
      .post(
        `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/role-admin/list`,
        data,
        { headers: { Authorization: token } }
      )
      .then((response) => {
        dispatch({
          type: constants.GET_ALL_SUBADMIN_DATA,
          payload: {
            resStatus: true,
            resMessage: response.data.message,
            subAdminList: response.data.data.rows,
            subAdminCount: response.data.data.count
          }
        })
      })
      .catch((error) => {
        dispatch({
          type: constants.GET_ALL_SUBADMIN_DATA,
          payload: {
            resStatus: false,
            resMessage: error?.response?.data?.message
          }
        })
      })
  }

export const getSpecificSubAdmin = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_SPECIFIC_SUBADMIN })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/role-admin/get-by-id`, { id }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_SPECIFIC_SUBADMIN,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        resData: response.data.data
        // isSubAdminUpdated: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_SPECIFIC_SUBADMIN,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
        // specificSubAdminData: false
        // isSubAdminUpdated: false
      }
    })
  })
}

export const editSpecificSubAdmin = (subAdminData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EDIT_SPECIFIC_SUBADMIN })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/role-admin/update`, subAdminData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_SUBADMIN,
      payload: {
        resStatus: true,
        resMessage: response.data?.message,
        isSubAdminEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_SUBADMIN,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isSubAdminEdited: false
      }
    })
  })
}

export const deleteSubAdmin = (subAdminData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_SUBADMIN })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/role-admin/delete`, subAdminData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.DELETE_SUBADMIN,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isDeleted: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.DELETE_SUBADMIN,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isDeleted: false
      }
    })
  })
}
