import axios from '../axios'
import { CHANGE_PASSWORD, CLEAR_ACCOUNT_MESSAGE } from './constants'
const errMsg = 'Server is unavailable.'

const changePassword = (sOldPassword, sNewPassword, token) => async (dispatch) => {
  dispatch({ type: CLEAR_ACCOUNT_MESSAGE })
  await axios.post('/auth/change-password/v1', { sOldPassword, sNewPassword }, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: CHANGE_PASSWORD,
      payload: {
        resMessage: response.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: CHANGE_PASSWORD,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export { changePassword }
