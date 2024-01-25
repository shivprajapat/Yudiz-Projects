import axios from '../../axios'

const errMsg = 'Server is unavailable.'

export const LoginUser = (email, password) => (dispatch) => {
  dispatch({ type: 'CLEAR_AUTH_RESPONSE' })
  axios
    .post('/admin/login', { emailId: email, password: password })
    .then(({ data }) => {
      localStorage.setItem('userToken', data.data.token)
      dispatch({
        type: 'LOGIN',
        payload: {
          token: data.data.token,
          data: data.data.update,
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'LOGIN',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}

export const Logout = () => (dispatch) => {
  dispatch({ type: 'CLEAR_AUTH_RESPONSE' })
  axios
    .post('/admin/logout')
    .then(({ data }) => {
      localStorage.clear()
      dispatch({
        type: 'LOGOUT',
        payload: {
          resMessage: data.message,
          resStatus: true
        }
      })
    })
    .catch((error) => {
      dispatch({
        type: 'LOGOUT',
        payload: {
          resStatus: false,
          resMessage: error.response ? error.response.data.message : errMsg
        }
      })
    })
}
