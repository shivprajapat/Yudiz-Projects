import { GET_PAYMENT_CARDS, CLEAR_GET_PAYMENT_CARDS_RESPONSE } from './action'

export const paymentCards = (state = {}, action = {}) => {
  switch (action.type) {
    case GET_PAYMENT_CARDS:
      return {
        ...state,
        paymentCardList: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_GET_PAYMENT_CARDS_RESPONSE:
      return {
        ...state,
        paymentCardList: {},
        resStatus: '',
        resMessage: ''
      }
    default:
      return state
  }
}
