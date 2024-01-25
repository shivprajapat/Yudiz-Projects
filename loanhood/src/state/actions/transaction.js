import axios from '../../axios'

const errMsg = 'Server is unavailable.'

export const GetTransactions = (val) => (dispatch) => {
  dispatch({ type: 'CLEAR_RENTALS_RESPONSE' })
  axios
    .post('/admin/rental-transactions', val)
    .then(({ data }) => {
      dispatch({
        type: 'GET_TRANSACTIONS',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_TRANSACTIONS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
