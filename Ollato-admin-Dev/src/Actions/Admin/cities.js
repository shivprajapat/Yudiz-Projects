import axios from 'axios'
import constants from '../../Shared/Types/constants'

export const addCityAction = (cityData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADD_CITY_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/city/create`, cityData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.ADD_CITY_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isCityAdded: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.ADD_CITY_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isCityAdded: false
      }
    })
  })
}

export const getAllCityListAction = (start, limit, sort, order, search, token) => (dispatch) => {
  const data = {
    start,
    limit,
    sort,
    order,
    search
  }
  dispatch({ type: constants.CLEAR_GET_ALL_CITY_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/cities`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_CITY_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        cityList: response.data.data,
        cityCount: response.data.total
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_CITY_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

export const getSpecificCityData = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_SPECIFIC_CITY })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/city/get`, { id }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_SPECIFIC_CITY,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        resData: response.data.data,
        isCityUpdate: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_SPECIFIC_CITY,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        specificCityData: false,
        isCityUpdate: false
      }
    })
  })
}

export const editSpecificCity = (cityData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EDIT_SPECIFIC_CITY })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/city/update`, cityData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_CITY,
      payload: {
        resStatus: true,
        resMessage: response.data?.message,
        isCityEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_CITY,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isCityEdited: false
      }
    })
  })
}

export const deleteCity = (cityData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_CITY })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/city/delete`, cityData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.DELETE_CITY,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isDeleted: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.DELETE_CITY,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isDeleted: false
      }
    })
  })
}
