import { CHANGE_PASSWORD, CLEAR_ACCOUNT_MESSAGE, CLEAR_ACCOUNT_PROPS } from '../actions/constants'

export default (state = { }, action = {}) => {
  switch (action.type) {
    case CHANGE_PASSWORD:
      return {
        ...state,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_ACCOUNT_MESSAGE:
      return {
        resMessage: ''
      }
    case CLEAR_ACCOUNT_PROPS:
      return {
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
