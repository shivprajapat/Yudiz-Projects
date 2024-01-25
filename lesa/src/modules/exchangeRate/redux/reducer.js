import { CLEAR_EXCHANGE_RATE_RESPONSE, GET_EXCHANGE_RATE } from './action'

export const exchangeRate = (state = {}, action = {}) => {
  switch (action.type) {
    case GET_EXCHANGE_RATE:
      return {
        ...state,
        exchangeRateData: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_EXCHANGE_RATE_RESPONSE:
      return {
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
