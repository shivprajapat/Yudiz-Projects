import axios from 'axios'
import constants from '../../Shared/Types/constants'

export const getAllStateAction =
  (start, limit, sort, order, search, token) => (dispatch) => {
    const data = {
      start,
      limit,
      sort,
      order,
      search
    }
    dispatch({ type: constants.CLEAR_GET_ALL_STATE_DATA })
    axios
      .post(
        `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/states`,
        data,
        { headers: { Authorization: token } }
      )
      .then((response) => {
        dispatch({
          type: constants.GET_ALL_STATE_DATA,
          payload: {
            resStatus: true,
            resMessage: response.data.message,
            stateList: response.data.data,
            stateCount: response.data.total
          }
        })
      })
      .catch((error) => {
        dispatch({
          type: constants.GET_ALL_STATE_DATA,
          payload: {
            resStatus: false,
            resMessage: error?.response?.data?.message
          }
        })
      })
  }

export const addStateAction = (stateData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADD_STATE_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/state/create`, stateData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.ADD_STATE_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isStateAdded: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.ADD_STATE_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isStateAdded: false
      }
    })
  })
}

export const deleteState = (stateData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_STATE })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/state/delete`,
      stateData,
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: constants.DELETE_STATE,
        payload: {
          resStatus: true,
          resMessage: response?.data?.message,
          isDeleted: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.DELETE_STATE,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          isDeleted: false
        }
      })
    })
}

export const getSpecificState = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_SPECIFIC_STATE })
  axios
    .post(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/state/get`,
      { id },
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: constants.GET_SPECIFIC_STATE,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          resData: response.data.data,
          isCityUpdate: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.GET_SPECIFIC_STATE,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message,
          specificCityData: false,
          isCityUpdate: false
        }
      })
    })
}

export const editSpecificState = (stateData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EDIT_SPECIFIC_STATE })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/state/update`, stateData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_STATE,
      payload: {
        resStatus: true,
        resMessage: response.data?.message,
        isStateEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_STATE,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isStateEdited: false
      }
    })
  })
}
