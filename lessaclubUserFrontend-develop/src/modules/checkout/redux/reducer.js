import {
  ORDER_CREATION,
  CLEAR_ORDER_CREATION_RESPONSE,
  ORDER_UPDATE,
  CLEAR_ORDER_UPDATE_RESPONSE,
  CLEAR_ORDER_PAYMENT_RESPONSE,
  ORDER_PAYMENT,
  PENDING_ORDER,
  CLEAR_PENDING_ORDER_RESPONSE,
  STOCK_AVAILABILITY,
  CLEAR_STOCK_AVAILABILITY_RESPONSE,
  REFERRAL_DISCOUNT,
  CLEAR_REFERRAL_DISCOUNT_RESPONSE
} from './action'

export const checkout = (state = {}, action = {}) => {
  switch (action.type) {
    case ORDER_CREATION:
      return {
        ...state,
        orderCreation: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        orderCreated: true
      }
    case ORDER_UPDATE:
      return {
        ...state,
        orderUpdate: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        orderUpdated: true
      }
    case ORDER_PAYMENT:
      return {
        ...state,
        cardPayment: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage,
        orderPayment: action.payload.orderPayment
      }
    case PENDING_ORDER:
      return {
        ...state,
        pendingOrder: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case STOCK_AVAILABILITY:
      return {
        ...state,
        stockAvailability: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case REFERRAL_DISCOUNT:
      return {
        ...state,
        referralDiscount: action.payload.data,
        resStatus: action.payload.resStatus,
        resMessage: action.payload.resMessage
      }
    case CLEAR_PENDING_ORDER_RESPONSE:
      return {
        ...state,
        pendingOrder: {},
        resStatus: '',
        resMessage: ''
      }
    case CLEAR_ORDER_UPDATE_RESPONSE:
      return {
        ...state,
        orderUpdate: {},
        resStatus: false,
        resMessage: '',
        orderUpdated: false
      }
    case CLEAR_ORDER_CREATION_RESPONSE:
      return {
        ...state,
        orderCreation: {},
        resStatus: '',
        resMessage: '',
        orderCreated: false
      }
    case CLEAR_ORDER_PAYMENT_RESPONSE:
      return {
        ...state,
        cardPayment: {},
        resStatus: '',
        resMessage: '',
        orderPayment: false
      }
    case CLEAR_STOCK_AVAILABILITY_RESPONSE:
      return {
        ...state,
        stockAvailability: {},
        resStatus: '',
        resMessage: ''
      }
    case CLEAR_REFERRAL_DISCOUNT_RESPONSE:
      return {
        ...state,
        referralDiscount: {},
        resStatus: '',
        resMessage: ''
      }
    default:
      return state
  }
}
