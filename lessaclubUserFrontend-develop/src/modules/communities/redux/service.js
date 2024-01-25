import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import {
  CLEAR_CREATE_COMMUNITY_RESPONSE,
  CLEAR_GET_ALL_COMMUNITIES_RESPONSE,
  CLEAR_GET_COMMUNITY_DETAILS_RESPONSE,
  CLEAR_GET_MY_COMMUNITIES_RESPONSE,
  CLEAR_GET_POPULAR_COMMUNITIES_RESPONSE,
  CLEAR_UPDATE_COMMUNITY_RESPONSE,
  CREATE_COMMUNITY,
  GET_ALL_COMMUNITIES,
  GET_COMMUNITY_DETAILS,
  GET_MY_COMMUNITIES,
  GET_POPULAR_COMMUNITIES,
  UPDATE_COMMUNITY
} from './action'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import { setParamsForGetRequest } from 'shared/utils'
import { CLEAR_ASSET_UPLOAD_RESPONSE } from 'modules/assets/redux/action'

const errMsg = 'Server is unavailable.'

export const createCommunity = (payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_CREATE_COMMUNITY_RESPONSE })
  axios
    .post(apiPaths.communities, payload)
    .then(({ data }) => {
      dispatch({ type: CLEAR_ASSET_UPLOAD_RESPONSE })
      dispatch({
        type: CREATE_COMMUNITY,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
      callback && callback()
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: data.message,
          type: TOAST_TYPE.Success
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: CREATE_COMMUNITY,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const getMyCommunities = (payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_GET_MY_COMMUNITIES_RESPONSE })
  axios
    .get(`${apiPaths.communities}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_MY_COMMUNITIES,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
      callback && callback()
    })
    .catch((error) => {
      dispatch({
        type: GET_MY_COMMUNITIES,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const getCommunityDetails = (id) => (dispatch) => {
  dispatch({ type: CLEAR_GET_COMMUNITY_DETAILS_RESPONSE })
  axios
    .get(`${apiPaths.communities}/${id}`)
    .then(({ data }) => {
      dispatch({
        type: GET_COMMUNITY_DETAILS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_COMMUNITY_DETAILS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const updateCommunity = (id, payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_UPDATE_COMMUNITY_RESPONSE })
  axios
    .put(apiPaths.communities + '/' + id, payload)
    .then(({ data }) => {
      dispatch({ type: CLEAR_ASSET_UPLOAD_RESPONSE })
      dispatch({
        type: UPDATE_COMMUNITY,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
      callback && callback()
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: data.message,
          type: TOAST_TYPE.Success
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: UPDATE_COMMUNITY,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const getAllCommunities = (payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_GET_ALL_COMMUNITIES_RESPONSE })
  axios
    .get(`${apiPaths.communities}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_ALL_COMMUNITIES,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
      callback && callback()
    })
    .catch((error) => {
      dispatch({
        type: GET_ALL_COMMUNITIES,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const getPopularCommunities = (payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_GET_POPULAR_COMMUNITIES_RESPONSE })
  axios
    .get(`${apiPaths.popularCommunities}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_POPULAR_COMMUNITIES,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
      callback && callback()
    })
    .catch((error) => {
      dispatch({
        type: GET_POPULAR_COMMUNITIES,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const deleteComuunity = (id, callback) => (dispatch) => {
  try {
    axios.delete(`${apiPaths.communities}/${id}`).then((data) => {
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: data.data?.message,
          type: TOAST_TYPE.Success
        }
      })
      callback && callback()
    })
  } catch (e) {
    dispatch({
      type: SHOW_TOAST,
      payload: {
        message: 'Failed to Delete',
        type: TOAST_TYPE.Error
      }
    })
  }
}
