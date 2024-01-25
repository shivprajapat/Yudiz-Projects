import axios from 'axios'
import constants from '../../Shared/Types/constants'

// Get all Profile Detail for Front-end
export const profileDetail = (token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_ALL_CAREER_PROFILE_LIST })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/career-profile-detail/get-all-frontend`, {}, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_CAREER_PROFILE_LIST,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        careerProfileData: response?.data?.data
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_CAREER_PROFILE_LIST,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

export const addCareerProfileAction = (careerProfileData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_ADD_CAREER_PROFILE_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/career-profile/create`, careerProfileData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.ADD_CAREER_PROFILE_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isCareerProfileAdded: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.ADD_CAREER_PROFILE_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isCareerProfileAdded: false
      }
    })
  })
}

export const getAllCareerProfile = (start, limit, sort, order, search, token) => (dispatch) => {
  const data = {
    start,
    limit,
    sort,
    order,
    search
  }
  dispatch({ type: constants.CLEAR_GET_ALL_CAREER_PROFILE_DATA })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/career-profile/get-all`, data, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_ALL_CAREER_PROFILE_DATA,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        careerProfileList: response?.data?.data?.rows,
        careerProfileCount: response?.data?.data?.count
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_ALL_CAREER_PROFILE_DATA,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message
      }
    })
  })
}

export const getSpecificCareerProfileData = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_GET_SPECIFIC_CAREER_PROFILE })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/career-profile/get-by-id`, { id }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.GET_SPECIFIC_CAREER_PROFILE,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        resData: response.data.data,
        isCareerProfileUpdate: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.GET_SPECIFIC_CAREER_PROFILE,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        specificCityData: false,
        isCareerProfileUpdate: false
      }
    })
  })
}

export const editSpecificCareerProfile = (careerProfileData, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_EDIT_SPECIFIC_CAREER_PROFILE })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/career-profile/update`, careerProfileData, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_CAREER_PROFILE,
      payload: {
        resStatus: true,
        resMessage: response.data?.message,
        isCareerProfileEdited: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.EDIT_SPECIFIC_CAREER_PROFILE,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isCareerProfileEdited: false
      }
    })
  })
}

export const deleteCareerProfile = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_CAREER_PROFILE })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/career-profile/delete`, id, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.DELETE_CAREER_PROFILE,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isDeleted: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.DELETE_CAREER_PROFILE,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isDeleted: false
      }
    })
  })
}

export const deleteCareerProfileDetail = (id, token) => (dispatch) => {
  dispatch({ type: constants.CLEAR_DELETE_CAREER_PROFILE_DETAIL })
  axios.post(`${process.env.REACT_APP_AXIOS_BASE_URL_DEV}/v1/admin/career-profile/deleteCareerDetail`, id, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: constants.DELETE_CAREER_PROFILE_DETAIL,
      payload: {
        resStatus: true,
        resMessage: response.data.message,
        isDeleted: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: constants.DELETE_CAREER_PROFILE_DETAIL,
      payload: {
        resStatus: false,
        resMessage: error?.response?.data?.message,
        isDeleted: false
      }
    })
  })
}
