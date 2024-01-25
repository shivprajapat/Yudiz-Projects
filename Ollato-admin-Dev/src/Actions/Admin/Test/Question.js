import axios from 'axios'
import constants from '../../../Shared/Types/constants'

export const getAllTestCategory = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADD_TEST_CATEGORY_DATA })
  axios
    .get(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/test/test-category/get-all-test-category`,
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: constants.ADD_TEST_CATEGORY_DATA,
        payload: {
          resStatus: true,
          resMessage: response?.data?.message,
          testCategoryList: response.data.data
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.ADD_TEST_CATEGORY_DATA,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message
        }
      })
    })
}

export const getAllSubCategory = (token, maincatid) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADD_TEST_SUB_CATEGORY_DATA })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/sub-test-detail-by-id`, { id: maincatid },
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: constants.ADD_TEST_SUB_CATEGORY_DATA,
        payload: {
          resStatus: true,
          resMessage: response?.data?.message,
          testSubCategoryList: response.data.data
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.ADD_TEST_SUB_CATEGORY_DATA,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message
        }
      })
    })
}

export const getAllSubCategoryFrontend = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADD_TEST_SUB_CATEGORY_DATA })
  axios
    .get(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/get-sub-test-detail`,
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: constants.ADD_TEST_SUB_CATEGORY_DATA,
        payload: {
          resStatus: true,
          resMessage: response?.data?.message,
          testSubCategoryList: response.data.data
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.ADD_TEST_SUB_CATEGORY_DATA,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message
        }
      })
    })
}

export const getAllQuestionListAction =
  (start, limit, sort, order, search, testDetailsId, token) => (dispatch) => {
    const data = {
      start,
      limit,
      sort,
      order,
      search,
      testDetailsId
    }
    dispatch({ type: constants.CLEAR_GET_ALL_QUESTION_DATA })
    axios
      .post(
        `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/question/get-all-question`,
        data,
        { headers: { Authorization: token } }
      )
      .then((response) => {
        dispatch({
          type: constants.GET_ALL_QUESTION_DATA,
          payload: {
            resStatus: true,
            resMessage: response.data.message,
            questionList: response.data?.data,
            questionCount: response.data?.count
          }
        })
      })
      .catch((error) => {
        dispatch({
          type: constants.GET_ALL_QUESTION_DATA,
          payload: {
            resStatus: false,
            resMessage: error?.response?.data?.message
          }
        })
      })
  }

export const createQuestion = (data, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADD_QUESTION_DATA })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/question/create`,
      data,
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: constants.ADD_QUESTION_DATA,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          isQuestionAdded: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.ADD_QUESTION_DATA,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isQuestionAdded: false
        }
      })
    })
}

export const getSpecificQuestion = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_SPECIFIC_QUESTION })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/question/get-question-by-id`,
      { id },
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: constants.GET_SPECIFIC_QUESTION,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          resData: response.data.data,
          isQuestionUpdate: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.GET_SPECIFIC_QUESTION,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isQuestionUpdate: false
        }
      })
    })
}

export const editSpecificQuestion = (questionData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EDIT_SPECIFIC_QUESTION })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/question/update`,
      questionData,
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: constants.EDIT_SPECIFIC_QUESTION,
        payload: {
          resStatus: true,
          resMessage: response.data?.message,
          isQuestionEdited: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.EDIT_SPECIFIC_QUESTION,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isQuestionEdited: false
        }
      })
    })
}

export const deleteQuestion = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_QUESTION })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/question/delete`,
      id,
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: constants.DELETE_QUESTION,
        payload: {
          resStatus: true,
          resMessage: response?.data?.message,
          isDeleted: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.DELETE_QUESTION,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isDeleted: false
        }
      })
    })
}
