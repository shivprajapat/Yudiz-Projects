import axios from '../../axios'

const errMsg = 'Server is unavailable.'

export const GetFees = (val) => (dispatch) => {
  dispatch({ type: 'CLEAR_FEES_RESPONSE' })
  axios
    .get('/app-config')
    .then(({ data }) => {
      dispatch({
        type: 'GET_FEES',
        payload: {
          data: data.data.fees,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_FEES',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const UpdateFees = (val) => (dispatch) => {
  dispatch({ type: 'CLEAR_FEES_RESPONSE' })

  axios
    .put('/app-config', val)
    .then(({ data }) => {
      dispatch({
        type: 'UPDATE_FEES',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'UPDATE_FEES',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
