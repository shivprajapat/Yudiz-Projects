import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { setParamsForGetRequest } from 'shared/utils'
import { ADMIN_CLEAR_GET_ORDERS, ADMIN_GET_ORDERS } from './action'

const errMsg = 'Server is unavailable.'

export const adminGetOrders = (payload) => (dispatch) => {
  dispatch({ type: ADMIN_CLEAR_GET_ORDERS })
  axios
    .get(`${apiPaths.order}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: ADMIN_GET_ORDERS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: ADMIN_GET_ORDERS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
