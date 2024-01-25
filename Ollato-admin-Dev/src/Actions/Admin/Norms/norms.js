import axios from 'axios'
import constants from '../../../Shared/Types/constants'

export const addNormsAction = (normsData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADD_NORMS_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/norms/create`, normsData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.ADD_NORMS_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isNormsAdded: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.ADD_NORMS_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isNormsAdded: false
      }
    })
  })
}

export const getAllNormsAction = (start, limit, sort, order, search, token) => (dispatch) => {
  const data = {
    start,
    limit,
    sort,
    order,
    search
  }
  dispatch({ type: constants.CLEAR_GET_ALL_NORMS_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/norms/get-all-norms`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_NORMS_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        normsList: response.data.data,
        normsCount: response.data.total
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_NORMS_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

// Norms Select for frontent

export const getAllNormsList = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_NORMS_DATA_LIST })
  axios
    .get(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/norms/get-all-norms-frontend`, {
      headers: { Authorization: token }
    })
    .then((response) => {
      dispatch({
        type: constants.GET_ALL_NORMS_DATA_LIST,
        payload: {
          resStatus: true,
          resMessage: response.data.message,
          normsList: response.data.data
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.GET_ALL_NORMS_DATA_LIST,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message
        }
      })
    })
}

export const getSpecificNormsData = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_SPECIFIC_NORMS })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/norms/get-norms-by-id`, { id }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_SPECIFIC_NORMS,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        resData: response.data.data,
        isNormsUpdated: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_SPECIFIC_NORMS,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        specificNORMSData: false,
        isNormsUpdated: false
      }
    })
  })
}

export const editSpecificNorms = (normsData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EDIT_SPECIFIC_NORMS })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/norms/update`, normsData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_NORMS,
      payload: {
        resStatus: true,
        resMessage: response.data?.message,
        isNormsEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_NORMS,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isNormsEdited: false
      }
    })
  })
}

export const deleteNorms = (normsData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_NORMS })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/norms/delete`, normsData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.DELETE_NORMS,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isDeleted: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.DELETE_NORMS,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isDeleted: false
      }
    })
  })
}

/* Get All Norms Frontend */
export const getAllNormsFrontend = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADD_NORMS_FRONTEND_DATA })
  axios
    .get(
      `${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/norms/get-all-norms-frontend`,
      { headers: { Authorization: token } }
    )
    .then((response) => {
      dispatch({
        type: constants.ADD_NORMS_FRONTEND_DATA,
        payload: {
          resStatus: true,
          resMessage: response?.data?.message,
          normsFrontList: response.data.data
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: constants.ADD_NORMS_FRONTEND_DATA,
        payload: {
          resStatus: false,
          resMessage: error?.response?.data?.message
        }
      })
    })
}
