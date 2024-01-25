import axios from '../../../axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { setParamsForGetRequest } from 'shared/utils'
import {
  INTERNAL_WALLET_NUU_COINS,
  CLEAR_INTERNAL_WALLET_NUU_COINS_RESPONSE,
  CLEAR_NUU_COINS_DETAILS_RESPONSE,
  NUU_COINS_DETAILS
} from './action'

const errMsg = 'Server is unavailable.'

export const getNuuCoinsBalance = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_INTERNAL_WALLET_NUU_COINS_RESPONSE })
  axios
    .get(`${apiPaths.internalWalletModule}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: INTERNAL_WALLET_NUU_COINS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: INTERNAL_WALLET_NUU_COINS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const getNuuCoinsDetails = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_NUU_COINS_DETAILS_RESPONSE })
  axios
    .get(`${apiPaths.nuuCoinModule}${setParamsForGetRequest(payload)}`)
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
