import axios from '../axios'
import { GET_TRANSACTION_LOGS, CLEAR_APILOGS_MESSAGE } from './constants'
const errMsg = 'Server is unavailable.'

const apiLogsTransaction = (id, eType, token) => async (dispatch) => {
  dispatch({ type: CLEAR_APILOGS_MESSAGE })
  await axios.get(`/transaction-logs/${id}/v1/?eType=${eType}`, { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: GET_TRANSACTION_LOGS,
      payload: {
        data: response.data.data,
        resMessage: response.data.data.message,
        resStatus: true
      }
    })
  }).catch((error) => {
    dispatch({
      type: GET_TRANSACTION_LOGS,
      payload: {
        resMessage: error.response ? error.response.data.message : errMsg,
        resStatus: false
      }
    })
  })
}

export { apiLogsTransaction }
