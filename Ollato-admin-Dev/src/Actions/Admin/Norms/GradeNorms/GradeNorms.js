import axios from 'axios'
import constants from '../../../../Shared/Types/constants'

export const getAllGradeNorms =
  (start, limit, sort, order, search, token) => (dispatch) => {
    const gradeNormsData = {
      start,
      limit,
      sort,
      order,
      search
    }
    dispatch({ type: constants.CLEAR_GET_ALL_GRADE_NORMS_DATA })
    axios
      .post(
        `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/norm-grades/get-all`,
        gradeNormsData,
        { headers: { Authorization: token } }
      )
      .then((response) => {
        dispatch({
          type: constants.GET_ALL_GRADE_NORMS_DATA,
          payload: {
            resStatus: true,
            resMessage: response.data.message,
            gradeNormsList: response?.data?.data,
            gradeNormsCount: response?.data?.total
          }
        })
      })
      .catch((error) => {
        dispatch({
          type: constants.GET_ALL_GRADE_NORMS_DATA,
          payload: {
            resStatus: false,
            resMessage: error?.response?.data?.message
          }
        })
      })
  }

export const getAllGreades = (token) => (dispatch) => {
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

export const createGradeNorms =
  (gradeNormsData, token) =>
    (dispatch) => {
      dispatch({ type: constants.CLEAR_ADD_GRADE_NORMS_DATA })
      axios
        .post(
        `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/norm-grades/create`,
        gradeNormsData,
        { headers: { Authorization: token } }
        )
        .then((response) => {
          dispatch({
            type: constants.ADD_GRADE_NORMS_DATA,
            payload: {
              resStatus: true,
              resMessage: response?.data?.message,
              isGradeNormsAdded: true
            }
          })
        })
        .catch((error) => {
          dispatch({
            type: constants.ADD_GRADE_NORMS_DATA,
            payload: {
              resStatus: false,
              resMessage: error?.response?.data?.message,
              isGradeNormsAdded: false
            }
          })
        })
    }

export const getSpecificGradeNorms = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_SPECIFIC_GRADE_NORMS })
  axios
    .post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/norm-grades/get-by-id`, { id }, { headers: { Authorization: token } })
    .then((response) => {
      dispatch({
        type: constants.GET_SPECIFIC_GRADE_NORMS,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          resData: response.data.data,
          isGradeNormsUpdate: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.GET_SPECIFIC_GRADE_NORMS,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isGradeNormsUpdate: false
        }
      })
    })
}

export const editSpecificGradeNorms = (gradeNormsData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EDIT_SPECIFIC_GRADE_NORMS })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/norm-grades/update`, gradeNormsData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_GRADE_NORMS,
      payload: {
        resStatus: true,
        resMessage: response.data?.message,
        isGradeNormsEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_GRADE_NORMS,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isGradeNormsEdited: false
      }
    })
  })
}

export const deleteGradeNorms = (gradeNormsData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_GRADE_NORMS })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/norm-grades/delete`,
      gradeNormsData,
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: constants.DELETE_GRADE_NORMS,
        payload: {
          resStatus: true,
          resMessage: response?.data?.message,
          isDeleted: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.DELETE_GRADE_NORMS,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isDeleted: false
        }
      })
    })
}
