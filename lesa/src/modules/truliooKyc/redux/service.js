import axios from '../../../axios'
import { apiPaths } from 'shared/constants/apiPaths'
import { CLEAR_KYC_RESPONSE, UPDATE_KYC } from './action'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'

const errMsg = 'Server is unavailable.'

export const trulioo = (payload) => (dispatch) => {
  dispatch({ type: CLEAR_KYC_RESPONSE })
  axios
    .post(apiPaths.updateKyc, payload)
    .then(({ data }) => {
      dispatch({
        type: UPDATE_KYC,
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
    })
    .catch((error) => {
      dispatch({
        type: UPDATE_KYC,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
      dispatch({
        type: SHOW_TOAST,
        payload: {
          message: error.response.data.message,
          type: TOAST_TYPE.Error
        }
      })
    })
}
