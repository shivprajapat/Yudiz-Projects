import axios from 'axios'
import constants from '../../Shared/Types/constants'

export const getAllPackageListAction = (start, limit, sort, order, search, token) => (dispatch) => {
  const data = {
    start,
    limit,
    sort,
    order,
    search
  }
  dispatch({ type: constants.CLEAR_GET_ALL_PACKAGE_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/packages`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_PACKAGE_DATA,
      payload: {
        resStatus: true,
        resMessage: response?.data?.message,
        packageList: response?.data?.data?.rows,
        packageCount: response.data?.data?.count
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_PACKAGE_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

export const addPackageAction = (packageData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADD_PACKAGE_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/package/create`, packageData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.ADD_PACKAGE_DATA,
      payload: {
        resStatus: true,
        resMessage: response?.data?.message,
        isPackageAdded: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.ADD_PACKAGE_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isPackageAdded: false
      }
    })
  })
}

export const getSpecificPackageData = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_SPECIFIC_PACKAGE })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/package/get`, { id }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_SPECIFIC_PACKAGE,
      payload: {
        resStatus: true,
        resMessage: response?.data?.message,
        resData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_SPECIFIC_PACKAGE,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

export const editSpecificPackage = (packageData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EDIT_SPECIFIC_PACKAGE })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/package/update`, packageData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_PACKAGE,
      payload: {
        resStatus: true,
        resMessage: response.data?.message,
        isPackageEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_PACKAGE,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isPackageEdited: false
      }
    })
  })
}

export const deletePackage = (packageData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_PACKAGE })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/package/delete`, packageData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.DELETE_PACKAGE,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isDeleted: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.DELETE_PACKAGE,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isDeleted: false
      }
    })
  })
}

export const packageStatus = (packageData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_PACKAGE })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/package/delete`, packageData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.DELETE_PACKAGE,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isDeleted: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.DELETE_PACKAGE,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isDeleted: false
      }
    })
  })
}
