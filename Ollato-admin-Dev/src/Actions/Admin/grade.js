import axios from 'axios'
import constants from '../../Shared/Types/constants'

/* Add Grade Functionality */
export const addGradeAction = (gradeData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADD_GRADE_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/grade/create`, gradeData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.ADD_GRADE_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isGradeAdded: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.ADD_GRADE_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isGradeAdded: false
      }
    })
  })
}

/* Get All Grade Functionality */
export const getAllGradeListAction = (start, limit, sort, order, search, token) => (dispatch) => {
  const data = {
    start,
    limit,
    sort,
    order,
    search
  }
  dispatch({ type: constants.CLEAR_GET_ALL_GRADE_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/grade/get-all-grade`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_GRADE_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        gradeList: response.data.data,
        gradeCount: response.data.total
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_GRADE_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

/* Get Specific Grade Functionality */
export const getSpecificGradeData = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_SPECIFIC_GRADE })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/grade/get-grade-by-id`, { id }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_SPECIFIC_GRADE,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        specificGradeData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_SPECIFIC_GRADE,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        specificGradeData: false
      }
    })
  })
}

/* Update Grade Functionality */
export const editSpecificGrade = (gradeData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EDIT_SPECIFIC_GRADE })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/grade/update`, gradeData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_GRADE,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isGradeEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_GRADE,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isGradeEdited: false
      }
    })
  })
}

/* Get Specific Grade Functionality */
export const deleteGrade = (gradeData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_GRADE })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/grade/delete`, gradeData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.DELETE_GRADE,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isDeleted: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.DELETE_GRADE,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isDeleted: false
      }
    })
  })
}
