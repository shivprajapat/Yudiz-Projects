
import axios from 'axios'
import constants from '../Shared/Types/constants'

/* Get Test Process Count */
export const getTestProcess = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_TEST_PROCESS_DATA })
  axios.get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/test-with-subcategory`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_TEST_PROCESS_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        testProcessTest: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_TEST_PROCESS_DATA,
      payload: {
        resStatus: error?.response?.data?.status,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

export const getTestProcessCategory = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_TEST_CATEGORY_BY_ID_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/test-subcategory`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_TEST_CATEGORY_BY_ID_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        testProcessCategoryByID: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_TEST_CATEGORY_BY_ID_DATA,
      payload: {
        resStatus: error?.response?.data?.status,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

export const getInterestTestDetails = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_INTEREST_TEST_DETAILS })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/student/interest-test-questions`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_INTEREST_TEST_DETAILS,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        interestTestData: response.data.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_INTEREST_TEST_DETAILS,
      payload: {
        resStatus: error?.response?.data?.status,
        resMessage: error?.response?.data?.message
      }
    })
  })
}
