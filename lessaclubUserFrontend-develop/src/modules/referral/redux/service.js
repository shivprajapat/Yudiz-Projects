import axios from 'shared/libs/axios'
import { SHOW_TOAST } from 'modules/toast/redux/action'
import { TOAST_TYPE } from 'shared/constants'
import { apiPaths } from 'shared/constants/apiPaths'
const { GET_REFERRAL_CODE, CLEAR_REFERRAL_RESPONSE } = require('./action')

const errMsg = 'Server is unavailable.'

export const getReferralCode = () => (dispatch) => {
  dispatch({ type: CLEAR_REFERRAL_RESPONSE })
  axios
    .get(`${apiPaths.referral}`)
    .then(({ data }) => {
      dispatch({
        type: GET_REFERRAL_CODE,
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
        type: GET_REFERRAL_CODE,
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
