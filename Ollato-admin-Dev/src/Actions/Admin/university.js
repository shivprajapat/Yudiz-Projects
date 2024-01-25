import axios from 'axios'
import constants from '../../Shared/Types/constants'

export const getAllUniversityListAction =
  (start, limit, sort, order, search, token) => (dispatch) => {
    const data = {
      start,
      limit,
      sort,
      order,
      search
    }
    dispatch({ type: constants.CLEAR_GET_ALL_UNIVERSITY_DATA })
    axios
      .post(
        `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/university/get-all-university`,
        data,
        { headers: { Authorization: token } }
      )
      .then((response) => {
        dispatch({
          type: constants.GET_ALL_UNIVERSITY_DATA,
          payload: {
            resStatus: true,
            universityList: response?.data?.data,
            resMessage: response?.data?.message,
            universityCount: response?.data?.total
          }
        })
      })
      .catch((error) => {
        dispatch({
          type: constants.GET_ALL_UNIVERSITY_DATA,
          payload: {
            resStatus: false,
            resMessage: error?.response?.data?.message,
            isLoading: false
          }
        })
      })
  }

export const createUniversity =
  ({ universityData, token }) =>
    (dispatch) => {
      dispatch({ type: constants.CLEAR_ADD_UNIVERSITY_DATA })
      axios
        .post(
        `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/university/create`,
        universityData,
        { headers: { Authorization: token } }
        )
        .then((response) => {
          dispatch({
            type: constants.ADD_UNIVERSITY_DATA,
            payload: {
              resStatus: true,
              resMessage: response?.data?.message,
              isUniversityAdded: true
            }
          })
        })
        .catch((error) => {
          dispatch({
            type: constants.ADD_UNIVERSITY_DATA,
            payload: {
              resStatus: false,
              resMessage: error?.response?.data?.message,
              isUniversityAdded: false
            }
          })
        })
    }

export const updateUniversity = (universityData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EDIT_SPECIFIC_UNIVERSITY })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/university/update`,
      universityData,
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: constants.EDIT_SPECIFIC_UNIVERSITY,
        payload: {
          resStatus: true,
          resMessage: response?.data?.message,
          isUniversityEdited: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.EDIT_SPECIFIC_UNIVERSITY,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isUniversityEdited: false
        }
      })
    })
}

export const deleteUniversity = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_UNIVERSITY })
  axios
    .post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/university/delete`, id, { headers: { Authorization: token } })
    .then((response) => {
      dispatch({
        type: constants.DELETE_UNIVERSITY,
        payload: {
          resStatus: true,
          resMessage: response?.data?.message,
          isDeleted: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.DELETE_UNIVERSITY,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isDeleted: false
        }
      })
    })
}

export const getUniversityById = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_SPECIFIC_UNIVERSITY })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/university/get-university-by-id`,
      { id },
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: constants.GET_SPECIFIC_UNIVERSITY,
        payload: {
          resStatus: true,
          resMessage: response?.data?.message,
          resData: response.data.data,
          isUniversityUpdated: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.GET_SPECIFIC_UNIVERSITY,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isUniversityUpdated: false
        }
      })
    })
}
