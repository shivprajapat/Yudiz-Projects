import { CLEAR_APILOGS_MESSAGE, GET_TRANSACTION_LOGS } from '../actions/constants'

export default (state = { }, action = {}) => {
  switch (action.type) {
    case GET_TRANSACTION_LOGS:
      return {
        ...state,
        logs: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_APILOGS_MESSAGE:
      return {
        resMessage: ''
      }
    default:
      return state
  }
}
