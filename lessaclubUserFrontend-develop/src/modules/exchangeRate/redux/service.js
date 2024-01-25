import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { setParamsForGetRequest } from 'shared/utils'
import { GET_EXCHANGE_RATE, CLEAR_EXCHANGE_RATE_RESPONSE } from './action'

const errMsg = 'Server is unavailable.'

export const getExchangeRate = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_EXCHANGE_RATE_RESPONSE })
  axios
    .get(`${apiPaths.exchangeRate}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_EXCHANGE_RATE,
        payload: {
          data: data.result,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_EXCHANGE_RATE,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.resStatus.data.message : errMsg
        }
      })
    })
}
