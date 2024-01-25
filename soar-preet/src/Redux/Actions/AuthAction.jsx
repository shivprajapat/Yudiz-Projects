import { SET_LOGIN_STATUS } from './ActionTypes'

export const setLoginStatus = (isLoggedIn) => {
  return {
    type: SET_LOGIN_STATUS,
    payload: isLoggedIn
  }
}
