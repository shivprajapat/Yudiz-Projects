import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import {
  CREATE_POST,
  CLEAR_CREATE_POST_RESPONSE,
  UPLOAD_BLOG_CONTENT,
  CLEAR_UPLOAD_BLOG_CONTENT_RESPONSE,
  CLEAR_UPDATE_POST_RESPONSE,
  UPDATE_POST,
  CLEAR_GET_POSTS_RESPONSE,
  GET_POSTS,
  GET_POST_DETAILS,
  CLEAR_GET_POST_DETAILS_RESPONSE,
  CLEAR_GET_MY_POSTS_RESPONSE,
  GET_MY_POSTS,
  DELETE_POST,
  CLEAR_DELETE_POST_RESPONSE
} from './action'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import { setParamsForGetRequest } from 'shared/utils'

const errMsg = 'Server is unavailable.'

export const createPost = (payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_CREATE_POST_RESPONSE })
  axios
    .post(apiPaths.communityAssets, payload)
    .then(({ data }) => {
      dispatch({
        type: CREATE_POST,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true,
          resError: false
        }
      })
      callback && callback(data.result)
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
        type: CREATE_POST,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg,
          resError: true
        }
      })
    })
    .finally(() => {
      dispatch({ type: CLEAR_UPLOAD_BLOG_CONTENT_RESPONSE })
    })
}

export const uploadBlogContent = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_UPLOAD_BLOG_CONTENT_RESPONSE })
  axios
    .post(apiPaths.uploadBlogContent, payload)
    .then(({ data }) => {
      dispatch({
        type: UPLOAD_BLOG_CONTENT,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: UPLOAD_BLOG_CONTENT,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const updatePost = (id, payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_UPDATE_POST_RESPONSE })
  axios
    .put(apiPaths.communityAssets + '/' + id, payload)
    .then(({ data }) => {
      dispatch({
        type: UPDATE_POST,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true,
          resError: false
        }
      })
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: data.message,
          type: TOAST_TYPE.Success
        }
      })
      callback && callback()
    })
    .catch((error) => {
      dispatch({
        type: UPDATE_POST,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg,
          resError: true
        }
      })
    })
}

export const getPosts = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_GET_POSTS_RESPONSE })
  axios
    .get(`${apiPaths.communityAssets}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_POSTS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true,
          resError: false
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_POSTS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg,
          resError: true
        }
      })
    })
}
export const getMyPosts = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_GET_MY_POSTS_RESPONSE })
  axios
    .get(`${apiPaths.communityAssets}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_MY_POSTS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true,
          resError: false
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_MY_POSTS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg,
          resError: true
        }
      })
    })
}
export const getPostDetails = (id, payload) => (dispatch) => {
  dispatch({ type: CLEAR_GET_POST_DETAILS_RESPONSE })
  axios
    .get(payload ? `${apiPaths.communityAssets}/${id}${setParamsForGetRequest(payload)}` : `${apiPaths.communityAssets}/${id}`)
    .then(({ data }) => {
      dispatch({
        type: GET_POST_DETAILS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true,
          resError: false
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_POST_DETAILS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg,
          resError: true
        }
      })
    })
}

export const deletePost = (id, callback) => (dispatch) => {
  dispatch({ type: CLEAR_DELETE_POST_RESPONSE })
  axios
    .delete(`${apiPaths.communityAssets}/${id}`)
    .then(({ data }) => {
      dispatch({
        type: DELETE_POST,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true,
          resError: false
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
        type: DELETE_POST,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg,
          resError: true
        }
      })
    })
}
