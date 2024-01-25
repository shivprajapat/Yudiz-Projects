import { SET_NOTIFICATION } from './ActionTypes'

export const setNotification = (isNotification) => {
  return {
    type: SET_NOTIFICATION,
    payload: isNotification
  }
}
