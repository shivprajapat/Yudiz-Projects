import axios from 'axios'
import constants from '../../Shared/Types/constants'

export const addSoftwareMetricsAction = (softwareMetricsData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADD_SOFTWARE_METRICS_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/software-metrix/create`, softwareMetricsData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.ADD_SOFTWARE_METRICS_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.messages,
        isSoftwareMetricsAdded: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.ADD_SOFTWARE_METRICS_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isSoftwareMetricsAdded: false
      }
    })
  })
}

export const getAllSoftwareMetricsListAction = (start, limit, sort, order, search, token) => (dispatch) => {
  const data = {
    start,
    limit,
    sort,
    order,
    search
  }
  dispatch({ type: constants.CLEAR_GET_ALL_SOFTWARE_METRICS_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/software-metrixs`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_SOFTWARE_METRICS_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        softwareMetricsList: response?.data?.data?.rows,
        softwareMetricsCount: response?.data?.data?.count
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_SOFTWARE_METRICS_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

export const getSpecificsoftwareMetricsData = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_SPECIFIC_SOFTWARE_METRICS })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/software-metrix`, { id }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_SPECIFIC_SOFTWARE_METRICS,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        resData: response.data.data,
        isSoftMatricsUpdate: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_SPECIFIC_SOFTWARE_METRICS,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        specificsoftwareMetricsData: false,
        isSoftMatricsUpdate: false
      }
    })
  })
}

export const editSpecificSoftwareMetrics = (softwareMetricsData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EDIT_SPECIFIC_SOFTWARE_METRICS })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/software-metrix/update`, softwareMetricsData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_SOFTWARE_METRICS,
      payload: {
        resStatus: true,
        resMessage: response.data?.messages,
        isSoftwareMetricsEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_SOFTWARE_METRICS,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isSoftwareMetricsEdited: false
      }
    })
  })
}

export const deleteSoftwareMetrics = (softwareMetricsData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_SOFTWARE_METRICS })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/software-metrix/delete`, softwareMetricsData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.DELETE_SOFTWARE_METRICS,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isDeleted: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.DELETE_SOFTWARE_METRICS,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isDeleted: false
      }
    })
  })
}

export const deleteSoftwareMetricsDetail = (softwareMetricsData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_SOFTWARE_METRICS_DETAIL })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/software-metrix-detail/delete`, softwareMetricsData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.DELETE_SOFTWARE_METRICS_DETAIL,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isDeleted: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.DELETE_SOFTWARE_METRICS_DETAIL,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isDeleted: false
      }
    })
  })
}
