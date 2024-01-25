import axios from 'axios'
import constants from '../../Shared/Types/constants'

/* Add Qualification Functionality */
export const addQualificationAction = (qualificationData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADD_QUALIFICATION_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/qualification/create`, qualificationData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.ADD_QUALIFICATION_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isQualificationAdded: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.ADD_QUALIFICATION_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isQualificationAdded: false
      }
    })
  })
}

/* Get all Qualification Functionality */
export const getAllQualificationAction = (start, limit, sort, order, search, token) => (dispatch) => {
  const data = {
    start,
    limit,
    sort,
    order,
    search
  }
  dispatch({ type: constants.CLEAR_GET_ALL_QUALIFICATIONS_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/qualification/get-all-qualification`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_QUALIFICATIONS_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        qualificationData: response.data.data,
        count: response.data.total
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_QUALIFICATIONS_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

export const getSpecificQualificationData = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_SPECIFIC_QUALIFICATIONS_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/qualification/get-qualification-by-id`, { id }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_SPECIFIC_QUALIFICATIONS_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        specificQualificationData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_SPECIFIC_QUALIFICATIONS_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

export const editSpecificQualification = (qualificationData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EDIT_SPECIFIC_QUALIFICATION_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/qualification/update`, qualificationData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_QUALIFICATION_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data?.message,
        isQulificationEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_QUALIFICATION_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isQualificationEdited: false,
        isQulificationEdited: false
      }
    })
  })
}

/* Get Specific Grade Functionality */
export const deleteQualification = (qualificationData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_QUALIFICATION })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/qualification/delete`, qualificationData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.DELETE_QUALIFICATION,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isDeleted: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.DELETE_QUALIFICATION,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isDeleted: false
      }
    })
  })
}
