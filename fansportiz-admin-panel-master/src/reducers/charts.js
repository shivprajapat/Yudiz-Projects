import { CLEAR_CHARTS_MESSAGE, USER_REGISTRATIONS } from '../actions/constants'

export default (state = { }, action = {}) => {
  switch (action.type) {
    case USER_REGISTRATIONS:
      return {
        ...state,
        userRegistrations: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_CHARTS_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
