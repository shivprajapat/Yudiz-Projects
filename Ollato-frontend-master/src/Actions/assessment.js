
import axios from 'axios'
import constants from '../Shared/Types/constants'

/* Get Completed Test Data */
export const getCompletedTestData = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_COMPLETED_TEST })
  axios.get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/test-completed-details`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_COMPLETED_TEST,
      payload: {
        // resStatus: true,
        // resMessage: response.data.message,
        completedTestData: response.data.data,
        totalTest: response.data.data.total_test
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_COMPLETED_TEST,
      payload: {
        resStatus: error?.response?.data.status,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

/* Get Assessment Data */
export const getAssessmentData = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ASSESSMENT_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/assessment`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ASSESSMENT_DATA,
      payload: {
        resStatus: true,
        // resMessage: response.data.message,
        assessmentData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ASSESSMENT_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

/* Get All Packages History Data */
export const downloadReport = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GENERATE_REPORT })
  axios.get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/getUrl/${id}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GENERATE_REPORT,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        downloadReportLink: response?.data?.dataUrl?.sUrl,
        isReportDownloaded: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GENERATE_REPORT,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isReportDownloaded: false
      }
    })
  })
}

/* Get All Packages History Data */
export const getGraphData = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_GRAPH_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/assessment-report`, { studentTestCustomId: id }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_GRAPH_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        graphData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_GRAPH_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}
