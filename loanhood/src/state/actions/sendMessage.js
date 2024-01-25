import axios from '../../axios'

const errMsg = 'Server is unavailable.'

export const SendMessages = (data) => (dispatch) => {
  dispatch({ type: 'CLEAR_SEND_MESSAGES_RESPONSE' })
  axios
    .post('/messages', data)
    .then(({ data }) => {
      dispatch({
        type: 'SEND_MESSAGES',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'SEND_MESSAGES',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
