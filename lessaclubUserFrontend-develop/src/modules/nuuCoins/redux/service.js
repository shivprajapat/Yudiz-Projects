import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { setParamsForGetRequest } from 'shared/utils'
import {
  GET_NUU_COINS_TRANSACTION_LIST,
  CLEAR_GET_NUU_COINS_TRANSACTION_LIST_RESPONSE,
  CLEAR_NUU_COINS_DETAILS_RESPONSE,
  NUU_COINS_DETAILS,
  NUU_COINS_PURCHASE_CREATE,
  CLEAR_NUU_COINS_PURCHASE_CREATE_RESPONSE,
  CLEAR_NUU_COINS_PURCHASE_UPDATE_RESPONSE,
  NUU_COINS_PURCHASE_UPDATE,
  NUU_COINS_PURCHASE,
  CLEAR_NUU_COINS_PURCHASE
} from './action'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'

const errMsg = 'Server is unavailable.'

export const getNuuCoinsTransactionList = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_GET_NUU_COINS_TRANSACTION_LIST_RESPONSE })
  axios
    .get(`${apiPaths.internalWalletModule}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_NUU_COINS_TRANSACTION_LIST,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_NUU_COINS_TRANSACTION_LIST,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const getNuuCoinsDetails = () => (dispatch) => {
  dispatch({ type: CLEAR_NUU_COINS_DETAILS_RESPONSE })
  axios
    .get(apiPaths.nuuCoinModule)
    .then(({ data }) => {
      dispatch({
        type: NUU_COINS_DETAILS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: NUU_COINS_DETAILS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const nuuCoinPurchaseCreate = (payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_NUU_COINS_PURCHASE_CREATE_RESPONSE })
  axios
    .post(apiPaths.nuuCoinPurchaseCreate, payload)
    .then(({ data }) => {
      dispatch({
        type: NUU_COINS_PURCHASE_CREATE,
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
        type: NUU_COINS_PURCHASE_CREATE,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg,
          error: true
        }
      })
    })
}

export const nuuCoinPurchaseUpdate = (id, payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_NUU_COINS_PURCHASE_UPDATE_RESPONSE })
  axios
    .put(apiPaths.nuuCoinPurchaseCreate + '/' + id, payload)
    .then(({ data }) => {
      dispatch({
        type: NUU_COINS_PURCHASE_UPDATE,
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
        type: NUU_COINS_PURCHASE_UPDATE,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const nuuCoinPurchaseUsingCard = (id, payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_NUU_COINS_PURCHASE })
  axios
    .post(apiPaths.nuuCoinPurchaseUsingCard + '/' + id, payload)
    .then(({ data }) => {
      dispatch({
        type: NUU_COINS_PURCHASE,
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
      callback && callback()
    })
    .catch((error) => {
      dispatch({
        type: NUU_COINS_PURCHASE,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
      callback && callback()
    })
}
