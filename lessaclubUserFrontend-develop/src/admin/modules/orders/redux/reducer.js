import { ADMIN_CLEAR_GET_ORDERS, ADMIN_GET_ORDERS } from './action'

export const adminOrders = (state = {}, action = {}) => {
  switch (action.type) {
    case ADMIN_GET_ORDERS:
      return {
        ...state,
        orders: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case ADMIN_CLEAR_GET_ORDERS:
      return {
        ...state,
        orders: {},
        resStatus: false,
        resMessage: ''
      }

    default:
      return state
  }
}
