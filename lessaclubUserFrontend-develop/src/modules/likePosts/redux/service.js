import { apiPaths } from 'shared/constants/apiPaths'
import axios from 'shared/libs/axios'
import { CLEAR_LIKE_POST_RESPONSE, CLEAR_UN_LIKE_POST_RESPONSE, LIKE_POST, UN_LIKE_POST } from './action'

const errMsg = 'Server is unavailable.'

export const likePost = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_LIKE_POST_RESPONSE })
  axios
    .post(apiPaths.likePost, payload)
    .then(({ data }) => {
      dispatch({
        type: LIKE_POST,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: LIKE_POST,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const unLikePost = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_UN_LIKE_POST_RESPONSE })
  axios
    .post(apiPaths.unLikePost, payload)
    .then(({ data }) => {
      dispatch({
        type: UN_LIKE_POST,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: UN_LIKE_POST,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
