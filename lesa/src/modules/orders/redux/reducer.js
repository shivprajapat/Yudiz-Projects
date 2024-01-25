import { GET_ORDERS, CLEAR_GET_ORDERS_RESPONSE } from './action'

export const orders = (state = {}, action = {}) => {
  switch (action.type) {
    case GET_ORDERS:
      return {
        ...state,
        userOrders: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_GET_ORDERS_RESPONSE:
      return {
        resStatus: false,
        resMessage: '',
        userOrders: null
      }
    default:
      return state
  }
}
