import axios from 'shared/libs/axios'
import { apiPaths } from 'shared/constants/apiPaths'
import {
  GIFT_CREATION,
  CLEAR_GIFT_CREATION_RESPONSE
} from './action'

const errMsg = 'Server is unavailable.'

export const giftCreation = (payload, callback) => (dispatch) => {
  dispatch({ type: CLEAR_GIFT_CREATION_RESPONSE })
  axios
    .post(apiPaths.gift, payload)
    .then(({ data }) => {
      dispatch({
        type: GIFT_CREATION,
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
        type: GIFT_CREATION,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
