import { CLEAR_CURRENCY_CONVERTER_RESPONSE, GET_CURRENCY_CONVERTER } from './action'

export const currencyConverter = (state = {}, action = {}) => {
  switch (action.type) {
    case GET_CURRENCY_CONVERTER:
      return {
        ...state,
        convertedData: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_CURRENCY_CONVERTER_RESPONSE:
      return {
        resStatus: false,
        resMessage: ''
      }
    default:
      return state
  }
}
