import axios from '../../axios'

const errMsg = 'Server is unavailable.'

export const GetCurrentUser = () => (dispatch) => {
  dispatch({ type: 'CLEAR_USER_RESPONSE' })
  axios
    .post('/admin/get-profile')
    .then(({ data }) => {
      dispatch({
        type: 'GET_USER',
        payload: {
          data: data.data,
          resMessage: '',
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'GET_USER',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
