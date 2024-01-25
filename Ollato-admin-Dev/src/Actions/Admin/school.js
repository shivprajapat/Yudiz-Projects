
import axios from 'axios'
import constants from '../../Shared/Types/constants'

/* Add School Functionality */
export const addSchoolAction = (schoolData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADD_SCHOOL_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/school/create`, schoolData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.ADD_SCHOOL_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isSchoolAdded: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.ADD_SCHOOL_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isSchoolAdded: false
      }
    })
  })
}

/* Get School Functionality */
export const getAllSchoolAction = (start, limit, sort, order, search, token) => (dispatch) => {
  const data = {
    start,
    limit,
    sort,
    order,
    search
  }
  dispatch({ type: constants.CLEAR_GET_ALL_SCHOOL_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/school/get-all-school`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_SCHOOL_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        schoolDataArray: response.data.data,
        schoolCount: response.data.total
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_SCHOOL_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

/* Get Specific School Functionality */
export const getSpecificSchoolData = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_SPECIFIC_SCHOOL })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/school/get-school-by-id`, { id }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_SPECIFIC_SCHOOL,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        specificSchoolData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_SPECIFIC_SCHOOL,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        specificSchoolData: false
      }
    })
  })
}

/* Update School Functionality */
export const editSpecificSchool = (gradeData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EDIT_SPECIFIC_SCHOOL })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/school/update`, gradeData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_SCHOOL,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isSchoolEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_SCHOOL,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isSchoolEdited: false
      }
    })
  })
}

/* Delete Grade Functionality */
export const deleteSchool = (gradeData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_SCHOOL })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/school/delete`, gradeData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.DELETE_SCHOOL,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isSchoolDeleted: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.DELETE_SCHOOL,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isSchoolDeleted: false
      }
    })
  })
}
