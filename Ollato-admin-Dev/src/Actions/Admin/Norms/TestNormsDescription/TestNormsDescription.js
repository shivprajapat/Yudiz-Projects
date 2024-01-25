import axios from 'axios'
import constants from '../../../../Shared/Types/constants'

export const getAllTestNormsDescription =
  (start, limit, sort, order, search, token) => (dispatch) => {
    const testNormsDescriptionData = {
      start,
      limit,
      sort,
      order,
      search
    }
    dispatch({ type: constants.CLEAR_GET_ALL_TEST_NORMS_DESCRIPTION_DATA })
    axios
      .post(
        `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/test-norm-descriptions/get-all`,
        testNormsDescriptionData,
        { headers: { Authorization: token } }
      )
      .then((response) => {
        dispatch({
          type: constants.GET_ALL_TEST_NORMS_DESCRIPTION_DATA,
          payload: {
            resStatus: true,
            resMessage: response.data.message,
            testNormsDescriptionList: response?.data?.data,
            testNormsDescriptionCount: response?.data?.total
          }
        })
      })
      .catch((error) => {
        dispatch({
          type: constants.GET_ALL_TEST_NORMS_DESCRIPTION_DATA,
          payload: {
            resStatus: false,
            resMessage: error?.response?.data?.message
          }
        })
      })
  }

export const createTestNormsDescription =
  (testNormsDescriptionData, token) =>
    (dispatch) => {
      dispatch({ type: constants.CLEAR_ADD_TEST_NORMS_DESCRIPTION_DATA })
      axios
        .post(
        `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/test-norm-descriptions/create`,
        testNormsDescriptionData,
        { headers: { Authorization: token } }
        )
        .then((response) => {
          dispatch({
            type: constants.ADD_TEST_NORMS_DESCRIPTION_DATA,
            payload: {
              resStatus: true,
              resMessage: response?.data?.message,
              isTestNormsDesscriptionAdded: true
            }
          })
        })
        .catch((error) => {
          dispatch({
            type: constants.ADD_TEST_NORMS_DESCRIPTION_DATA,
            payload: {
              resStatus: false,
              resMessage: error?.response?.data?.message,
              isTestNormsDesscriptionAdded: false
            }
          })
        })
    }

export const getSpecificTestNormsDescription = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_SPECIFIC_TEST_NORMS_DESCRIPTION })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/test-norm-descriptions/get-by-id`,
      { id },
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: constants.GET_SPECIFIC_TEST_NORMS_DESCRIPTION,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          resData: response.data.data,
          isTestNormsDescriptionUpdate: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.GET_SPECIFIC_TEST_NORMS_DESCRIPTION,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isTestNormsDescriptionUpdate: false
        }
      })
    })
}

export const editSpecificTestNormsDescription = (testNormsDescriptionData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EDIT_SPECIFIC_TEST_NORMS_DESCRIPTION })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/test-norm-descriptions/update`, testNormsDescriptionData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_TEST_NORMS_DESCRIPTION,
      payload: {
        resStatus: true,
        resMessage: response.data?.message,
        isTestNormsDescriptionEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_TEST_NORMS_DESCRIPTION,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isTestNormsDescriptionEdited: false
      }
    })
  })
}

export const deleteTestNormsDescription = (testNormsDescriptionData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_TEST_NORMS_DESCRIPTION })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/test-norm-descriptions/delete`,
      testNormsDescriptionData,
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: constants.DELETE_TEST_NORMS_DESCRIPTION,
        payload: {
          resStatus: true,
          resMessage: response?.data?.message,
          isDeleted: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.DELETE_TEST_NORMS_DESCRIPTION,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isDeleted: false
        }
      })
    })
}
