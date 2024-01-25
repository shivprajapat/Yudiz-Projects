import axios from 'axios'

import { setParamsForGetRequest } from 'shared/utils'
import { CLEAR_CURRENCY_CONVERTER_RESPONSE, GET_CURRENCY_CONVERTER } from './action'

const errMsg = 'Server is unavailable.'
const coinMarketEndPoint = process.env.REACT_APP_COINMARKETCAP_API_URL
const coinMarketApiKey = process.env.REACT_APP_COINMARKETCAP_API_KEY

export const getConversation = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_CURRENCY_CONVERTER_RESPONSE })
  axios
    .get(`${coinMarketEndPoint}${setParamsForGetRequest(payload)}`, {
      headers: {
        'X-CMC_PRO_API_KEY': coinMarketApiKey
      }
    })
    .then(({ data }) => {
      dispatch({
        type: GET_CURRENCY_CONVERTER,
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: CLEAR_CURRENCY_CONVERTER_RESPONSE,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
