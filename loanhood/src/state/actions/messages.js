import axios from '../../axios'

const errMsg = 'Server is unavailable.'

export const GetMessages = (id, offset) => (dispatch) => {
  dispatch({ type: 'CLEAR_MESSAGES_RESPONSE' })
  axios
    .get(`/messages/${id}?offset=${offset}&limit=${15}`)
    .then(({ data }) => {
      dispatch({
        type: 'GET_MESSAGES',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_MESSAGES',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
