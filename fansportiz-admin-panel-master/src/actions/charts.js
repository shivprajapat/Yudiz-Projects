import axios from '../axios'
import { USER_REGISTRATIONS } from './constants'

export const getUserRegistrations = (token) => async (dispatch) => {
  await axios.get('/charts/user-registration', { headers: { Authorization: token } }).then((response) => {
    dispatch({
      type: USER_REGISTRATIONS,
      payload: {
        data: response.data.data ? response.data.data : {},
        resStatus: true
      }
    })
  }).catch(() => {
    dispatch({
      type: USER_REGISTRATIONS,
      payload: {
        data: [],
        resStatus: false
      }
    })
  })
}
