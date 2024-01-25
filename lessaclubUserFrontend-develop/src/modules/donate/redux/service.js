import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import {
  DONATE_PURCHASE_CREATE,
  CLEAR_DONATE_PURCHASE_CREATE_RESPONSE,
  DONATE_PURCHASE,
  CLEAR_DONATE_PURCHASE
} from './action'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'

const errMsg = 'Server is unavailable.'

export const donatePurchaseCreate = (payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_DONATE_PURCHASE_CREATE_RESPONSE })
  axios
    .post(apiPaths.donatePurchaseCreate, payload)
    .then(({ data }) => {
      dispatch({
        type: DONATE_PURCHASE_CREATE,
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
        type: DONATE_PURCHASE_CREATE,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg,
          error: true
        }
      })
    })
}

export const donateCoinPurchaseUsingCard = (id, payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_DONATE_PURCHASE })
  axios
    .put(apiPaths.donatePurchaseCreate + '/' + id, payload)
    .then(({ data }) => {
      dispatch({
        type: DONATE_PURCHASE,
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
        type: DONATE_PURCHASE,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
      callback && callback()
    })
}
