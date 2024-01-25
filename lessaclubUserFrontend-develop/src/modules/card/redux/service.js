import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import { setParamsForGetRequest } from 'shared/utils'
import {
  ADD_CARD,
  CLEAR_ADD_CARD_RESPONSE,
  CLEAR_DELETE_CARD_RESPONSE,
  CLEAR_GET_CARD_RESPONSE,
  CLEAR_UPDATE_CARD_RESPONSE,
  DELETE_CARD,
  GET_CARD,
  UPDATE_CARD
} from './action'

const errMsg = 'Server is unavailable.'

export const getCards = (payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_GET_CARD_RESPONSE })
  axios
    .get(`${apiPaths.card}/index${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_CARD,
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
        type: GET_CARD,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const addCard = (payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_ADD_CARD_RESPONSE })
  axios
    .post(apiPaths.card + '/create', payload)
    .then(({ data }) => {
      callback && callback()
      dispatch({
        type: ADD_CARD,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
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
        type: ADD_CARD,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const updateCard = (id, payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_UPDATE_CARD_RESPONSE })
  axios
    .put(apiPaths.card + '/update' + id, payload)
    .then(({ data }) => {
      callback && callback()
      dispatch({
        type: UPDATE_CARD,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
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
        type: UPDATE_CARD,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const deleteCard = (id, callback) => (dispatch) => {
  dispatch({ type: CLEAR_DELETE_CARD_RESPONSE })
  axios
    .delete(apiPaths.card + '/delete/' + id)
    .then(({ data }) => {
      dispatch({
        type: DELETE_CARD,
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
        type: DELETE_CARD,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
