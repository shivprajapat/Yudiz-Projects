import axios from 'shared/libs/axios'

import { apiPaths } from 'shared/constants/apiPaths'
import { setParamsForGetRequest } from 'shared/utils'
import { GET_PAYMENT_CARDS, CLEAR_GET_PAYMENT_CARDS_RESPONSE } from './action'

const errMsg = 'Server is unavailable.'

export const getPaymentCards = (payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_GET_PAYMENT_CARDS_RESPONSE })
  axios
    .get(`${apiPaths.paymentCards}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_PAYMENT_CARDS,
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
        type: GET_PAYMENT_CARDS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
