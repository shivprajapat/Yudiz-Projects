import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import { setParamsForGetRequest } from 'shared/utils'
import { ADD_COMMENT, CLEAR_ADD_COMMENT_RESPONSE, CLEAR_GET_COMMENTS_RESPONSE, DELETE_COMMENT, GET_COMMENTS } from './action'

const errMsg = 'Server is unavailable.'

export const getComments = (payload, callback) => (dispatch) => {
  payload.page === 1 && !payload.parentId && dispatch({ type: CLEAR_GET_COMMENTS_RESPONSE })
  axios
    .get(`${apiPaths.comments}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_COMMENTS,
        payload: {
          data: data.result,
          resMessage: data.message,
          parentId: payload.parentId,
          resStatus: true
        }
      })
      callback && callback()
    })
    .catch((error) => {
      dispatch({
        type: GET_COMMENTS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const addComment = (isReply, payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_ADD_COMMENT_RESPONSE })
  axios
    .post(apiPaths.comments, payload)
    .then(({ data }) => {
      dispatch({
        type: ADD_COMMENT,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true,
          isReply: isReply,
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
        type: ADD_COMMENT,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg,
          resError: true
        }
      })
    })
}

export const deleteComment = (isReply, id, parentId, callback) => (dispatch) => {
  console.log(id, isReply, parentId)
  axios
    .delete(apiPaths.comments + '/' + id)
    .then(({ data }) => {
      dispatch({
        type: DELETE_COMMENT,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true,
          isReply: isReply,
          id: id,
          parentId: parentId,
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
      console.log(error)
    })
}
