import axios from '../../axios'

const errMsg = 'Server is unavailable.'

export const GetNotifications = (data) => (dispatch) => {
  dispatch({ type: 'CLEAR_NOTIFICATIONS_RESPONSE' })
  axios
    .post('/admin/messages', data)
    .then(({ data }) => {
      dispatch({
        type: 'GET_NOTIFICATIONS',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_NOTIFICATIONS',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
