import axios from 'axios'
import constants from '../../../../Shared/Types/constants'

export const getAllTestTimeNorms =
  (start, limit, sorting, order, search, token) => (dispatch) => {
    const testTimeNormsData = {
      start,
      limit,
      sorting,
      order,
      search
    }
    dispatch({ type: constants.CLEAR_GET_ALL_TEST_TIME_NORMS_DATA })
    axios
      .post(
        `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/get-all-test-time-norms`,
        testTimeNormsData,
        { headers: { Authorization: token } }
      )
      .then((response) => {
        dispatch({
          type: constants.GET_ALL_TEST_TIME_NORMS_DATA,
          payload: {
            resStatus: true,
            resMessage: response.data.message,
            testTimeNormsList: response?.data?.data?.rows,
            testTimeNormsCount: response?.data?.data?.count
          }
        })
      })
      .catch((error) => {
        dispatch({
          type: constants.GET_ALL_TEST_TIME_NORMS_DATA,
          payload: {
            resStatus: false,
            resMessage: error?.response?.data?.message
          }
        })
      })
  }

export const getAllGreade = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_GRADE_DATA })
  axios
    .get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/grade/get-all-grade`, {
      headers: { Authorization: token }
    })
    .then((response) => {
      dispatch({
        type: constants.GET_ALL_GRADE_DATA,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          gradeList: response.data.data
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.GET_ALL_GRADE_DATA,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message
        }
      })
    })
}

export const createTestTimeNorms =
  (testTimeNormsData, token) =>
    (dispatch) => {
      dispatch({ type: constants.CLEAR_ADD_TEST_TIME_NORMS_DATA })
      axios
        .post(
        `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/create-test-time-norms`,
        testTimeNormsData,
        { headers: { Authorization: token } }
        )
        .then((response) => {
          dispatch({
            type: constants.ADD_TEST_TIME_NORMS_DATA,
            payload: {
              resStatus: true,
              resMessage: response?.data?.message,
              isTestTimeNormsAdded: true
            }
          })
        })
        .catch((error) => {
          dispatch({
            type: constants.ADD_TEST_TIME_NORMS_DATA,
            payload: {
              resStatus: false,
              resMessage: error?.response?.data?.message,
              isTestTimeNormsAdded: false
            }
          })
        })
    }

export const getSpecificTestTimeNorms = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_SPECIFIC_TEST_TIME_NORMS })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/get-test-time-norms`,
      { id },
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: constants.GET_SPECIFIC_TEST_TIME_NORMS,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          resData: response.data.data,
          isTestTimeNormsUpdate: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.GET_SPECIFIC_TEST_TIME_NORMS,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isTestTimeNormsUpdate: false
        }
      })
    })
}

export const editSpecificTestTimeNorms = (testTimeNormsData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EDIT_SPECIFIC_TEST_TIME_NORMS })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/update-test-time-norms`, testTimeNormsData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_TEST_TIME_NORMS,
      payload: {
        resStatus: true,
        resMessage: response.data?.message,
        isTestTimeNormsEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_TEST_TIME_NORMS,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isTestTimeNormsEdited: false
      }
    })
  })
}

export const deleteTestTimeNorms = (testTimeNormsData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_TEST_TIME_NORMS })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/delete-test-time-norms`,
      testTimeNormsData,
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: constants.DELETE_TEST_TIME_NORMS,
        payload: {
          resStatus: true,
          resMessage: response?.data?.message,
          isDeleted: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.DELETE_TEST_TIME_NORMS,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isDeleted: false
        }
      })
    })
}
