import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { setParamsForGetRequest } from 'shared/utils'
import { CLEAR_GET_PUSH_NOTIFICATIONS_RESPONSE, GET_PUSH_NOTIFICATIONS } from './action'

const errMsg = 'Server is unavailable.'

export const getMyNotifications = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_GET_PUSH_NOTIFICATIONS_RESPONSE })
  axios
    .get(`${apiPaths.pushNotifications}${setParamsForGetRequest(payload)}`)
    .then(({ data }) => {
      dispatch({
        type: GET_PUSH_NOTIFICATIONS,
        payload: {
          data: data.result,
          resMessage: data.message,
          resStatus: true,
          resError: false
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: GET_PUSH_NOTIFICATIONS,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg,
          resError: true
        }
      })
    })
}
