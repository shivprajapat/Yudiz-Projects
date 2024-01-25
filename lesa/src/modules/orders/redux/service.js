import axios from '../../../axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { setParamsForGetRequest } from 'shared/utils'
import { GET_ORDERS, CLEAR_GET_ORDERS_RESPONSE } from './action'

const errMsg = 'Server is unavailable.'

export const getOrders = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_GET_ORDERS_RESPONSE })
  axios
    .get(`${apiPaths.order}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_ORDERS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_ORDERS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
