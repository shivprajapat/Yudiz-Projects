import axios from 'axios'
import constants from '../../Shared/Types/constants'
export const getAllStudentCenListAction =
  (start, limit, sort, order, search, token) => (dispatch) => {
    const data = {
      start,
      limit,
      sort,
      order,
      search
    }
    dispatch({ type: constants.CLEAR_GET_ALL_STUDENT_DATA_CEN })
    axios
      .post(
        `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/center/student/get-all`,
        data,
        { headers: { Authorization: token } }
      )
      .then((response) => {
        dispatch({
          type: constants.GET_ALL_STUDENT_DATA_CEN,
          payload: {
            // resStatus: true,
            resMessage: response.data.message,
            studentList: response.data.data.rows,
            studentCount: response.data.data.count
          }
        })
      })
      .catch((error) => {
        dispatch({
          type: constants.GET_ALL_STUDENT_DATA_CEN,
          payload: {
            resStatus: false,
            resMessage: error?.response?.data?.message
          }
        })
      })
  }

// update student
export const editSpecificStudentCen = (studentData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EDIT_SPECIFIC_STUDENT_CEN })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/center/student/update`, studentData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_STUDENT_CEN,
      payload: {
        resStatus: true,
        resMessage: response.data?.message,
        isStudentEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_STUDENT_CEN,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isStudentEdited: false
      }
    })
  })
}

// delete student
export const deleteStudentCen = (studentData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_STUDENT_CEN })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/center/student/delete`, studentData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.DELETE_STUDENT_CEN,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isDeleted: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.DELETE_STUDENT_CEN,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isDeleted: false
      }
    })
  })
}

// add student
export const addStudentActionCen = (studentData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADD_STUDENT_DATA_CEN })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/center/student/create`,
      studentData,
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: constants.ADD_STUDENT_DATA_CEN,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          isStudentAdded: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.ADD_STUDENT_DATA_CEN,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isStudentAdded: false
        }
      })
    })
}

// get specific student
export const getSpecificStudentCen = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_SPECIFIC_STUDENT_CEN })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/center/student/get-by-id`, { id }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_SPECIFIC_STUDENT_CEN,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        resData: response.data.data
        // isStudentEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_SPECIFIC_STUDENT_CEN,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        specificStudentData: false
        // isStudentEdited: false
      }
    })
  })
}

// upload student csv
export const uploadCsvfileCenter = (formdata, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADD_SPECIFIC_CSVFILE_CENTER })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/center/import/student`, formdata, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.ADD_SPECIFIC_CSVFILE_CENTER,
      payload: {
        resStatus: true,
        resMessage: response.data?.message,
        isFileAdded: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.ADD_SPECIFIC_CSVFILE_CENTER,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isFileAdded: false
      }
    })
  })
}
